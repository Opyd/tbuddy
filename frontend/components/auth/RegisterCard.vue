<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <p class="tw-text-2xl tw-text-center tw-font-bold">Create new account</p>
      <v-text-field
        v-model="username"
        :rules="usernameRules"
        label="Username"
        required>
        <v-icon slot="prepend"> mdi-account </v-icon>
      </v-text-field>
      <div class="tw-flex tw-flex-nowrap tw-w-full tw-justify-center tw-gap-10">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required>
          <v-icon slot="prepend"> mdi-email </v-icon>
        </v-text-field>

        <v-text-field
          v-model="emailRepeated"
          :rules="emailRules"
          label="Repeat e-mail"
          required
          :error-messages="areEmailsSame ? '' : 'Email must match'">
          <v-icon slot="prepend"> mdi-email </v-icon>
        </v-text-field>
      </div>
      <div class="tw-flex tw-flex-nowrap tw-w-full tw-justify-center tw-gap-10">
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
          required
          type="password"
          class="">
          <v-icon slot="prepend"> mdi-lock </v-icon>
        </v-text-field>

        <v-text-field
          v-model="passwordRepeated"
          label="Repeat password"
          required
          type="password"
          :rules="passwordRules"
          :error-messages="arePasswordsSame ? '' : 'Passwords must match'">
          <v-icon slot="prepend"> mdi-lock </v-icon>
        </v-text-field>
      </div>
      <v-checkbox v-model="checkbox" :rules="checkboxRules">
        <template #label>
          <div>
            I agree to
            <v-tooltip bottom>
              <template #activator="{on}">
                <a target="_blank" href="/terms" @click.stop v-on="on">
                  Terms and Privacy Policy
                </a>
              </template>
              Opens in new window
            </v-tooltip>
          </div>
        </template>
      </v-checkbox>
      <v-container class="d-flex flex-row justify-center tw-mt-3">
        <v-btn color="success" class="mr-4" @click="validate">
          Create account
        </v-btn>
        <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  import {createAvatar} from '@dicebear/core';
  import {bottts} from '@dicebear/collection';

  export default {
    name: 'RegisterCard',
    data() {
      return {
        valid: true,
        status: false,
        username: '',
        errors: [],
        usernameRules: [v => !!v || 'Username is required'],
        checkboxRules: [v => !!v || 'Agreeing is required'],
        password: '',
        passwordRepeated: '',
        passwordRules: [v => !!v || 'Password is required'],
        email: '',
        passwordMismatch: false,
        emailRepeated: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        checkbox: false,
      };
    },
    computed: {
      arePasswordsSame() {
        return this.password === this.passwordRepeated;
      },
      areEmailsSame() {
        return this.email === this.emailRepeated;
      },
    },
    methods: {
      async validate() {
        await this.$refs.form.validate();
        if (!this.valid) {
          this.$toast.error('Check if data is correct');
          return;
        }
        await this.register();
      },
      reset() {
        this.$refs.form.reset();
      },
      resetValidation() {
        this.$refs.form.resetValidation();
      },

      async register() {
        try {
          const avatar = await createAvatar(bottts, {
            seed: this.username,
          }).toDataUri();
          const res = await this.$axios.post('auth/signup', {
            username: this.username,
            password: this.password,
            email: this.email,
            avatar,
          });
          if (res.status === 201) {
            this.$toast.success('Successfully created an account');
          }
        } catch (e) {
          this.$toast('Something went wrong');
        }
      },
    },
  };
</script>

<style scoped></style>
