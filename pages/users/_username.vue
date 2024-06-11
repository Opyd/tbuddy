<template>
  <v-container fluid>
    <div v-if="$fetchState.pending" class="tw-w-full">
      <v-skeleton-loader class="tw-w-full" type="list-item-avatar-three-line, image, article"></v-skeleton-loader>
    </div>
    <div v-else>
      <v-row justify="center">
        <v-col xl="8" lg="12" md="12" sm="12" cols="12">
          <v-row>
            <v-col cols="12">
              <v-card outlined elevation="2">
                <div class="tw-flex-nowrap tw-flex tw-w-full tw-p-5 tw-items-center tw-gap-10">
                  <div class="tw-flex tw-justify-center tw-flex-col">
                    <v-avatar size="128" rounded class="tw-w-full">
                      <img v-if="user.avatar !== null" :src="user.avatar" alt="My profile picture" />
                      <v-icon v-else size="128">mdi-account-cowboy-hat</v-icon>
                    </v-avatar>
                  </div>
                  <v-row class="tw-w-3/5" no-gutters>
                    <v-col cols="12">
                      <small>User</small>
                    </v-col>
                    <v-col cols="12">
                      <p class="md:tw-text-4xl xs:tw-text-xl">
                        {{ user.username }}
                      </p>
                    </v-col>
                  </v-row>
                  <small class="tw-self-start">
                    <i>
                      <v-icon size="18" left> mdi-calendar</v-icon>{{ mobile ? $dateFns.format(user.createdAt, 'yyy') : $dateFns.format(user.createdAt, 'yyy-MM-dd') }}
                    </i>
                  </small>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" md="6" lg="6">
              <v-card outlined elevation="2" class="tw-pt-3">
                <div class="tw-flex tw-w-full tw-justify-end">
                  <div v-if="
                    $auth.user !== null &&
                    $auth.user.username === user.username
                  " class="tw-absolute tw-right-0">
                    <v-icon class="tw-m-1 hover:tw-animate-spin hover:tw-cursor-pointer" @click="dialog = true">
                      mdi-cog
                    </v-icon>
                  </div>
                  <v-dialog v-model="dialog" persistent max-width="600px">
                    <details-dialog :user-details="user.details" @close="dialog = false" />
                  </v-dialog>
                  <p class="tw-text-2xl tw-text-center tw-w-full" style="font-family: 'Unbounded', sans-serif">
                    Details
                  </p>
                </div>
                <v-divider></v-divider>
                <div class="tw-flex tw-flex-nowrap tw-w-full tw-py-2 lol">
                  <div class="tw-w-1/2 text-center">First Name</div>
                  <div class="tw-w-1/2 text-center">
                    {{ user.details.firstname ? user.details.firstname : '-' }}
                  </div>
                </div>
                <div class="tw-flex tw-flex-nowrap tw-w-full tw-py-2">
                  <div class="tw-w-1/2 text-center">Country</div>
                  <div class="tw-w-1/2 text-center">
                    {{ user.details.country ? user.details.country : '-' }}
                  </div>
                </div>
                <div class="tw-flex tw-flex-nowrap tw-w-full tw-py-2 lol">
                  <div class="tw-w-1/2 text-center">About</div>
                  <div class="tw-w-1/2 text-center">
                    {{ user.details.about ? user.details.about : '-' }}
                  </div>
                </div>
                <div class="tw-flex tw-flex-nowrap tw-w-full tw-py-2">
                  <div class="tw-w-1/2 text-center">Preffered Role(s)</div>
                  <div class="tw-w-1/2 text-center tw-flex tw-justify-center tw-items-center">
                    <p v-if="
                      user.details.preferredRoles === undefined ||
                      user.details.preferredRoles?.length === 0
                    ">
                      -
                    </p>

                    <RoleIcon v-for="role in user.details.preferredRoles" :key="role" :role="role"></RoleIcon>
                  </div>
                </div>
                <div class="tw-flex tw-flex-nowrap tw-w-full tw-py-2 lol">
                  <div class="tw-w-1/2 text-center">Looking For Team</div>
                  <div class="tw-w-1/2 text-center tw-flex tw-justify-center tw-items-center">
                    <v-icon>{{
                      user.details.lookingForTeam
                      ? 'mdi-check-bold'
                      : 'mdi-close'
                    }}</v-icon>
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col md="6" lg="6" sm="6" cols="12">
              <v-card v-if="user.currentTeam === null" outlined elevation="2">
                <div class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-h-36 tw-items-center">
                  <looking-for-team v-if="
                    user.details.lookingForTeam
                  " :username="user.username" />
                  <span v-if="
                    !user.details.lookingForTeam
                  ">{{ user.username }} is not in any team</span>
                </div>
              </v-card>
              <UserTeam v-if="isTeamLoaded && user.currentTeam !== null" :team="team" class="" />
              <v-card v-if="!isTeamLoaded && user.currentTeam !== null" key="2" class="">
                <v-skeleton-loader class="mx-auto" type="article"></v-skeleton-loader>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import RoleIcon from '@/components/user/roles/RoleIcon.vue';
import LookingForTeam from '@/components/user/LookingForTeam.vue';
import DetailsDialog from '@/components/user/DetailsDialog.vue';
import UserTeam from '@/components/user/UserTeam.vue';

export default {
  name: 'UsersPage',
  components: { UserTeam, DetailsDialog, LookingForTeam, RoleIcon },
  data: () => ({
    user: {},
    team: {},
    isTeamLoaded: false,
    dialog: false,
  }),
  async fetch() {
    try {
      const res = await this.$axios.get(
        `/users/name/${this.$route.params.username}`,
      );
      this.user = res.data;
      if (this.user.currentTeam !== null) {
        await this.getTeam();
      }
    } catch (e) {
      if (e.response.status === 404) {
        return this.$nuxt.error({ statusCode: 404, message: 'User Not found' });
      }
    }
  },
  head() {
    return {
      title: this.user.username,
    };
  },
  computed: {
    roles() {
      const roles = this.user.details.preferredRoles;
      return roles.join(', ');
    },
    mobile() {
      return this.$vuetify.breakpoint.xs
    },
  },
  methods: {
    async getTeam() {
      try {
        const res = await this.$axios.get(
          `/teams/tag/${this.user.currentTeam}`,
        );
        this.team = res.data;
        this.isTeamLoaded = true;
      } catch (e) { }
    },
  },
};
</script>

<style scoped>
#alternateColors:nth-child(odd) {
  background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
}

.lol {
  background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
}
</style>
