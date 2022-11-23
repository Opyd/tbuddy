<template>
  <div>
    <v-form ref="form" @submit.prevent="login">
      <p class="tw-text-2xl tw-text-center tw-font-bold">
        Log in to existing account
      </p>
      <v-text-field
        v-model="username"
        :rules="nameRules"
        label="Username"
        required
      >
        <v-icon slot="prepend"> mdi-account </v-icon>
      </v-text-field>

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="Password"
        required
        type="password"
      >
        <v-icon slot="prepend"> mdi-lock </v-icon>
      </v-text-field>

      <v-checkbox v-model="checkbox" label="Remember me" required></v-checkbox>

      <v-container class="d-flex flex-row justify-center">
        <v-btn
          color="success"
          class="mr-4"
          @click="login"
          @keyup.enter.native="login"
        >
          Log In
        </v-btn>

        <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>
      </v-container>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'LoginCard',
  data() {
    return {
      valid: true,
      username: '',
      nameRules: [(v) => !!v || 'Username is required'],
      password: '',
      passwordRules: [(v) => !!v || 'Password is required'],
      checkbox: false,
    }
  },
  methods: {
    validate() {
      this.$refs.form.validate()
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    async login() {
      this.validate()
      try {
        await this.$auth.loginWith('local', {
          data: {
            username: this.username,
            password: this.password,
          },
        })
        console.log(this.$auth.user)
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

<style scoped></style>
