<template>
  <v-container>
    <v-main>
      <v-row justify="center">
        <v-col xl="8" lg="12" md="12" sm="12" cols="12" align="center">
          <v-card
            v-if="!canCreateTournament"
            outlined
            elevation="2"
            class="tw-p-5">
            <p
              class="md:tw-text-3xl tw-text-center sm:tw-text-xl xs:tw-text-sm">
              You can't create a new tournament
            </p>
            <v-card-text
              >You are a member of a team or are already running another
              tournament.
            </v-card-text>
          </v-card>
          <v-card v-else outlined elevation="2" class="tw-p-5">
            <p
              class="md:tw-text-3xl tw-text-center sm:tw-text-xl xs:tw-text-sm">
              Create tournament
            </p>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="title"
                      :rules="notEmptyRule"
                      required
                      outlined
                      label="Title" />
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="teams"
                      outlined
                      :items="nrOfTeams"
                      :rules="notEmptyRule"
                      label="Number of teams"
                      required />
                  </v-col>
                </v-row>
                <v-textarea
                  v-model="description"
                  required
                  outlined
                  :rules="notEmptyRule"
                  label="Description" />
              </v-card-text>
            </v-form>
            <v-btn color="primary" @click="validate">Create Tournament</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<script>
  export default {
    name: 'CreateTournament',
    middleware: ['auth'],
    data: () => ({
      title: '',
      description: '',
      valid: true,
      nrOfTeams: [4, 8, 16, 32, 64],
      teams: 0,
      user: {},
      notEmptyRule: [v => !!v || 'Field is required'],
    }),
    head: () => ({
      title: 'Create Tournament',
    }),
    computed: {
      canCreateTournament() {
        return this.user.currentTeam === null && this.user.role !== 'ORGANIZER';
      },
    },
    created() {
      this.user = this.$auth.user;
    },
    methods: {
      async createTournament() {
        try {
          let res = await this.$axios.post('tournaments', {
            title: this.title,
            description: this.description,
            nrOfTeams: this.teams,
          });
          const status = res.status;
          res = res.data;
          if (status === 201) {
            await this.$router.push(`/tournaments/${res.slug}`);
          }
        } catch (e) {
          this.$toast.error('Something went wrong');
        }
      },
      async validate() {
        await this.$refs.form.validate();
        if (!this.valid) {
          this.$toast.error('Check if data is correct');
          return;
        }
        this.createTournament();
      },
    },
  };
</script>

<style scoped></style>
