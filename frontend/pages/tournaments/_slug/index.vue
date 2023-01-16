<template>
  <v-main>
    <div v-if="$fetchState.pending" class="tw-w-full">Loading...</div>
    <div v-else class="">
      <v-row>
        <v-col
          v-if="
            $auth.user !== null && tournament.organizer === $auth.user.username
          "
          cols="3">
          <NuxtLink :to="`${slug}/manage`"
            ><v-btn color="primary" outlined>Manage</v-btn></NuxtLink
          >
        </v-col>
        <v-col cols="12">
          <div
            class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-border-2 tw-p-5 tw-rounded">
            <v-icon size="64">mdi-trophy</v-icon>
            <span
              style="font-family: 'Unbounded', sans-serif"
              class="tw-text-center tw-text-3xl"
              >{{ tournament.title }}</span
            >
            <span class="tw-text-center"
              ><v-icon>mdi-account</v-icon> {{ tournament.organizer }}</span
            >
            <span v-if="!tournament.started" class="tw-text-center">
              Not started yet <v-icon>mdi-checkbox-blank-circle</v-icon>
            </span>
            <span
              v-if="tournament.started && !tournament.finished"
              class="tw-text-center">
              In progress
              <v-icon color="yellow" class="tw-animate-pulse"
                >mdi-checkbox-blank-circle</v-icon
              >
            </span>
            <span v-if="tournament.finished" class="tw-text-center">
              Finished
              <v-icon color="green">mdi-checkbox-blank-circle</v-icon>
            </span>
          </div>
        </v-col>
        <v-col cols="12">
          <v-card>
            {{ tournament.description }}
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="6" md="3">
          <v-card>
            <v-card-title
              >Teams: {{ tournament.participants.length }} /
              {{ tournament.nrOfTeams }}</v-card-title
            >
            <v-list>
              <v-list-item v-for="team in tournament.participants" :key="team">
                {{ team }}
                <v-list-item-action>
                  <nuxt-link :to="`/teams/${team}`"
                    ><v-icon small> mdi-open-in-new </v-icon></nuxt-link
                  >
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
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
            <v-tab-item
              v-for="(stage, index) in tournament.stages"
              :key="stage.stageNr">
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
                      <v-icon
                        v-if="
                          index === tournament.stages.length - 1 &&
                          match.winner === (match.teamA ?? '')
                        "
                        color="#f59e0b"
                        >mdi-crown</v-icon
                      >
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
                      <v-icon
                        v-if="
                          index === tournament.stages.length - 1 &&
                          match.winner === (match.teamB ?? '')
                        "
                        color="#f59e0b"
                        >mdi-crown</v-icon
                      >
                      {{ match.teamB ?? 'TBD' }}
                    </p>
                  </v-col>
                  <v-col cols="5">
                    <p class="text-center">Finished: {{ match.finished }}</p>
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
    name: 'TournamentPage',
    data: () => ({
      tournament: {},
      slug: '',
      tab: null,
    }),
    async fetch() {
      try {
        const res = await this.$axios.get(
          `/tournaments/${this.$route.params.slug}`,
        );
        this.tournament = res.data;
        this.slug = this.$route.params.slug;
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
    computed: {},
  };
</script>

<style scoped></style>
