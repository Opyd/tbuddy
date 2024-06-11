<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <p class="tw-text-2xl tw-text-center tw-font-bold">Create new account</p>
      <v-text-field
        id="username"
        v-model="username"
        :rules="usernameRules"
        label="Username"
        required>
        <v-icon slot="prepend"> mdi-account </v-icon>
      </v-text-field>
      <div class="tw-flex tw-flex-nowrap tw-w-full tw-justify-center tw-gap-10">
        <v-text-field
          id="email"
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          type="email"
          required>
          <v-icon slot="prepend"> mdi-email </v-icon>
        </v-text-field>

        <v-text-field
          id="repeatEmail"
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
          id="password"
          v-model="password"
          :rules="passwordRules"
          label="Password"
          required
          type="password"
          class="">
          <v-icon slot="prepend"> mdi-lock </v-icon>
        </v-text-field>

        <v-text-field
          id="repeatPassword"
          v-model="passwordRepeated"
          label="Repeat password"
          required
          type="password"
          :rules="passwordRules"
          :error-messages="arePasswordsSame ? '' : 'Passwords must match'">
          <v-icon slot="prepend"> mdi-lock </v-icon>
        </v-text-field>
      </div>
      <v-checkbox id="terms" v-model="checkbox" :rules="checkboxRules">
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
          const res = await this.$axios.post('auth/signup', {
            username: this.username,
            password: this.password,
            email: this.email,
            avatar: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20180%22%20fill%3D%22none%22%20shape-rendering%3D%22auto%22%3E%3Cdesc%3E%22Bottts%22%20by%20%22Pablo%20Stanley%22%2C%20licensed%20under%20%22Free%20for%20personal%20and%20commercial%20use%22.%20%2F%20Remix%20of%20the%20original.%20-%20Created%20with%20dicebear.com%3C%2Fdesc%3E%3Cmetadata%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%3E%3Crdf%3ARDF%3E%3Ccc%3AWork%3E%3Cdc%3Atitle%3EBottts%3C%2Fdc%3Atitle%3E%3Cdc%3Acreator%3E%3Ccc%3AAgent%20rdf%3Aabout%3D%22https%3A%2F%2Ftwitter.com%2Fpablostanley%22%3E%3Cdc%3Atitle%3EPablo%20Stanley%3C%2Fdc%3Atitle%3E%3C%2Fcc%3AAgent%3E%3C%2Fdc%3Acreator%3E%3Cdc%3Asource%3Ehttps%3A%2F%2Fbottts.com%2F%3C%2Fdc%3Asource%3E%3Ccc%3Alicense%20rdf%3Aresource%3D%22https%3A%2F%2Fbottts.com%2F%22%20%2F%3E%3C%2Fcc%3AWork%3E%3C%2Frdf%3ARDF%3E%3C%2Fmetadata%3E%3Cmask%20id%3D%22e0vdv0yc%22%3E%3Crect%20width%3D%22180%22%20height%3D%22180%22%20rx%3D%220%22%20ry%3D%220%22%20x%3D%220%22%20y%3D%220%22%20fill%3D%22%23fff%22%20%2F%3E%3C%2Fmask%3E%3Cg%20mask%3D%22url(%23e0vdv0yc)%22%3E%3Cg%20transform%3D%22translate(0%2066)%22%3E%3Cmask%20id%3D%22k1zk18js%22%20style%3D%22mask-type%3Aalpha%22%20maskUnits%3D%22userSpaceOnUse%22%20x%3D%2214%22%20y%3D%2216%22%20width%3D%22152%22%20height%3D%2244%22%3E%3Cpath%20d%3D%22M14.98%2020.91C14%2022.84%2014%2025.36%2014%2030.4v15.2c0%205.04%200%207.56.98%209.49a9%209%200%200%200%203.93%203.93c1.93.98%204.45.98%209.49.98h7.2c5.04%200%207.56%200%209.49-.98a9%209%200%200%200%203.93-3.93c.98-1.93.98-4.45.98-9.5V30.4c0-5.04%200-7.56-.98-9.49A9%209%200%200%200%2045.09%2017c-1.93-.98-4.45-.98-9.5-.98h-7.2c-5.04%200-7.56%200-9.49.98A9%209%200%200%200%2015%2020.91ZM130.98%2020.91c-.98%201.93-.98%204.45-.98%209.49v15.2c0%205.04%200%207.56.98%209.49a9%209%200%200%200%203.93%203.93c1.93.98%204.45.98%209.5.98h7.19c5.04%200%207.56%200%209.49-.98a9%209%200%200%200%203.93-3.93c.98-1.93.98-4.45.98-9.5V30.4c0-5.04%200-7.56-.98-9.49a9%209%200%200%200-3.93-3.92c-1.93-.98-4.45-.98-9.5-.98h-7.19c-5.04%200-7.56%200-9.49.98a9%209%200%200%200-3.93%203.93Z%22%20fill%3D%22%230076DE%22%2F%3E%3C%2Fmask%3E%3Cg%20mask%3D%22url(%23k1zk18js)%22%3E%3Cpath%20d%3D%22M0%200h180v76H0V0Z%22%20fill%3D%22%2300acc1%22%2F%3E%3Cpath%20d%3D%22M0%200h180v76H0V0Z%22%20fill%3D%22%23fff%22%20fill-opacity%3D%22.3%22%2F%3E%3Cpath%20fill%3D%22%23000%22%20fill-opacity%3D%22.1%22%20d%3D%22M0%2038h180v38H0z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(41)%22%3E%3Cmask%20id%3D%22rvbru8zp%22%20style%3D%22mask-type%3Aalpha%22%20maskUnits%3D%22userSpaceOnUse%22%20x%3D%2238%22%20y%3D%2212%22%20width%3D%2224%22%20height%3D%2240%22%3E%3Cpath%20d%3D%22m53.57%2039%201.97-4.61-6.19-10.68%202.9-10.63-2.9-.79-3.22%2011.84%206.05%2010.43-2.1%204.44H38v13h24V39h-8.43Z%22%20fill%3D%22%23E6E6E6%22%2F%3E%3C%2Fmask%3E%3Cg%20mask%3D%22url(%23rvbru8zp)%22%3E%3Cpath%20d%3D%22M0%200h100v52H0V0Z%22%20fill%3D%22%2300acc1%22%2F%3E%3Cpath%20d%3D%22M0%206h100v52H0V6Z%22%20fill%3D%22%23fff%22%20fill-opacity%3D%22.3%22%2F%3E%3Cpath%20fill%3D%22%23fff%22%20fill-opacity%3D%22.2%22%20d%3D%22M38%2039h24v13H38z%22%2F%3E%3C%2Fg%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%228%22%20r%3D%228%22%20fill%3D%22%23FFE65C%22%2F%3E%3Ccircle%20cx%3D%2253%22%20cy%3D%225%22%20r%3D%223%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(25%2044)%22%3E%3Cmask%20id%3D%22iiv7qato%22%20style%3D%22mask-type%3Aluminance%22%20maskUnits%3D%22userSpaceOnUse%22%20x%3D%220%22%20y%3D%220%22%20width%3D%22130%22%20height%3D%22120%22%3E%3Cpath%20d%3D%22M0%2012A12%2012%200%200%201%2012%200h106a12%2012%200%200%201%2012%2012v70a38%2038%200%200%201-38%2038H38A38%2038%200%200%201%200%2082V12Z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fmask%3E%3Cg%20mask%3D%22url(%23iiv7qato)%22%3E%3Cpath%20d%3D%22M-2-2h134v124H-2V-2Z%22%20fill%3D%22%2300acc1%22%2F%3E%3Cg%20transform%3D%22translate(-1%20-1)%22%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(52%20124)%22%3E%3Cpath%20d%3D%22M27.05%208.44a2%202%200%201%201%203.9-.88C31.72%2010.96%2034.4%2013%2038%2013c3.6%200%206.28-2.04%207.05-5.44a2%202%200%201%201%203.9.88C47.75%2013.7%2043.43%2017%2038%2017s-9.76-3.3-10.95-8.56Z%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.6%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(38%2076)%22%3E%3Cpath%20d%3D%22M28%2044a20%2020%200%200%200%2019.9-18h41.52a5%205%200%201%200%200-4H47.9A20%2020%200%201%200%2028%2044Z%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.2%22%2F%3E%3Ccircle%20cx%3D%2294%22%20cy%3D%2224%22%20r%3D%222%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2228%22%20cy%3D%2224%22%20r%3D%2216%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.6%22%2F%3E%3Ccircle%20cx%3D%2234%22%20cy%3D%2216%22%20r%3D%223%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'
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
