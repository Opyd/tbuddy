<template>
  <div>
    <v-card elevation="2">
      <div
        class="tw-flex-nowrap tw-flex tw-w-full tw-p-5 tw-items-center tw-gap-10"
      >
        <div class="tw-flex tw-justify-center tw-flex-col">
          <v-avatar color="primary" size="128" rounded class="tw-w-full">
            <img
              v-if="user.avatar != null"
              src="http://papajleba.pl/wp-content/uploads/elementor/thumbs/papaj-pq7m2ikjylbcmgb4fo8rja936ujjq85i64try0irao.png"
              alt="My profile picture"
            />
            <v-icon v-else size="128">mdi-account-cowboy-hat</v-icon>
          </v-avatar>
          <v-btn class="tw-w-full tw-mt-2">Change</v-btn>
        </div>
        <p class="tw-text-4xl tw-w-3/5">{{ user.username }}'s Profile</p>
        <p class="tw-self-start tw-justify-self-end">
          <v-icon> mdi-calendar </v-icon>
          <i>Joined: {{ new Date(user.createdAt).toDateString() }} </i>
        </p>
      </div>
    </v-card>
    <div class="tw-mt-5 tw-w-full tw-flex">
      <v-card elevation="2" class="tw-w-1/2 tw-pb-7">
        <div class="tw-flex tw-w-full tw-justify-end">
          <v-icon
            class="tw-m-1 hover:tw-animate-spin hover:tw-cursor-pointer"
            @click="dialog = true"
            >mdi-cog</v-icon
          >
        </div>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <details-dialog
            :user-details="user.details"
            @close="dialog = false"
          />
        </v-dialog>
        <p class="tw-text-2xl tw-text-center tw-w-full">Details</p>
        <div class="tw-flex tw-flex-nowrap tw-w-full tw-p-1">
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
          <div class="tw-w-1/2 text-center">
            <p
              v-if="
                user.details.prefferedRoles === undefined ||
                user.details.prefferedRoles?.length === 0
              "
            >
              -
            </p>
            <span v-for="role in user.details.prefferedRoles" v-else :key="role"
              >{{ role }}
            </span>
          </div>
        </div>
      </v-card>
      <v-card class="tw-w-1/2 tw-ml-5">
        <div class="tw-flex tw-flex-nowrap tw-flex-col tw-w-full tw-h-full">
          <div class="tw-w-full tw-h-fit">
            <p class="tw-text-2xl tw-text-center tw-pt-7">My Team</p>
          </div>
          <div
            v-if="user.currentTeam === null"
            class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center"
          >
            <p>You are currently not in any team</p>
          </div>
          <div
            v-else
            class="tw-w-full tw-flex tw-flex-col tw-items-center tw-justify-center"
          >
            <v-icon>{{ team.icon }}</v-icon>
            <p class="tw-w-full tw-font-bold tw-text-3xl tw-text-center">
              [{{ team.tag }}]
            </p>
            <p class="tw-w-full tw-text-center">{{ team.name }}</p>
            <p class="tw-w-full tw-text-center">
              Owner:
              {{
                team.owner.username === user.username
                  ? 'You'
                  : team.owner.username
              }}
            </p>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import DetailsDialog from '@/components/user/detailsDialog'
export default {
  name: 'Me',
  components: { DetailsDialog },
  data: () => ({
    user: {},
    team: {},
    dialog: false,
  }),
  head: () => ({
    title: 'My Account',
  }),
  created() {
    this.user = this.$auth.user
    if (this.user.currentTeam !== null) {
      this.getTeam()
    }
  },

  methods: {
    async getTeam() {
      try {
        const res = await this.$axios.get(`/teams/${this.user.currentTeam}`)
        this.team = res.data
      } catch (e) {}
    },
  },
}
</script>

<style scoped></style>
