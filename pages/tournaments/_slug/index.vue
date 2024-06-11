<template>
  <v-row justify="center">
    <v-col xl="8" lg="12" md="12" sm="12" cols="12">
      <v-main>
        <div v-if="$fetchState.pending" class="tw-w-full">
          <v-skeleton-loader
            type="image,list-item-avatar-three-line"></v-skeleton-loader>
        </div>
        <div v-else class="">
          <v-row>
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
            <v-col cols="6" sm="6" md="3" lg="3">
              <v-card outlined elevation="2" class="fill-height">
                <v-card-title> Details </v-card-title>
                <v-card-text
                  ><v-icon left>mdi-calendar-plus</v-icon
                  >{{
                    $dateFns.format(tournament.createdAt, 'yyy-MM-dd')
                  }}</v-card-text
                >
                <v-card-text
                  ><v-icon left>mdi-account-tie</v-icon
                  ><NuxtLink
                    style="color: inherit"
                    :to="`/users/${tournament.organizer}`"
                    >{{ tournament.organizer }}</NuxtLink
                  ></v-card-text
                >
                <v-card-text>
                  <span>Status: </span>
                  <small v-if="!tournament.started">
                    <v-icon left>mdi-checkbox-blank-circle</v-icon>Not started
                    yet
                  </small>
                  <small v-if="tournament.started && !tournament.finished">
                    <v-icon color="yellow" left
                      >mdi-checkbox-blank-circle</v-icon
                    >In progress
                  </small>
                  <small v-if="tournament.finished">
                    <v-icon color="green" left>mdi-checkbox-blank-circle</v-icon
                    ><span>Finished</span>
                  </small>
                </v-card-text>
                <v-card-actions
                  v-if="
                    $auth.user !== null &&
                    tournament.organizer !== $auth.user.username
                  ">
                  <v-btn
                    :disabled="
                      $auth.user.currentTeam === null ||
                      tournament.participants.includes($auth.user.currentTeam)
                    "
                    class="mx-auto tw-w-1/2"
                    @click="joinTournament"
                    >{{
                      tournament.participants.includes($auth.user.currentTeam)
                        ? 'Joined'
                        : 'Join'
                    }}</v-btn
                  >
                </v-card-actions>
                <v-card-actions
                  v-if="
                    $auth.user !== null &&
                    tournament.organizer === $auth.user.username
                  ">
                  <NuxtLink
                    class="mx-auto tw-w-1/2"
                    :to="`/tournaments/${slug}/manage`"
                    ><v-btn class="tw-w-full" color="primary"
                      >Manage <v-icon right>mdi-cog</v-icon></v-btn
                    ></NuxtLink
                  >
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col cols="6" sm="6" md="3" lg="3">
              <v-card outlined elevation="2" class="fill-height">
                <v-card-title>
                  <span
                    >Teams: {{ tournament.participants.length }} /
                    {{ tournament.nrOfTeams }}</span
                  >
                </v-card-title>
                <v-list
                  v-if="tournament.participants.length > 0"
                  id="style-2"
                  class="tw-max-h-52 tw-overflow-y-auto tw-overflow-x-hidden">
                  <v-list-item
                    v-for="team in tournament.participants"
                    :id="team"
                    :key="team">
                    <v-col cols="10"
                      ><span>{{ team }}</span></v-col
                    >
                    <v-col cols="2"
                      ><nuxt-link :to="`/teams/${team}`"
                        ><v-icon right small>
                          mdi-open-in-new
                        </v-icon></nuxt-link
                      ></v-col
                    >
                  </v-list-item>
                </v-list>
                <v-card-text v-else class="tw-mt-5 text-center">
                  No signed teams yet
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="12" md="6" lg="6">
              <v-card outlined elevation="2" class="fill-height">
                <v-card-title> Description </v-card-title>
                <v-card-text
                  id="style-2"
                  class="tw-max-h-52 tw-overflow-y-auto"
                  >{{ tournament.description }}</v-card-text
                >
              </v-card>
            </v-col>
            <v-col cols="12" align="center">
              <v-card
                id="style-2"
                outlined
                elevation="2"
                class="tw-overflow-x-auto tw-w-fit">
                <div
                  v-if="tournament.started || tournament.finished"
                  class="tw-p-3"
                  :style="{width: `${(tournament.stages.length + 2) * 200}px`}">
                  <TournamentBracket
                    class="tw-w-full"
                    :bracket-size="tournament.nrOfTeams"
                    :round-tournament="tournament.stages" />
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-main>
    </v-col>
  </v-row>
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
          `/tournaments/slug/${this.$route.params.slug}`,
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
    methods: {
      async joinTournament() {
        try {
          const res = await this.$axios.post(
            `tournaments/join/${this.tournament._id}`,
          );
          const {tag} = res.data;
          this.tournament.participants.push(tag);
          this.$toast.success('Your team has joined this tournament!');
        } catch (e) {
          this.$toast.error(e.response.data.message);
        }
      },
    },
  };
</script>

<style scoped>
  #alternateColors:nth-child(odd) {
    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
  }
</style>
