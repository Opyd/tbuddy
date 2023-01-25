<template>
  <v-container fluid>
    <div v-if="$fetchState.pending" class="tw-w-full">
      <v-skeleton-loader
        class="tw-w-full"
        type="list-item-avatar-three-line, image, article"></v-skeleton-loader>
    </div>
    <div v-else>
      <v-row justify="center">
        <v-col xl="8" lg="12" md="12" sm="12" cols="12">
          <v-card outlined elevation="2" class="tw-mb-5">
            <div
              class="tw-w-full tw-h-10 tw-flex tw-justify-center tw-items-center tw-rounded"
              style="font-family: 'Unbounded', cursive"
              :style="{backgroundColor: team.color}">
              <span class="tw-tracking-widest tw-text-white">{{
                team.tag
              }}</span>
            </div>
            <div
              class="tw-flex-nowrap tw-flex tw-w-full tw-p-5 tw-items-center tw-gap-10">
              <div class="tw-flex tw-justify-center tw-flex-col">
                <v-avatar color="primary" size="128" rounded class="tw-w-full">
                  <v-icon
                    color="white"
                    :style="{backgroundColor: team.color}"
                    size="128"
                    >{{ team.icon }}</v-icon
                  >
                </v-avatar>
              </div>
              <v-row class="tw-w-3/5" no-gutters>
                <v-col cols="12">
                  <small>Team</small>
                </v-col>
                <v-col cols="12">
                  <p class="sm:tw-text-4xl md:tw-text-4xl tw-w-3/5">
                    {{ team.name }}
                  </p>
                </v-col>
              </v-row>

              <div class="tw-self-start tw-justify-self-end">
                <v-icon size="18"> mdi-calendar</v-icon>
                <small
                  ><i>{{ $dateFns.format(team.createdAt, 'yyy-MM-dd') }} </i>
                </small>
                <div
                  v-if="
                    $auth.user !== null && $auth.user.username === team.owner
                  "
                  class="tw-mt-5 tw-flex tw-justify-center">
                  <NuxtLink :to="`${$route.params.tag}/manage`"
                    ><v-btn color="primary">Manage</v-btn></NuxtLink
                  >
                </div>
              </div>
            </div>
          </v-card>
          <v-row>
            <v-col cols="12" md="6" sm="6">
              <v-card outlined elevation="2" class="fill-height">
                <div
                  class="tw-w-full tw-flex tw-justify-center tw-items-center tw-my-3">
                  <span style="font-family: 'Unbounded', sans-serif"
                    >Members</span
                  >
                </div>
                <v-divider></v-divider>
                <div
                  id="style-2"
                  class="tw-w-full tw-max-h-52 tw-overflow-y-auto tw-flex tw-flex-col tw-justify-center tw-items-center">
                  <div class="tw-w-full">
                    <TeamMember :username="team.owner" owner />
                  </div>

                  <div
                    v-for="member in team.members"
                    id="alternateColorsMembers"
                    :key="member"
                    class="tw-w-full">
                    <TeamMember :username="member" />
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-card outlined elevation="2">
                <div
                  class="tw-w-full tw-flex tw-justify-center tw-items-center tw-my-3">
                  <span style="font-family: 'Unbounded', sans-serif"
                    >Team History</span
                  >
                </div>
                <v-divider></v-divider>
                <div
                  id="style-2"
                  class="tw-w-full tw-max-h-52 tw-overflow-y-auto">
                  <div
                    class="tw-w-full tw-justify-center tw-p-3 tw-flex tw-flex-col">
                    <HistoryEvent
                      v-for="event in team.events"
                      id="alternateColors"
                      :key="event.date"
                      :event="event" />
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="6" sm="6" lg="6">
              <v-card outlined elevation="2" class="">
                <div
                  class="tw-w-full tw-flex tw-justify-center tw-items-center tw-my-3">
                  <span style="font-family: 'Unbounded', sans-serif"
                    >Last Matches</span
                  >
                </div>

                <v-divider></v-divider>

                <div
                  class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center">
                  <div v-if="team.history.length === 0" class="tw-p-3">
                    <small><i>The team's match history is empty</i></small>
                  </div>
                  <div
                    v-else
                    id="style-2"
                    class="tw-w-full tw-max-h-52 tw-overflow-x-hidden tw-overflow-y-auto">
                    <MatchHistory
                      v-for="match in team.history"
                      :key="match.matchId"
                      class="tw-w-full"
                      :match="match" />
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="6" sm="6" lg="6">
              <ActiveTournament :tournament-id="team.activeTournament" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
  import TeamMember from '@/components/teams/TeamMember.vue';
  import HistoryEvent from '@/components/teams/tag/HistoryEvent.vue';
  import MatchHistory from '@/components/teams/tag/MatchHistory.vue';
  import ActiveTournament from '@/components/teams/ActiveTournament.vue';

  export default {
    name: 'TeamTag',
    components: {ActiveTournament, MatchHistory, HistoryEvent, TeamMember},
    data: () => ({
      team: {},
      loading: true,
      title: '',
    }),
    async fetch() {
      try {
        const res = await this.$axios.get(
          `/teams/tag/${this.$route.params.tag.toUpperCase()}`,
        );
        this.team = res.data;
        this.title = res.name;
      } catch (e) {
        if (e.response.status === 404) {
          return this.$nuxt.error({statusCode: 404, message: 'Team Not found'});
        }
      }
    },

    head() {
      return {
        title: this.team.name,
      };
    },
  };
</script>

<style scoped>
  #alternateColors:nth-child(odd) {
    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
  }
  #alternateColorsMembers:nth-child(even) {
    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
  }
</style>
