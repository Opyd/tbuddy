<template>
  <v-container>
    <v-tooltip bottom>
      <template #activator="{on, attrs}">
        <NuxtLink
          to="/teams/create"
          style="text-decoration: none; color: inherit"
        >
        <v-btn dark fab color="indigo" v-bind="attrs" v-on="on">
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
        </NuxtLink
        >
      </template>
      <span>Create new team</span>
    </v-tooltip>
    <div class="tw-w-full tw-flex tw-flex-col tw-justify-center">
      <div class="tw-w-full tw-flex tw-justify-center tw-mb-10">
        <v-badge bottom color="purple" content="Teams">
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
              prepend-inner-icon="mdi-account-group"
              class="mx-5"
              solo
              :loading="loading"
              placeholder="Search Team" />
          </v-col>
        </v-row>
      </div>
      <div class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-mt-10">
        <v-row justify="center">
          <v-col v-if="results.length > 0" md="8" sm="8" lg="8" xl="5">
            <div class="tw-w-full tw-flex tw-flex-col tw-justify-center">
              <div v-if="loading">
                <v-skeleton-loader
                  type="table-heading"
                  class="tw-mb-3"></v-skeleton-loader>
                <v-skeleton-loader type="table-heading"></v-skeleton-loader>
              </div>
              <div v-else id="style-2" class="tw-max-h-96 tw-overflow-y-auto">
                <TeamCard
                  v-for="team in results"
                  :key="team._id"
                  :item="team"
                  class="tw-my-1" />
              </div>
            </div>
          </v-col>
          <v-col v-if="results.length == 0 && query.length > 0" md="8" sm="8">
            <div
              class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-mt-10">
              <small class="text-center">No results</small>
              <v-icon size="64" class="tw-mt-5">mdi-robot-confused</v-icon>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script>
  import TeamCard from '@/components/teams/index/TeamCard.vue';

  export default {
    name: 'TeamsIndex',
    components: {TeamCard},
    data: () => ({
      query: '',
      loading: false,
      results: [],
    }),
    head: () => ({
      title: 'Find Teams',
    }),
    watch: {
      async query(newValue) {
        if (newValue.length === 0) {
          return;
        }
        try {
          this.loading = true;
          const res = await this.$axios.get(`/teams/search/${newValue}`);
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
