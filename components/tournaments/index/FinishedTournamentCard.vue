<template>
  <v-card outlined elevation="2">
    <div class="tw-w-full">
      <p
        class="tw-text-xl tw-text-center tw-pt-3"
        style="font-family: 'Unbounded', sans-serif">
        Just Finished
      </p>
    </div>
    <v-divider></v-divider>

    <v-col
      v-if="$fetchState.pending"
      md="12"
      sm="12"
      class="tw-w-full tw-flex tw-gap-3">
      <v-skeleton-loader
        class="tw-w-full"
        type="article, list-item-three-line"></v-skeleton-loader>
    </v-col>
    <v-col v-if="!$fetchState.pending && tournament !== ''" md="12" sm="12">
      <v-row justify="center" no-gutters>
        <v-col cols="12" class="tw-flex tw-justify-center tw-items-center">
          <span class="tw-text-xl tw-text-center">{{ tournament.title }}</span>
        </v-col>
        <v-col cols="12" class="tw-flex tw-justify-center">
          <small
            ><v-icon small left>mdi-account-tie</v-icon>
            {{ tournament.organizer }}</small
          >
        </v-col>
        <v-col cols="12" class="tw-flex tw-justify-center">
          <v-icon size="32" class="tw-my-3 tw-p-1 tw-border tw-rounded"
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
    <v-col v-else md="12" sm="12" align="center">
      <small><i>No finished tournaments</i></small>
    </v-col>
  </v-card>
</template>

<script>
  export default {
    name: 'FinishedTournamentCard',
    data: () => ({
      tournament: {},
    }),
    async fetch() {
      try {
        const res = await this.$axios.get(`tournaments/finished
        `);
        this.tournament = res.data;
      } catch (e) {}
    },
  };
</script>

<style scoped></style>
