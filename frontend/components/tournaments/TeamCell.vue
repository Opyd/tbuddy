<template>
  <div>
    <v-card v-if="$fetchState.pending" outlined elevation="2" loading></v-card>
    <v-card outlined elevation="2" :style="teamTag!==null ? winner ? 'border-right: 6px solid green' : 'border-right: 6px solid red' : ''"  else>
      <v-row align="center">
        <v-col cols="3" align="start">
          <v-avatar rounded max-height="40px" :color="team.color">
            <v-icon color="white">{{ team.icon }}</v-icon>
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
        <v-col v-if="teamTag !== null" cols="3">
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
      winner : {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      team: {},
    }),
    async fetch() {
      if (this.teamTag === null) {
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
