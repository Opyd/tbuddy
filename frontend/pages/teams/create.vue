<template>
  <div class="tw-w-full tw-flex tw-justify-center">
    <v-card class="tw-w-1/2 tw-p-5">
      <p class="tw-text-3xl tw-text-center">Create your own Team</p>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="name"
          :counter="20"
          :rules="nameRules"
          label="Team Name"
          required></v-text-field>
        <v-row class="flex tw-items-center">
          <v-col align="center">
            <v-text-field
              v-model.lazy="tag"
              :counter="4"
              :rules="tagRules"
              :error-messages="notUniqueTag ? 'Tag is already taken' : ''"
              class="mx-auto"
              label="Team Tag"
              required></v-text-field>
          </v-col>
          <v-col align="center">
            <p class="tw-text-sm">Icon</p>
            <div class="tw-w-full">
              <v-icon
                class="tw-transition tw-p-1 tw-rounded-lg tw-ease-in-out"
                :style="{backgroundColor: color}"
                size="40"
                >{{ currentIcon.name }}</v-icon
              >
            </div>
            <div class="tw-w-full tw-mt-2">
              <v-icon @click="changeIcon(-1)">mdi-menu-left-outline</v-icon>
              <v-icon @click="changeIcon(1)">mdi-menu-right-outline</v-icon>
            </div>
          </v-col>
        </v-row>
        <p class="tw-text-sm text-center mt-2">Team's Main Color</p>
        <v-row justify="center" class="my-2">
          <v-color-picker v-model="color" elevation="15"></v-color-picker>
        </v-row>
        <v-btn color="primary" class="tw-w-full tw-mt-5" @click="validate"
          >Create Team</v-btn
        >
      </v-form>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'CreateTeam',
    middleware: ['auth'],
    error: false,
    data: () => ({
      notUniqueTag: false,
      valid: true,
      name: '',
      tag: '',
      color: '',
      items: [
        'mdi-robot-angry',
        'mdi-flash-outline',
        'mdi-flower-outline',
        'mdi-fruit-pineapple',
        'mdi-horse-variant-fast',
        'mdi-koala',
        'mdi-linux',
        'mdi-ninja',
        'mdi-sausage',
      ],
      currentIcon: {
        name: '',
        index: '',
      },

      nameRules: [v => !!v || 'Team Name is required'],
      tagRules: [
        v => !!v || 'Tag is required',
        v =>
          /^[a-zA-Z0-9]{4}$/.test(v) ||
          'Tag must consists of 4 letters/digits !',
      ],
    }),
    head: () => ({
      title: 'Create your Team',
    }),
    watch: {
      async tag(newValue) {
        if (!(newValue.length === 4)) {
          return;
        }
        try {
          const res = await this.$axios.get(`teams/exists/${newValue}`);
          if (res.data.exists === true) {
            this.notUniqueTag = true;
            return;
          }
          this.notUniqueTag = false;
        } catch (e) {
          this.$toast.error('Something went wrong');
        }
      },
    },
    created() {
      this.currentIcon = {
        name: this.items[0],
        index: 0,
      };
    },
    methods: {
      async validate() {
        await this.$refs.form.validate();
        if (!this.valid) {
          this.$toast.error('Check if data is correct');
          return;
        }
        await this.create();
      },
      reset() {
        this.$refs.form.reset();
      },
      resetValidation() {
        this.$refs.form.resetValidation();
      },

      async create() {
        try {
          const res = await this.$axios.post('teams', {
            name: this.name,
            tag: this.tag.toUpperCase(),
            owner: this.$auth.user.username,
            color: this.color,
            icon: this.currentIcon.name,
          });
          if (res.status === 201) {
            this.$toast.success('Successfully created new Team!');
            await this.$router.push(`/teams/${this.tag}`);
          }
        } catch (e) {
          this.$toast.error('Something went wrong');
          console.log(e.response.data);
        }
      },

      changeIcon(direction) {
        if (this.currentIcon.index + direction > this.items.length - 1) {
          this.currentIcon = {
            name: this.items[0],
            index: 0,
          };
          return;
        }
        if (this.currentIcon.index + direction < 0) {
          this.currentIcon = {
            name: this.items[this.items.length - 1],
            index: this.items.length - 1,
          };
          return;
        }
        this.currentIcon = {
          name: this.items[this.currentIcon.index + direction],
          index: this.currentIcon.index + direction,
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
