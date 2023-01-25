<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col xl="8" lg="12" md="12" sm="12" cols="12">
        <v-row>
          <v-col
            v-if="$fetchState.pending"
            md="6"
            sm="12"
            class="tw-w-full tw-flex tw-gap-3">
            <v-skeleton-loader
              class="tw-w-full"
              type="article, list-item-three-line"></v-skeleton-loader>
          </v-col>
          <v-col v-else md="6" sm="6" cols="12">
            <v-card outlined elevation="2" class="fill-height">
              <div class="tw-w-full">
                <v-icon
                  style="position: absolute"
                  class="tw-right-5 tw-top-5"
                  :class="
                    user.invitesTags.length > 0 ? 'tw-animate-pulse tw' : ''
                  "
                  :color="user.invitesTags.length > 0 ? 'yellow' : ''"
                  >mdi-bell</v-icon
                >
                <p
                  class="tw-text-2xl tw-text-center tw-pt-3"
                  style="font-family: 'Unbounded', sans-serif">
                  Inbox
                </p>

                <v-divider></v-divider>
              </div>

              <v-row class="tw-my-2">
                <v-col sm="4" class="text-center">Type</v-col>
                <v-col sm="4" class="text-center">Content</v-col>
                <v-col sm="4" class="text-center">Action</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row
                v-if="user.invitesTags.length === 0 && user.inbox.length === 0">
                <v-col
                  sm="12"
                  md="12"
                  class="tw-w-full tw-flex tw-items-center tw-justify-center">
                  <small class="tw-p-3"><i>No new messages</i></small>
                </v-col>
              </v-row>

              <InviteRequestToTeam
                v-for="invite in user.invitesTags"
                :key="invite"
                :username="user.username"
                :team-tag="invite"></InviteRequestToTeam>
              <InboxMsg
                v-for="(msg, index) in user.inbox"
                :key="msg"
                :msg="msg"
                :index="index" />
            </v-card>
          </v-col>
          <v-col md="6" lg="6" sm="6" cols="12">
            <v-card v-if="user.currentTeam === null" outlined elevation="2">
              <div
                class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-h-36 tw-items-center">
                <p>You are not in any team</p>
                <NuxtLink to="/teams/create"
                  ><v-btn color="green">Create One</v-btn></NuxtLink
                >
              </div>
            </v-card>
            <UserTeam
              v-if="isTeamLoaded && user.currentTeam !== null"
              :team="team"
              class="" />
            <v-card
              v-if="!isTeamLoaded && user.currentTeam !== null"
              key="2"
              outlined
              elevation="2"
              class="">
              <v-skeleton-loader
                class="mx-auto"
                type="article"></v-skeleton-loader>
            </v-card>
          </v-col>
          <v-col md="6" lg="6" sm="6" cols="12">
            <ActiveTournament
              v-if="isTeamLoaded"
              :tournament-id="team.activeTournament" />
          </v-col>
          <v-col md="5" lg="6" sm="6" cols="12">
            <UpcomingMatches
              v-if="isTeamLoaded && team.activeTournament !== null"
              class="tw-w-full"
              :teamtag="team.tag"
              :tournament-id="team.activeTournament" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import InviteRequestToTeam from '@/components/user/InviteRequestToTeam.vue';
  import InboxMsg from '@/components/user/InboxMsg.vue';
  import UserTeam from '@/components/user/UserTeam.vue';
  import ActiveTournament from '@/components/teams/ActiveTournament.vue';
  import UpcomingMatches from '@/components/teams/UpcomingMatches.vue';

  export default {
    name: 'DashboardPage',
    components: {
      UpcomingMatches,
      ActiveTournament,
      UserTeam,
      InboxMsg,
      InviteRequestToTeam,
    },
    middleware: ['auth'],
    data: () => ({
      user: {},
      avatar: '',
      team: {},
      isTeamLoaded: false,
    }),
    async fetch() {
      try {
        const res = await this.$axios.get(
          `/users/name/${this.$auth.user.username}`,
        );
        this.user = res.data;
        if (this.user.currentTeam !== null) {
          await this.getTeam();
        }
      } catch (e) {
        if (e.response.status === 404) {
          return this.$nuxt.error({statusCode: 404, message: 'User Not found'});
        }
      }
    },
    head: () => ({
      title: 'Dashboard',
    }),
    methods: {
      async getTeam() {
        try {
          const res = await this.$axios.get(
            `/teams/tag/${this.user.currentTeam}`,
          );
          this.team = res.data;
          this.isTeamLoaded = true;
        } catch (e) {}
      },
    },
  };
</script>

<style lang="scss" scoped></style>
