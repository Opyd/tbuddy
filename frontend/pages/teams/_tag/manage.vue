<template>
  <div>
    <v-btn @click="inviteDialog = true">Invite to Team</v-btn>
    <v-dialog v-model="inviteDialog" max-width="600px">
      <invite-user
        :invited-usernames="team.invitedUsernames"
        @invited="addInvitedToArray" />
    </v-dialog>
    <v-row>
      <v-col md="6" sm="12">
        <div class="tw-mt-5">
          <v-card class="tw-w-full">
            <div
              class="tw-w-full tw-flex tw-justify-center tw-items-center tw-my-3">
              <span style="font-family: 'Unbounded', sans-serif">Members</span>
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
                >Pending Invites</span
              >
            </div>
            <v-divider></v-divider>
            <div
              class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center">
              <div
                v-for="user in team.invitedUsernames"
                :key="user"
                class="tw-w-full">
                <TeamMember :username="user" />
              </div>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import InviteUser from '@/components/teams/manage/InviteUser.vue';
  import TeamMember from '~/components/teams/TeamMember.vue';

  export default {
    name: 'Manage',
    components: {TeamMember, InviteUser},
    data: () => ({
      team: {},
      user: {},
      inviteDialog: false,
    }),
    async fetch() {
      try {
        const res = await this.$axios.get(
          `/teams/tag/${this.$route.params.tag.toUpperCase()}`,
        );
        this.team = res.data;
        this.user = this.$auth.user;
        if (this.team.owner !== this.user.username) {
          return this.$nuxt.error({statusCode: 400, message: 'Bad request'});
        }
      } catch (e) {
        if (e.response.status === 404) {
          return this.$nuxt.error({statusCode: 404, message: 'Team Not found'});
        }
      }
    },
    head: () => ({
      title: 'Manage Team',
    }),
    methods: {
      addInvitedToArray(username) {
        this.team.invitedUsernames.push(username);
      },
    },
  };
</script>

<style scoped></style>
