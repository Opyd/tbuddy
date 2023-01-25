<template>
  <div v-if="$fetchState.pending" class="tw-w-full tw-flex tw-gap-3">
    <v-skeleton-loader
      class="tw-w-1/2"
      type="list-item-three-line, article"></v-skeleton-loader>
    <v-skeleton-loader
      class="tw-w-1/2"
      type="list-item-three-line, article"></v-skeleton-loader>
  </div>
  <div v-else>
    <v-btn @click="inviteDialog = true">Invite to Team</v-btn>
    <v-dialog v-model="inviteDialog" max-width="600px">
      <invite-user
        :invited-usernames="team.invitedUsernames"
        @invited="addInvitedToArray" />
    </v-dialog>
    <v-row>
      <v-col md="6" sm="12">
        <div class="tw-mt-5">
          <v-card outlined elevation="2" class="tw-w-full">
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
                class="tw-w-full tw-flex tw-justify-evenly tw-items-center">
                <TeamMember :username="member" class="tw-w-5/6" />
                <v-dialog
                  v-model="removeMemberdialog"
                  persistent
                  max-width="290">
                  <template #activator="{on, attrs}">
                    <v-btn color="error" fab small v-bind="attrs" v-on="on">
                      <v-icon> mdi-minus </v-icon>
                    </v-btn>
                  </template>
                  <v-card outlined elevation="2">
                    <v-card-title class="text-h5">
                      Remove user from the team?
                    </v-card-title>
                    <v-card-text
                      >Are you sure you want to remove <b>{{ member }}</b> from
                      the team</v-card-text
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="removeMemberdialog = false">
                        Disagree
                      </v-btn>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="removeUserFromTeam(member)">
                        Agree
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
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
          <v-card outlined elevation="2" class="tw-w-full">
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
                class="tw-w-full tw-flex tw-justify-evenly tw-items-center">
                <TeamMember :username="user" class="tw-w-5/6" />
                <v-dialog
                  v-model="removeInvitedialog"
                  persistent
                  max-width="290">
                  <template #activator="{on, attrs}">
                    <v-btn color="error" fab small v-bind="attrs" v-on="on">
                      <v-icon> mdi-minus </v-icon>
                    </v-btn>
                  </template>
                  <v-card outlined elevation="2">
                    <v-card-title class="text-h5">
                      Remove user from the team?
                    </v-card-title>
                    <v-card-text
                      >Are you sure you want to remove invite for
                      <b>{{ user }}</b>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="removeInvitedialog = false">
                        Disagree
                      </v-btn>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="removeInvite(user)">
                        Agree
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
              <div v-if="team.invitedUsernames.length === 0" class="tw-p-3">
                <small><i>There are currently no invited users</i></small>
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
    middleware: ['auth'],
    data: () => ({
      team: {},
      user: {},
      inviteDialog: false,
      removeMemberdialog: false,
      removeInvitedialog: false,
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
    head() {
      return {
        title: 'Manage -' + this.team.name,
      };
    },
    methods: {
      addInvitedToArray(username) {
        this.team.invitedUsernames.push(username);
      },
      async removeUserFromTeam(username) {
        try {
          const res = await this.$axios.get(`teams/removeuser/${username}`);
          if (res.status === 200) {
            this.$toast.success(`Successfully removed ${username}`);
            this.team.members = this.team.members.filter(
              member => member !== username,
            );
          }
        } catch (e) {
          this.$toast.error('Something went wrong');
        }
        this.removeMemberdialog = false;
      },
      async removeInvite(username) {
        try {
          const res = await this.$axios.get(`teams/removeinvite/${username}`);
          if (res.status === 200) {
            this.$toast.success(`Successfully removed invite for ${username}`);
            this.team.invitedUsernames = this.team.invitedUsernames.filter(
              member => member !== username,
            );
          }
        } catch (e) {
          this.$toast.error('Something went wrong');
        }
        this.removeInvitedialog = false;
      },
    },
  };
</script>

<style scoped></style>
