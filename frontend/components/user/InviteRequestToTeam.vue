<template>
  <div class="tw-my-2">
    <v-row>
      <v-col sm="4">
        <div
          class="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center">
          <div class="tw-border tw-border-amber-500 tw-rounded tw-p-2">
            <span>Invite</span>
            <v-icon right>mdi-email-fast</v-icon>
          </div>
        </div>
      </v-col>
      <v-col sm="4">
        <div
          class="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center tw-p-2">
          <span class="tw-text-center"
            >You are invited to join
            <span
              class="tw-font-bold"
              style="font-family: 'Unbounded', sans-serif"
              >{{ teamTag }}</span
            ></span
          >
        </div>
      </v-col>
      <v-col sm="4">
        <div
          class="tw-w-full tw-h-full tw-flex tw-justify-evenly tw-items-center tw-py-2">
          <nuxt-link :to="`/teams/${teamTag}`"
            ><v-icon>mdi-open-in-new</v-icon></nuxt-link
          >
          <v-btn x-small fab color="success" @click="handleInvite(true)"
            ><v-icon>mdi-check</v-icon></v-btn
          >
          <v-btn x-small fab color="error" @click="handleInvite(false)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </div>
      </v-col>
    </v-row>
    <v-divider />
  </div>
</template>

<script>
  export default {
    name: 'InviteRequestToTeam',
    props: ['teamTag'],
    methods: {
      async handleInvite(decision) {
        const res = await this.$axios.post('users/handleinvite', {
          teamtag: this.teamTag,
          decision,
        });
        if (res.status === 201) {
          this.$toast.success(
            `Successfully ${decision ? 'accepted' : 'declined'} invite! `,
          );
          this.$destroy();
          // remove the element from the DOM
          this.$el.parentNode.removeChild(this.$el);
        }
      },
    },
  };
</script>

<style scoped></style>
