<template>
  <v-main>
    <div class="tw-w-full tw-flex tw-flex-col tw-justify-center">
      <div class="tw-w-full tw-flex tw-justify-center tw-mb-10">
        <v-badge bottom content="Players">
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
              prepend-inner-icon="mdi-account-search"
              class="mx-5"
              solo
              :loading="loading"
              placeholder="Search User" />
          </v-col>
        </v-row>
      </div>
      <div class="tw-w-full tw-flex tw-justify-center">
        <v-row justify="center">
          <v-col cols="12" sm="6">
            <div class="tw-w-full tw-flex tw-justify-center tw-mb-2">
              <v-chip>Filters</v-chip>
            </div>
            <div class="tw-w-full tw-flex tw-justify-center">
              <v-btn-toggle v-model="toggle_multiple" dense multiple>
                <v-btn value="TOP">
                  <RoleIcon role="TOP" />
                </v-btn>
                <v-btn value="JUNGLE">
                  <RoleIcon role="JUNGLE" />
                </v-btn>
                <v-btn value="MID">
                  <RoleIcon role="MID" />
                </v-btn>
                <v-btn value="BOT">
                  <RoleIcon role="BOT" />
                </v-btn>
                <v-btn value="SUPPORT">
                  <RoleIcon role="SUPPORT" />
                </v-btn>
              </v-btn-toggle>
            </div>
          </v-col>
        </v-row>
      </div>
      <div class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-mt-10">
        <v-row justify="center">
          <v-col v-if="filtered.length > 0" md="8" sm="8">
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
                :items="filtered"
                class="tw-mt-3"
                height="300"
                item-height="64">
                <template #default="{item}">
                  <v-list-item :key="item.username">
                    <v-list-item-action>
                      <v-icon> mdi-account </v-icon>
                    </v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.username }}
                      </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-content>
                      <div style="display: flex">
                        <RoleIcon
                          v-for="role in item.details.preferredRoles"
                          :key="role"
                          :role="role" />
                      </div>
                    </v-list-item-content>

                    <v-list-item-action>
                      <nuxt-link :to="`/users/${item.username}`"
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
              <v-icon size="64" class="tw-mt-5">mdi-robot</v-icon>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-main>
</template>

<script>
  import RoleIcon from '@/components/user/roles/RoleIcon.vue';

  export default {
    name: 'Index',
    components: {RoleIcon},
    data: () => ({
      toggle_multiple: [],
      query: '',
      results: [],
      loading: false,
    }),
    computed: {
      filtered() {
        if (this.toggle_multiple.length === 0) {
          return this.results;
        }
        const find = [];

        let flag = false;

        this.results.forEach(user => {
          flag = false;
          this.toggle_multiple.forEach(role => {
            if (user.details.preferredRoles.includes(role)) {
              flag = true;
            }
          });
          if (flag) {
            find.push(user);
          }
        });
        return find;
      },
    },
    watch: {
      async query(newValue) {
        if (newValue.length === 0) {
          return;
        }
        try {
          this.loading = true;
          const res = await this.$axios.get(`/users/search/${newValue}`);
          this.results = res.data;
          this.loading = false;
        } catch (e) {
          this.$toast.error('Something went wrong');
        }
      },
    },
  };
</script>

<style scoped>
  #style-2::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: rgba(245, 245, 245, 0);
  }

  #style-2::-webkit-scrollbar {
    width: 12px;
    background-color: rgba(245, 245, 245, 0);
  }

  #style-2::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: rgba(152, 147, 147, 0.5);
  }
</style>
