<template>
  <v-main>
    <div v-if="$fetchState.pending" class="tw-w-full">Loading...</div>
    <div v-else>
      <p>
        Participants: {{ tournament.participants.length }} /
        {{ tournament.nrOfTeams }}
      </p>
      <v-btn :disabled="!canStartTournament" @click="startTournament"
        >Start the tournament</v-btn
      >
      <v-row>
        <v-col>
          <v-tabs
            v-model="tab"
            align-with-title
            grow
            :color="$vuetify.theme.dark ? 'white' : 'blue'">
            <v-tabs-slider></v-tabs-slider>

            <v-tab v-for="stage in tournament.stages" :key="stage.stageNr">
              Round {{ stage.stageNr + 1 }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item v-for="stage in tournament.stages" :key="stage.stageNr">
              <v-card
                v-for="match in stage.matches"
                :key="match._id"
                flat
                class="tw-p-3">
                <v-row align="center">
                  <v-col cols="3">
                    <p
                      class="text-center"
                      :class="
                        match.winner === (match.teamA ?? '')
                          ? 'tw-border-b tw-border-b-green-500'
                          : ''
                      ">
                      {{ match.teamA ?? 'TBD' }}
                    </p>
                  </v-col>
                  <v-col cols="1"><p class="text-center">VS</p></v-col>
                  <v-col cols="3">
                    <p
                      class="text-center"
                      :class="
                        match.winner === (match.teamB ?? '')
                          ? 'tw-border-b tw-border-b-green-500'
                          : ''
                      ">
                      {{ match.teamB ?? 'TBD' }}
                    </p>
                  </v-col>
                  <v-col cols="5">
                    <p class="text-center">Finished: {{ match.finished }}</p>
                    <v-row align="center">
                      <v-col cols="6">
                        <v-select
                          v-model="selectedTeam"
                          placeholder="Choose winner"
                          :items="[match.teamA, match.teamB]"
                          :values="[match.teamA, match.teamB]"></v-select>
                      </v-col>
                      <v-col cols="6">
                        <v-btn @click="setWinner(stage.stageNr, match._id)"
                          >Accept</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </div>
  </v-main>
</template>

<script>
  export default {
    name: 'Manage',
    middleware: ['auth'],
    data: () => ({
      tournament: {},
      tab: null,
      selectedTeam: null,
    }),
    async fetch() {
      try {
        const res = await this.$axios.get(
          `/tournaments/${this.$route.params.slug}`,
        );
        this.tournament = res.data;
        if (this.tournament.organizer !== this.$auth.user.username) {
          return this.$nuxt.error({statusCode: 400, message: 'Bad request'});
        }
      } catch (e) {
        if (e.response.status === 404) {
          return this.$nuxt.error({statusCode: 404, message: 'Team Not found'});
        }
      }
    },
    head() {
      return {
        title: this.tournament.title,
      };
    },
    computed: {
      canStartTournament() {
        return (
          this.tournament.participants.length === this.tournament.nrOfTeams &&
          this.tournament.started === false
        );
      },
    },
    methods: {
      async startTournament() {
        try {
          const res = await this.$axios.patch(
            `tournaments/start/${this.tournament._id}`,
          );
          this.tournament = res.data;
          this.$toast.success('Successfully started the tournament');
        } catch (e) {
          this.$toast.error(e.response.data.message);
        }
      },
      async setWinner(stageNr, matchId) {
        try {
          const res = await this.$axios.patch(
            `tournaments/${this.tournament._id}/match`,
            {
              stageNr,
              matchId,
              winner: this.selectedTeam,
              result: 'ababa',
            },
          );
          this.tournament = res.data;
        } catch (e) {
          this.$toast.error(e.response.data.message);
        }
      },
    },
  };
</script>

<style scoped></style>
