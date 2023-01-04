<template>
  <div class="tw-mt-5 tw-mb-5 tw-w-full tw-hover:tw-bg-amber-300">
    <div v-if="$fetchState.pending" class="tw-w-full">
      <v-skeleton-loader class="tw-w-full" type="list-item"></v-skeleton-loader>
    </div>

    <NuxtLink
      v-else
      :to="`/users/${user.username}`"
      class=""
      style="text-decoration: none; color: inherit">
      <div class="tw-w-full tw-flex tw-justify-center tw-px-5">
        <div class="tw-w-1/3 tw-flex tw-justify-center tw-items-center">
          <v-icon>mdi-account</v-icon>
        </div>
        <div class="tw-w-1/3 tw-flex tw-justify-center tw-items-center">
          <span>{{ user.username }}</span>
        </div>
        <div
          v-if="user.details.preferredRoles.length !== 0"
          class="tw-w-1/3 tw-flex tw-justify-center tw-items-center">
          <RoleIcon
            v-for="role in user.details.preferredRoles"
            :key="role"
            :role="role"></RoleIcon>
        </div>
        <div v-else class="tw-w-1/3 tw-flex tw-justify-center tw-items-center">
          <small>No roles</small>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
  import RoleIcon from '@/components/user/roles/RoleIcon.vue';

  export default {
    name: 'TeamMember',
    components: {RoleIcon},
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
        const roles = this.user.details.preferredRoles;
        return roles.join(', ');
      },
    },
  };
</script>

<style scoped></style>
