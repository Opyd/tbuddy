<template>
  <v-card outlined elevation="2" class="fill-height">
    <div class="tw-w-full">
      <p
        class="tw-text-2xl tw-text-center tw-pt-3"
        style="font-family: 'Unbounded', sans-serif">
        Upcoming Matches
      </p>
    </div>
    <v-divider></v-divider>
    <div v-if="$fetchState.pending">
      <v-col md="12" sm="12" class="tw-w-full tw-flex tw-gap-3">
        <v-skeleton-loader
          class="tw-w-full"
          type="list-item-three-line, list-item-two-line"></v-skeleton-loader>
      </v-col>
    </div>
    <div v-else>
      <v-row>
        <v-col v-if="matches.length === 0" cols="12" align="center">
          <div class="tw-mt-5">
            <small><i>No upcoming matches</i></small>
          </div>
        </v-col>
        <v-col
          md="12"
          sm="12"
          class="tw-w-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-max-h-52 tw-overflow-y-auto">
          <v-list-item
            v-for="item in matches"
            id="alternateColors"
            :key="item.id"
            class="tw-w-full tw-rounded">
            <v-list-item-content>
              <v-icon>mdi-sword-cross</v-icon>
            </v-list-item-content>
            <v-list-item-action>
              <v-avatar rounded :color="item.color">
                <v-icon color="white"> {{ item.icon }} </v-icon>
              </v-avatar>
            </v-list-item-action>

            <v-list-item-content class="tw-ml-3">
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-content>
              <v-list-item-title>
                <v-icon color="#f59e0b">mdi-crown</v-icon>
                {{ item.owner }}
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <nuxt-link :to="`/teams/${item.tag}`"
                ><v-icon small> mdi-open-in-new </v-icon></nuxt-link
              >
            </v-list-item-action>
          </v-list-item>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
  export default {
    name: 'UpcomingMatches',
    components: {},
    props: {
      teamtag: String,
      tournamentId: String,
    },
    data: () => ({
      matches: [],
    }),
    async fetch() {
      try {
        let tournament = await this.$axios.get(
          `/tournaments/id/${this.tournamentId}`,
        );
        tournament = tournament.data;
        if (!tournament.started) {
          return;
        }

        const res = await this.$axios.get(
          `/tournaments/${this.tournamentId}/team/${this.teamtag}`,
        );
        this.matches = res.data;
      } catch (e) {}
    },
  };
</script>

<style scoped>
  #alternateColors:nth-child(even) {
    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
  }
</style>
