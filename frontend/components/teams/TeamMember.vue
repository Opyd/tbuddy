<template>
  <div class="tw-mt-5 tw-mb-5 tw-w-full">
    <div v-if="$fetchState.pending" class="tw-w-full">
      <v-skeleton-loader class="tw-w-full" type="list-item"></v-skeleton-loader>
    </div>
    <div v-else class="tw-w-full tw-flex tw-justify-center tw-px-5">
      <div class="tw-w-1/3 tw-flex tw-justify-center tw-items-center">
        <v-icon>mdi-account</v-icon>
      </div>
      <div class="tw-w-1/3 tw-flex tw-justify-center tw-items-center">
        <span>{{ user.username }}</span>
      </div>
      <div
        v-if="user.details.prefferedRoles.length !== 0"
        class="tw-w-1/3 tw-flex tw-justify-center tw-items-center">
        <span class="tw-italic">
          {{ roles }}
        </span>
      </div>
      <div v-else class="tw-w-1/3 tw-flex tw-justify-center tw-items-center">
        <small>No roles</small>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TeamMember',
    props: ['username'],
    data: () => ({
      user: {},
      loading: true,
    }),

    async fetch() {
      try {
        const res = await this.$axios.get(`/users/name/${this.username}`);
        this.user = res.data;
      } catch (e) {
        this.$toast.error('Something went wrong');
      }
    },

    computed: {
      roles() {
        const roles = this.user.details.prefferedRoles;
        return roles.join(', ');
      },
    },
  };
</script>

<style scoped></style>
