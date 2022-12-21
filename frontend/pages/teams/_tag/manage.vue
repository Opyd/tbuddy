<template>
  <div>
    <v-dialog v-model="inviteDialog" ersistent max-width="600px">
      <invite-user />
    </v-dialog>
    <v-btn @click="inviteDialog = true">Invite to Team</v-btn>
  </div>
</template>

<script>
  import InviteUser from '@/components/teams/manage/InviteUser.vue';

  export default {
    name: 'Manage',
    components: {InviteUser},
    data: () => ({
      team: {},
      user: {},
      inviteDialog: false,
    }),
    async fetch() {
      try {
        const res = await this.$axios.get(
          `/teams/tag/${this.$route.params.tag}`,
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
  };
</script>

<style scoped></style>
