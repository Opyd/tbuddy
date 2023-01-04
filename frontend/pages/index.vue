<template>
  <v-row>
    <v-col md="6" sm="12">
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
        <v-row class="tw-mt-2">
          <v-col sm="4" class="text-center">Type</v-col>
          <v-col sm="4" class="text-center">Content</v-col>
          <v-col sm="4" class="text-center">Action</v-col>
        </v-row>
        <v-divider />
        <v-row v-if="user.invitesTags.length === 0">
          <v-col
            sm="12"
            md="12"
            class="tw-w-full tw-flex tw-h-full tw-items-center tw-justify-center">
            <small class="tw-p-3"><i>No new messages</i></small>
          </v-col>
        </v-row>
        <InviteRequestToTeam
          v-for="invite in user.invitesTags"
          :key="invite"
          :username="user.username"
          :team-tag="invite"></InviteRequestToTeam>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import InviteRequestToTeam from '@/components/user/InviteRequestToTeam.vue';

  export default {
    name: 'IndexPage',
    components: {InviteRequestToTeam},
    data: () => ({
      user: {},
    }),
    fetch() {
      this.user = this.$auth.user;
    },
    head: () => ({
      title: 'Dashboard',
    }),
  };
</script>
