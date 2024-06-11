import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { Request } from 'express';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

/**
 * Controller for AuthModule with all the endpoints
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  /**
   * Injecting service
   * @param authService {AuthService}
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint used to create new user account
   * @param createUserDto
   * @returns JWT tokens
   */
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  /**
   * Allows user to log in
   * @param authDto
   * @returns JWT Tokens
   */
  @Post('signin')
  signin(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  /**
   * Allows user to logout
   * @param req Extracting user object from request
   */
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  /**
   * Refreshes user's AccessToken using RefreshToken
   * @param req
   */
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Req() req: Request) {
    const username = req.user['username'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(username, refreshToken);
  }
}
