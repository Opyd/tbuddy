<template>
  <v-main>
    <div v-if="$fetchState.pending" class="tw-w-full">
      <v-skeleton-loader
        type="list-item-avatar-three-line, article, article"></v-skeleton-loader>
    </div>
    <div v-else>
      <v-row>
        <v-col v-if="!tournament.started" cols="12" align="center">
          <v-btn :disabled="!canStartTournament" @click="startTournament"
            >Start the tournament</v-btn
          >
        </v-col>
        <v-col cols="6" sm="6" md="3" lg="3">
          <v-card class="fill-height">
            <v-card-title>
              <span
                >Teams: {{ tournament.participants.length }} /
                {{ tournament.nrOfTeams }}</span
              >
            </v-card-title>
            <v-list
              id="style-2"
              class="tw-max-h-52 tw-overflow-y-auto tw-overflow-x-hidden">
              <v-list-item
                v-for="team in tournament.participants"
                id="alternateColors"
                :key="team">
                <v-col cols="10"
                  ><span>{{ team }}</span></v-col
                >
                <v-col cols="2"
                  ><nuxt-link :to="`/teams/${team}`"
                    ><v-icon right small> mdi-open-in-new </v-icon></nuxt-link
                  ></v-col
                >
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="9" lg="9">
          <v-card align="right">
            <v-card-title>Description</v-card-title>
            <v-textarea v-model="tournament.description" filled />
            <v-btn class="tw-right-0 tw-m-1" @click="changeDescription"
              >Change</v-btn
            >
          </v-card>
        </v-col>
        <v-col v-if="!tournament.started" cols="12">
          <v-card class="fill-height">
            <div
              class="tw-flex tw-justify-center tw-h-full tw-items-center tw-p-3">
              <i>To select winners/losers, please start the tournament first</i>
            </div>
          </v-card>
        </v-col>
        <v-col v-if="tournament.started" cols="12">
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
        <v-col cols="12"> </v-col>
      </v-row>
    </div>
  </v-main>
</template>

<script>
  export default {
    name: 'Manage',
    components: {},
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
      async changeDescription() {
        try {
          await this.$axios.patch(
            `tournaments/description/${this.tournament._id}`,
            {
              description: this.tournament.description,
            },
          );
          this.$toast.success('Successfully changed description');
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
