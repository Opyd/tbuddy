<template>
  <v-card outlined elevation="2">
    <div class="tw-w-full">
      <p
        class="tw-text-2xl tw-text-center tw-pt-3"
        style="font-family: 'Unbounded', sans-serif">
        Active Tournament
      </p>
    </div>
    <v-divider></v-divider>
    <v-col
      v-if="tournamentId === null"
      md="12"
      sm="12"
      class="tw-w-full tw-flex tw-justify-center tw-items-center tw-gap-3">
      <span>No active tournament</span>
    </v-col>
    <transition name="fade" mode="out-in">
      <v-col
        v-if="$fetchState.pending && !(tournamentId === null)"
        key="1"
        md="12"
        sm="12"
        class="tw-w-full tw-flex tw-gap-3">
        <v-skeleton-loader
          class="tw-w-full"
          type="article, list-item-two-line"></v-skeleton-loader>
      </v-col>
      <v-col
        v-if="!$fetchState.pending && !(tournamentId === null)"
        md="12"
        sm="12">
        <v-row justify="center" no-gutters>
          <v-col cols="12" class="tw-flex tw-justify-center">
            <small>Title</small>
          </v-col>
          <v-col cols="12" class="tw-flex tw-justify-center tw-items-center">
            <span class="tw-text-xl tw-text-center">{{
              tournament.title
            }}</span>
          </v-col>
          <v-col cols="12" class="tw-flex tw-justify-center">
            <v-icon size="64" class="tw-my-3 tw-p-1 tw-border tw-rounded"
              >mdi-tournament</v-icon
            >
          </v-col>
          <v-col cols="12" class="tw-flex tw-justify-center">
            <NuxtLink :to="`/tournaments/${tournament.slug}`"
              ><v-btn outlined rounded text>
                More <v-icon right>mdi-open-in-new</v-icon>
              </v-btn></NuxtLink
            >
          </v-col>
        </v-row>
      </v-col>
    </transition>
  </v-card>
</template>

<script>
  export default {
    name: 'ActiveTournament',
    props: {
      tournamentId: {
        type: String,
        default: null,
      },
    },
    data: () => ({
      tournament: {},
    }),
    async fetch() {
      if (this.tournamentId === null) {
        return;
      }
      try {
        const res = await this.$axios.get(
          `tournaments/id/${this.tournamentId}`,
        );
        this.tournament = res.data;
      } catch (e) {}
    },
  };
</script>

<style scoped></style>
