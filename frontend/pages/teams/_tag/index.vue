<template>
  <div>
    <div v-if="$fetchState.pending" class="tw-w-full">
      <v-skeleton-loader
        class="tw-w-full"
        type="list-item-avatar-three-line, image, article"></v-skeleton-loader>
    </div>
    <div v-else>
      <v-card elevation="2">
        <div
          class="tw-w-full tw-h-10 tw-flex tw-justify-center tw-items-center tw-rounded"
          style="font-family: 'Unbounded', cursive"
          :style="{backgroundColor: team.color}">
          <span class="tw-tracking-widest">{{ team.tag }}</span>
        </div>
        <div
          class="tw-flex-nowrap tw-flex tw-w-full tw-p-5 tw-items-center tw-gap-10">
          <div class="tw-flex tw-justify-center tw-flex-col">
            <v-avatar color="primary" size="128" rounded class="tw-w-full">
              <v-icon :style="{backgroundColor: team.color}" size="128">{{
                team.icon
              }}</v-icon>
            </v-avatar>
          </div>
          <div class="tw-w-3/5">
            <p class="tw-text-4xl tw-w-3/5">{{ team.name }}</p>
            <TeamOwner :ownername="team.owner" />
          </div>

          <div class="tw-self-start tw-justify-self-end">
            <v-icon> mdi-calendar</v-icon>
            <i>Created: {{ new Date(team.createdAt).toDateString() }} </i>
            <div
              v-if="$auth.user !== null && $auth.user.username === team.owner"
              class="tw-mt-5 tw-flex tw-justify-center">
              <NuxtLink :to="`${$route.params.tag}/manage`"
                ><v-btn color="green" outlined>Manage</v-btn></NuxtLink
              >
            </div>
          </div>
        </div>
      </v-card>
      <v-row>
        <v-col md="6" sm="12">
          <div class="tw-mt-5">
            <v-card class="tw-w-full">
              <div
                class="tw-w-full tw-flex tw-justify-center tw-items-center tw-my-3">
                <span style="font-family: 'Unbounded', sans-serif"
                  >Members</span
                >
              </div>
              <v-divider></v-divider>
              <div
                class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center">
                <div
                  v-for="member in team.members"
                  :key="member"
                  class="tw-w-full">
                  <TeamMember :username="member" />
                </div>
                <div v-if="team.members.length === 0" class="tw-p-3">
                  <small><i>There are currently no members</i></small>
                </div>
              </div>
            </v-card>
          </div>
        </v-col>
        <v-col md="6" sm="12">
          <div class="tw-mt-5">
            <v-card class="tw-w-full">
              <div
                class="tw-w-full tw-flex tw-justify-center tw-items-center tw-my-3">
                <span style="font-family: 'Unbounded', sans-serif"
                  >Team History</span
                >
              </div>
              <v-divider></v-divider>
              <div class="tw-w-full tw-max-h-72 tw-overflow-y-auto">
                <div
                  class="tw-w-full tw-justify-center tw-p-3 tw-flex tw-flex-col">
                  <HistoryEvent
                    v-for="event in team.events"
                    :key="event.date"
                    :event="event" />
                </div>
              </div>
            </v-card>
          </div>
        </v-col>
        <v-col md="12" sm="12">
          <div class="tw-mt-5">
            <v-card class="tw-w-full">
              <div
                class="tw-w-full tw-flex tw-justify-center tw-items-center tw-my-3">
                <span style="font-family: 'Unbounded', sans-serif"
                  >Last Matches</span
                >
              </div>
              <v-divider></v-divider>
              <div
                class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center">
                <div v-if="team.history.length === 0" class="tw-p-3">
                  <small><i>The team's match history is empty</i></small>
                </div>
              </div>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
  import TeamMember from '@/components/teams/TeamMember.vue';
  import TeamOwner from '@/components/teams/TeamOwner.vue';
  import HistoryEvent from '@/components/teams/HistoryEvent.vue';

  export default {
    name: 'TeamTag',
    components: {HistoryEvent, TeamOwner, TeamMember},
    data: () => ({
      team: {},
      loading: true,
      title: '',
    }),
    async fetch() {
      try {
        const res = await this.$axios.get(
          `/teams/tag/${this.$route.params.tag.toUpperCase()}`,
        );
        this.team = res.data;
        this.title = res.name;
      } catch (e) {
        if (e.response.status === 404) {
          return this.$nuxt.error({statusCode: 404, message: 'Team Not found'});
        }
      }
    },

    head() {
      return {
        title: this.team.name,
      };
    },
  };
</script>

<style scoped></style>
