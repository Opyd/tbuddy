<template>
  <v-container>
    <v-main>
      <div class="tw-w-full tw-flex tw-flex-col tw-justify-center">
        <div class="tw-w-full tw-flex tw-justify-center tw-mb-10">
          <v-badge bottom color="#166534" content="Tournaments">
            <h1
              style="font-family: 'Unbounded', sans-serif"
              class="md:tw-text-4xl sm:tw-text-2xl tw-text-2xl lg:md:tw-text-4xl">
              TBuddy
            </h1>
          </v-badge>
        </div>
        <div class="tw-w-full">
          <v-row justify="center">
            <v-col sm="12" md="8" lg="8" xl="5">
              <v-text-field
                v-model.lazy="query"
                prepend-inner-icon="mdi-tournament"
                class="mx-5"
                solo
                :loading="loading"
                placeholder="Search Tournament" />
            </v-col>
          </v-row>
        </div>
        <div class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-mt-10">
          <v-row justify="center">
            <v-col
              v-if="results.length > 0 && query.length > 0"
              md="8"
              sm="12"
              lg="8"
              xl="5">
              <div class="tw-w-full tw-flex tw-flex-col tw-justify-center">
                <div v-if="loading">
                  <v-skeleton-loader
                    type="table-heading"
                    class="tw-mb-3"></v-skeleton-loader>
                  <v-skeleton-loader type="table-heading"></v-skeleton-loader>
                </div>
                <div v-else id="style-2" class="tw-max-h-96 tw-overflow-y-auto">
                  <TournamentCard
                    v-for="tournament in results"
                    :key="tournament.id"
                    :tournament="tournament"
                    class="tw-my-1" />
                </div>
              </div>
            </v-col>
            <!--            <v-col-->
            <!--              v-if="results.length > 0 && query.length > 0 && !loading"-->
            <!--              md="8"-->
            <!--              sm="8"-->
            <!--              lg="8"-->
            <!--              xl="5">-->
            <!--              -->
            <!--            </v-col>-->
            <v-col :class="query.length == 0 ? '' : 'tw-hidden'" md="8" sm="8">
              <v-row>
                <v-col cols="12" sm="12" md="6">
                  <NewTournamentCard />
                </v-col>
                <v-col cols="12" sm="12" md="6">
                  <FinishedTournamentCard />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-main>
  </v-container>
</template>

<script>
  import NewTournamentCard from '@/components/tournaments/index/NewTournamentCard.vue';
  import FinishedTournamentCard from '@/components/tournaments/index/FinishedTournamentCard.vue';
  import TournamentCard from '@/components/tournaments/index/TournamentCard.vue';

  export default {
    name: 'IndexTournaments',
    components: {TournamentCard, FinishedTournamentCard, NewTournamentCard},
    data: () => ({
      results: [],
      query: '',
      loading: false,
    }),
    head: () => ({
      title: 'Tournaments',
    }),
    watch: {
      async query(newValue) {
        if (newValue.length === 0) {
          return;
        }
        try {
          this.loading = true;
          const res = await this.$axios.get(`/tournaments/search/${newValue}`);
          this.results = res.data;
          this.loading = false;
        } catch (e) {
          this.$toast.error('Something went wrong');
        }
      },
    },
  };
</script>

<style scoped></style>
