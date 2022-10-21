import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  //Register method
  async signUp(createUserDto: CreateUserDto) {
    //Checking if user exists
    const userExists = await this.userService.findByUsername(
      createUserDto.username,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    //hashing password with argon
    const hash = await argon2.hash(createUserDto.password);
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hash,
    });

    //generating tokens for client
    const tokens = await this.getTokens(newUser._id, newUser.username);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return tokens;
  }

  //Login method
  async signIn(authDto: AuthDto) {
    //Checking if user exists
    const user = await this.userService.findByUsername(authDto.username);
    if (!user) throw new BadRequestException('User does not exists');

    //Checking if the password matches
    const passwordMatches = await argon2.verify(
      user.password,
      authDto.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Username or password is incorrect');

    //generating tokens for client
    const tokens = await this.getTokens(user._id, user.username);

    //updating the user's refresh token
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  //Logout method
  async logout(userId: string) {
    //Sets refresh token to NULL
    return this.userService.update(userId, { refreshToken: null });
  }

  //Function to hash a refresh token and update it in user's document
  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshedToken = await argon2.hash(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshedToken,
    });
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15min',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refresTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findByUsername(userId);
    if (!user || !user.refreshToken)
      throw new BadRequestException('Access Denied');

    //Checks if refreshToken from request matches one from document
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new BadRequestException('Access Denied');

    const tokens = await this.getTokens(user._id, user.username);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }
}
