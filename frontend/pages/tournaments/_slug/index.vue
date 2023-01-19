<template>
  <v-main>
    <div v-if="$fetchState.pending" class="tw-w-full">Loading...</div>
    <div v-else class="">
      <v-row>
        <v-col
          v-if="
            $auth.user !== null && tournament.organizer === $auth.user.username
          "
          cols="3">
          <NuxtLink :to="`${slug}/manage`"
            ><v-btn color="primary" outlined>Manage</v-btn></NuxtLink
          >
        </v-col>
        <v-col cols="12">
          <div
            class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-border-2 tw-p-5 tw-rounded">
            <v-icon size="64">mdi-trophy</v-icon>
            <span
              style="font-family: 'Unbounded', sans-serif"
              class="tw-text-center tw-text-3xl"
              >{{ tournament.title }}</span
            >
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" sm="3" md="3" lg="3">
          <v-card>
            <v-card-title
              >Teams: {{ tournament.participants.length }} /
              {{ tournament.nrOfTeams }}</v-card-title
            >
            <v-list>
              <v-list-item v-for="team in tournament.participants" :key="team">
                {{ team }}
                <v-list-item-action>
                  <nuxt-link :to="`/teams/${team}`"
                    ><v-icon small> mdi-open-in-new </v-icon></nuxt-link
                  >
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6">
          <v-card class="fill-height">
            <v-card-title> Description </v-card-title>
            <v-card-text>{{ tournament.description }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3" md="3" lg="3">
          <v-card class="fill-height">
            <v-card-title> Details </v-card-title>
            <v-card-text
              ><v-icon left>mdi-calendar-plus</v-icon
              >{{
                $dateFns.format(tournament.createdAt, 'yyy-MM-dd')
              }}</v-card-text
            >
            <v-card-text
              ><v-icon left>mdi-account-tie</v-icon
              >{{ tournament.organizer }}</v-card-text
            >
            <v-card-text>
              <span>Status: </span>
              <span v-if="!tournament.started">
                <v-icon left>mdi-checkbox-blank-circle</v-icon>Not started yet
              </span>
              <span v-if="tournament.started && !tournament.finished">
                <v-icon color="yellow" left>mdi-checkbox-blank-circle</v-icon>In
                progress
              </span>
              <span v-if="tournament.finished">
                <v-icon color="green" left>mdi-checkbox-blank-circle</v-icon
                ><span>Finished</span>
              </span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card class="tw-p-3">
            <TournamentBracket :bracket-size="tournament.nrOfTeams" />
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-main>
</template>

<script>
  import TournamentBracket from '@/components/tournaments/TournamentBracket.vue';

  export default {
    name: 'TournamentPage',
    components: {TournamentBracket},
    data: () => ({
      tournament: {},
      slug: '',
      tab: null,
    }),
    async fetch() {
      try {
        const res = await this.$axios.get(
          `/tournaments/${this.$route.params.slug}`,
        );
        this.tournament = res.data;
        this.slug = this.$route.params.slug;
      } catch (e) {
        if (e.response.status === 404) {
          return this.$nuxt.error({statusCode: 404, message: 'Team Not found'});
        }
      }
    },
    head() {
      return {
        title: this.tournament.title,
      };
    },
    computed: {},
  };
</script>

<style scoped></style>
