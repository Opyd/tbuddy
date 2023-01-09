<template>
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
    <v-col v-else md="6" sm="12">
      <v-card>
        <v-card-title>
          Inbox
          <v-icon
            style="position: absolute"
            class="tw-right-5"
            :class="user.invitesTags.length > 0 ? 'tw-animate-pulse tw' : ''"
            :color="user.invitesTags.length > 0 ? 'yellow' : ''"
            >mdi-bell</v-icon
          ></v-card-title
        >
        <v-row class="tw-my-2">
          <v-col sm="4" class="text-center">Type</v-col>
          <v-col sm="4" class="text-center">Content</v-col>
          <v-col sm="4" class="text-center">Action</v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row v-if="user.invitesTags.length === 0 && user.inbox.length === 0">
          <v-col
            sm="12"
            md="12"
            class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
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
  </v-row>
</template>

<script>
  import InviteRequestToTeam from '@/components/user/InviteRequestToTeam.vue';
  import InboxMsg from '@/components/user/InboxMsg.vue';

  export default {
    name: 'IndexPage',
    components: {InboxMsg, InviteRequestToTeam},
    middleware: ['auth'],
    data: () => ({
      user: {},
    }),
    async fetch() {
      try {
        const res = await this.$axios.get(
          `/users/name/${this.$auth.user.username}`,
        );
        this.user = res.data;
      } catch (e) {
        if (e.response.status === 404) {
          return this.$nuxt.error({statusCode: 404, message: 'User Not found'});
        }
      }
    },

    head: () => ({
      title: 'Dashboard',
    }),
  };
</script>
