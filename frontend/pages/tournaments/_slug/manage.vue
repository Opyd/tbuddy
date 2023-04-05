<template>
  <v-main>
    <v-row justify="center">
      <v-col xl="8" lg="12" md="12" sm="12" cols="12">
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
            <v-col cols="12" sm="6" md="3" lg="3">
              <v-card outlined elevation="2" class="fill-height">
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
                    :key="team">
                    <v-row id="alternateColors">
                      <v-col :cols="tournament.started ? 10 : 6"
                        ><span>{{ team }}</span></v-col
                      >
                      <v-col cols="2"
                        ><nuxt-link :to="`/teams/${team}`"
                          ><v-icon right small>
                            mdi-open-in-new
                          </v-icon></nuxt-link
                        ></v-col
                      >
                      <v-col v-if="!tournament.started" cols="4">
                        <v-dialog
                          v-model="removeDialog"
                          persistent
                          max-width="290">
                          <template #activator="{on, attrs}">
                            <v-btn
                              color="error"
                              fab
                              x-small
                              v-bind="attrs"
                              v-on="on">
                              <v-icon> mdi-minus </v-icon>
                            </v-btn>
                          </template>
                          <v-card outlined elevation="2">
                            <v-card-title class="text-h5">
                              Remove team?
                            </v-card-title>
                            <v-card-text
                              >Are you sure you want to remove
                              <b>{{ team }}</b> from tournament?
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                color="green darken-1"
                                text
                                @click="removeDialog = false">
                                Disagree
                              </v-btn>
                              <v-btn
                                color="green darken-1"
                                text
                                @click="remove(team)">
                                Agree
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="9" lg="9">
              <v-card outlined elevation="2" align="right">
                <v-card-title>Description</v-card-title>
                <v-card-text
                  ><v-textarea v-model="tournament.description" outlined filled
                /></v-card-text>
                <v-btn
                  class="tw-right-0 tw-mb-2 tw-mr-2"
                  @click="changeDescription"
                  >Change</v-btn
                >
              </v-card>
            </v-col>
            <v-col v-if="!tournament.started" cols="12">
              <v-card outlined elevation="2" class="fill-height">
                <div
                  class="tw-flex tw-justify-center tw-h-full tw-items-center tw-p-3">
                  <i
                    >To select winners/losers, please start the tournament
                    first</i
                  >
                </div>
              </v-card>
            </v-col>
            <v-col v-if="tournament.started" cols="12">
              <v-card outlined elevation="2">
                <v-tabs
                  v-model="tab"
                  align-with-title
                  grow
                  :color="$vuetify.theme.dark ? 'white' : 'blue'">
                  <v-tabs-slider></v-tabs-slider>

                  <v-tab
                    v-for="stage in tournament.stages"
                    :key="stage.stageNr">
                    Round {{ stage.stageNr + 1 }}
                  </v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab">
                  <v-tab-item
                    v-for="stage in tournament.stages"
                    :key="stage.stageNr">
                    <v-card
                      v-for="match in stage.matches"
                      :key="match._id"
                      flat
                      class="tw-p-3">
                      <v-row align="center">
                        <v-col cols="3" align="center">
                          <span
                            class="text-center tw-pb-2"
                            :class="
                              match.winner === (match.teamA ?? '')
                                ? 'tw-border-b-2 tw-border-b-green-500'
                                : 'tw-border-b-2 tw-border-b-red-500'
                            ">
                            {{ match.teamA ?? 'TBD' }}
                          </span>
                        </v-col>
                        <v-col cols="1" align="center"
                          ><span class="text-center">VS</span></v-col
                        >
                        <v-col cols="3" align="center">
                          <span
                            class="text-center tw-pb-2"
                            :class="
                              match.winner === (match.teamB ?? '')
                                ? 'tw-border-b-2 tw-border-b-green-500'
                                : 'tw-border-b-2 tw-border-b-red-500'
                            ">
                            {{ match.teamB ?? 'TBD' }}
                          </span>
                        </v-col>
                        <v-col cols="5">
                          <p class="text-center">
                            Finished: {{ match.finished }}
                          </p>
                          <v-row justify="center">
                            <v-col cols="6">
                              <v-select
                                v-model="selectedTeam"
                                outlined
                                label="Choose winner"
                                :disabled="match.finished"
                                :items="[match.teamA, match.teamB]"
                                :values="[match.teamA, match.teamB]"></v-select>
                            </v-col>
                            <v-col cols="6">
                              <v-btn
                                :disabled="match.finished"
                                @click="setWinner(stage.stageNr, match._id)"
                                >Accept</v-btn
                              >
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-tab-item>
                </v-tabs-items>
              </v-card>
            </v-col>
            <v-col cols="12"> </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
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
      removeDialog: false,
    }),
    async fetch() {
      try {
        const res = await this.$axios.get(
          `/tournaments/slug/${this.$route.params.slug}`,
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
            `tournaments/match/${this.tournament._id}`,
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
      async remove(teamtag) {
        try {
          await this.$axios.patch(`tournaments/kick/${this.tournament._id}`, {
            teamtag,
          });
          this.$toast.success('Successfully removed team');
          this.tournament.participants = this.tournament.participants.filter(
            team => team !== teamtag,
          );
        } catch (e) {
          console.log(e.response);
        }
        this.removeDialog = false;
      },
    },
  };
</script>

<style scoped></style>
