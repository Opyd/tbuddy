<template>
  <div>
    <div v-if="$fetchState.pending" class="tw-w-full">
      <v-skeleton-loader
        class="tw-w-full"
        type="list-item-avatar-three-line, image, article"></v-skeleton-loader>
    </div>
    <div v-else>
      <v-card elevation="2">
        <div
          class="tw-w-full tw-h-10 tw-flex tw-justify-center tw-items-center tw-rounded"
          style="font-family: 'Unbounded', cursive"
          :style="{backgroundColor: team.color}">
          <span class="tw-tracking-widest">{{ team.tag }}</span>
        </div>
        <div
          class="tw-flex-nowrap tw-flex tw-w-full tw-p-5 tw-items-center tw-gap-10">
          <div class="tw-flex tw-justify-center tw-flex-col">
            <v-avatar color="primary" size="128" rounded class="tw-w-full">
              <v-icon :style="{backgroundColor: team.color}" size="128">{{
                team.icon
              }}</v-icon>
            </v-avatar>
          </div>
          <div class="tw-w-3/5">
            <p class="tw-text-4xl tw-w-3/5">{{ team.name }}</p>
            <TeamOwner :owner-id='team.owner' />
          </div>

          <p class="tw-self-start tw-justify-self-end">
            <v-icon> mdi-calendar</v-icon>
            <i>Created: {{ new Date(team.createdAt).toDateString() }} </i>
          </p>
        </div>
      </v-card>
      <div class="tw-w-full tw-flex tw-mt-3">
        <v-card class="tw-w-1/2">
          <div
            class="tw-w-full tw-flex tw-justify-center tw-items-center tw-my-3">
            <span style="font-family: 'Unbounded', sans-serif">Members</span>
          </div>
          <v-divider></v-divider>
          <div
            class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center">
            <div v-for="member in team.members" :key="member" class="tw-w-full">
              <TeamMember :user-id="member" />
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
  import TeamMember from '@/components/teams/TeamMember.vue';
  import TeamOwner from '@/components/teams/TeamOwner.vue';

  export default {
    name: 'TeamTag',
    components: {TeamOwner, TeamMember},

    data: () => ({
      team: {},
      loading: true,
    }),
    async fetch() {
      const res = await this.$axios.get(`/teams/tag/${this.$route.params.tag}`);
      if (res.data.msg === 'Not Found') {
        return this.$nuxt.error({statusCode: 404, message: 'Not found'});
      }
      this.team = res.data;
    },
  };
</script>

<style scoped></style>
