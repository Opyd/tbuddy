<template>
  <div>
    <v-card elevation="2">
      <div
        class="tw-flex-nowrap tw-flex tw-w-full tw-p-5 tw-items-center tw-gap-10"
      >
        <v-avatar color="primary" size="128" rounded class="tw-w-1/5">
          <img
            v-if="user.avatar != null"
            src="http://papajleba.pl/wp-content/uploads/elementor/thumbs/papaj-pq7m2ikjylbcmgb4fo8rja936ujjq85i64try0irao.png"
          />
          <v-icon v-else size="128">mdi-account-cowboy-hat</v-icon>
        </v-avatar>
        <p class="tw-text-4xl tw-w-3/5">{{ user.username }}'s Profile</p>
        <p class="tw-self-start tw-justify-self-end">
          <v-icon> mdi-calendar </v-icon>
          Joined: {{ new Date(user.createdAt).toDateString() }}
        </p>
      </div>
    </v-card>
    <v-card elevation="2" class="tw-mt-2"> </v-card>
  </div>
</template>

<script>
export default {
  name: 'Me',
  data: () => ({
    user: {},
  }),
  head: () => ({
    title: 'My Account',
  }),
  created() {
    this.user = this.$auth.user
  },
}
</script>

<style scoped></style>
