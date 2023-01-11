<template>
  <v-main>
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
          <v-col sm="12" md="6">
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
          <v-col v-if="results.length > 0" md="8" sm="8">
            <div class="tw-w-full tw-flex tw-flex-col tw-justify-center">
              <div v-if="loading">
                <v-skeleton-loader
                  type="table-heading"
                  class="tw-mb-3"></v-skeleton-loader>
                <v-skeleton-loader type="table-heading"></v-skeleton-loader>
              </div>
              <v-virtual-scroll
                id="style-2"
                bench="2"
                :items="results"
                class="tw-mt-3"
                height="300"
                item-height="64">
                <template #default="{item}">
                  <v-list-item :key="item.tag">
                    <v-list-item-action>
                      <v-avatar rounded :color="item.color">
                        <v-icon> {{ item.icon }} </v-icon>
                      </v-avatar>
                    </v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.tag }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.name }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-icon>mdi-account</v-icon>
                        {{ item.members.length + 1 }}
                      </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-content> </v-list-item-content>

                    <v-list-item-action>
                      <nuxt-link :to="`/teams/${item.tag}`"
                        ><v-icon small> mdi-open-in-new </v-icon></nuxt-link
                      >
                    </v-list-item-action>
                  </v-list-item>

                  <v-divider></v-divider>
                </template>
              </v-virtual-scroll>
            </div>
          </v-col>
          <v-col v-else md="8" sm="8">
            <div
              class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-mt-10">
              <small class="text-center">No results</small>
              <v-icon size="64" class="tw-mt-5">mdi-robot-confused</v-icon>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-main>
</template>

<script>
  export default {
    name: 'TeamsIndex',
    data: () => ({
      query: '',
      loading: false,
      results: [],
    }),
    head: () => ({
      title: 'Teams',
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
