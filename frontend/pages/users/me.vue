<template>
  <div>
    <v-card elevation="2">
      <div
        class="tw-flex-nowrap tw-flex tw-w-full tw-p-5 tw-items-center tw-gap-10">
        <div class="tw-flex tw-justify-center tw-flex-col">
          <v-avatar color="primary" size="128" rounded class="tw-w-full">
            <img
              v-if="user.avatar !== null"
              :src="user.avatar"
              alt="My profile picture" />
            <v-icon v-else size="128">mdi-account-cowboy-hat</v-icon>
          </v-avatar>
          <v-btn class="tw-w-full tw-mt-2">Change</v-btn>
        </div>
        <p class="tw-text-4xl tw-w-3/5">{{ user.username }}'s Profile</p>
        <p class="tw-self-start tw-justify-self-end">
          <v-icon> mdi-calendar</v-icon>
          <i>Joined: {{ new Date(user.createdAt).toDateString() }} </i>
        </p>
      </div>
    </v-card>
    <div class="tw-mt-5 tw-w-full tw-flex">
      <v-card elevation="2" class="tw-w-1/2 tw-py-3">
        <div class="tw-absolute tw-right-0">
          <v-icon
            class="tw-m-1 hover:tw-animate-spin hover:tw-cursor-pointer"
            @click="dialog = true">
            mdi-cog
          </v-icon>
        </div>
        <div class="tw-flex tw-w-full tw-justify-end">
          <p
            class="tw-text-2xl tw-text-center tw-w-full"
            style="font-family: 'Unbounded', sans-serif">
            Details
          </p>
        </div>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <details-dialog
            :user-details="user.details"
            @close="dialog = false" />
        </v-dialog>
        <v-divider></v-divider>
        <div class="tw-flex tw-flex-nowrap tw-w-full tw-pt-4">
          <div class="tw-w-1/2 text-center">First Name</div>
          <div class="tw-w-1/2 text-center">
            {{ user.details.firstname ? user.details.firstname : '-' }}
          </div>
        </div>
        <div class="tw-flex tw-flex-nowrap tw-w-full tw-p-1">
          <div class="tw-w-1/2 text-center">Country</div>
          <div class="tw-w-1/2 text-center">
            {{ user.details.country ? user.details.country : '-' }}
          </div>
        </div>
        <div class="tw-flex tw-flex-nowrap tw-w-full tw-p-1">
          <div class="tw-w-1/2 text-center">About</div>
          <div class="tw-w-1/2 text-center">
            {{ user.details.about ? user.details.about : '-' }}
          </div>
        </div>
        <div class="tw-flex tw-flex-nowrap tw-w-full tw-p-1">
          <div class="tw-w-1/2 text-center">Preffered Role(s)</div>
          <div
            class="tw-w-1/2 text-center tw-flex tw-justify-center tw-items-center">
            <p
              v-if="
                user.details.preferredRoles === undefined ||
                user.details.preferredRoles?.length === 0
              ">
              -
            </p>
            <RoleIcon
              v-for="role in user.details.preferredRoles"
              :key="role"
              :role="role"></RoleIcon>
          </div>
        </div>
      </v-card>
      <v-card v-if="user.currentTeam === null" class="tw-w-1/2 tw-ml-5">
        <div
          class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-h-full tw-items-center">
          <p>You are not in team</p>
          <nuxt-link to="/teams">
            <v-btn color="success">Join one!</v-btn></nuxt-link
          >
        </div>
      </v-card>
      <v-card
        v-if="isTeamLoaded && user.currentTeam !== null"
        class="tw-w-1/2 tw-ml-5">
        <div class="tw-w-full">
          <p
            class="tw-text-2xl tw-text-center tw-pt-3"
            style="font-family: 'Unbounded', sans-serif">
            My Team
          </p>
        </div>
        <v-divider></v-divider>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="text-overline mb-4">
              <span style="font-family: 'Unbounded', cursive">{{
                team.tag
              }}</span>
            </div>
            <v-list-item-title class="text-h5 mb-1">
              {{ team.name }}
            </v-list-item-title>
            <v-list-item-subtitle
              >Created:
              {{
                new Date(team.createdAt).toDateString()
              }}</v-list-item-subtitle
            >
          </v-list-item-content>

          <v-list-item-avatar size="40" :color="team.color" rounded>
            <v-icon>{{ team.icon }}</v-icon>
          </v-list-item-avatar>
        </v-list-item>

        <v-card-actions>
          <nuxt-link :to="`/teams/${team.tag}`">
            <v-btn outlined rounded text> More </v-btn></nuxt-link
          >
        </v-card-actions>
      </v-card>

      <v-card
        v-if="!isTeamLoaded && user.currentTeam !== null"
        key="2"
        class="tw-w-1/2 tw-ml-5">
        <v-skeleton-loader class="mx-auto" type="article"></v-skeleton-loader>
      </v-card>
    </div>
  </div>
</template>

<script>
  import DetailsDialog from '@/components/user/DetailsDialog.vue';
  import RoleIcon from '@/components/user/roles/RoleIcon.vue';

  export default {
    name: 'LoggedUsersPage',
    components: {RoleIcon, DetailsDialog},
    middleware: ['auth'],
    data: () => ({
      user: {},
      team: {},
      dialog: false,
      isTeamLoaded: false,
    }),
    head: () => ({
      title: 'My Account',
    }),
    computed: {
      roles() {
        const roles = this.user.details.preferredRoles;
        return roles.join(', ');
      },
    },
    created() {
      this.user = this.$auth.user;
      if (this.user.currentTeam !== null) {
        this.getTeam();
      }
    },
    methods: {
      async getTeam() {
        try {
          const res = await this.$axios.get(
            `/teams/tag/${this.user.currentTeam}`,
          );
          this.team = res.data;
          this.isTeamLoaded = true;
        } catch (e) {
          console.log(e);
        }
      },
    },
  };
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
