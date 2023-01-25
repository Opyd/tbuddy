<template>
  <div>
    <v-card v-if="$fetchState.pending" outlined elevation="2" loading></v-card>
    <v-card outlined elevation="2" else>
      <v-row>
        <v-col cols="3">
          <v-avatar rounded max-height="20px" :color="team.color">
            <v-icon small color="white">{{ team.icon }}</v-icon>
          </v-avatar>
        </v-col>
        <v-col cols="6">
          <span
            v-if="teamTag !== null"
            style="font-family: Roboto, sans-serif"
            class="xs:tw-text-sm"
            >{{ team.name }}</span
          >
          <span
            v-else
            style="font-family: Roboto, sans-serif"
            class="xs:tw-text-sm">
            <i>TBD</i>
          </span>
        </v-col>
        <v-col cols="3">
          <NuxtLink :to="`/teams/${team.tag}`"
            ><v-icon small>mdi-open-in-new</v-icon></NuxtLink
          >
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'TeamCell',
    props: {
      teamTag: {
        type: String,
        default: null,
      },
    },
    data: () => ({
      team: {},
    }),
    async fetch() {
      if (this.teamTag.length === null) {
        return;
      }
      try {
        const res = await this.$axios.get(`/teams/tag/${this.teamTag}`);
        this.team = res.data;
      } catch (e) {}
    },
  };
</script>

<style scoped></style>
