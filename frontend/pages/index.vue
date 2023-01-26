<template>
  <v-container>
    <v-row justify="center">
      <v-col class="tw-mt-20" cols="8" align="center">
        <v-icon color="white" size="128">mdi-trophy</v-icon>
      </v-col>
      <v-col align="center" cols="8">
        <h1
          style="font-family: 'Unbounded', sans-serif"
          class="md:tw-text-4xl sm:tw-text-2xl tw-text-white tw-text-2xl lg:md:tw-text-4xl">
          TBuddy
        </h1>
      </v-col>
      <v-col cols="8" align="center">
        <span class="tw-font-bold tw-text-white tw-text-2xl">
          Experience the thrill of competitive gaming at the highest level with
          our world-class esports tournaments.
        </span>
      </v-col>
      <v-col cols="8" align="center">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="6" align="end">
            <NuxtLink to="/auth"
              ><v-btn color="primary" class="tw-w-full" x-large
                >Join NOW</v-btn
              ></NuxtLink
            >
          </v-col>
          <v-col cols="12" sm="8" md="6" align="start">
            <NuxtLink to="/tournaments"
              ><v-btn class="tw-w-full" x-large
                >Check tournaments</v-btn
              ></NuxtLink
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="8" sm="8" md="4">
        <v-card elevation="5" class="tw-p-3">
          <v-row justify="center" no-gutters>
            <v-col
              align="center"
              cols="12"
              class="tw-my-3 tw-text-xl"
              style="font-family: 'Unbounded', sans-serif">
              Team Up
            </v-col>
            <v-col align="center" cols="12">
              <v-icon size="64">mdi-account-multiple</v-icon>
            </v-col>
            <v-col align="center" cols="12">
              <v-card-text>
                Join or create a team of elite gamers and compete for glory in
                our thrilling esports tournaments. Represent your team and
                compete against the best in the world.
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="8" sm="8" md="4">
        <v-card elevation="5" class="tw-p-3">
          <v-row justify="center" no-gutters>
            <v-col
              align="center"
              cols="12"
              class="tw-my-3 tw-text-xl"
              style="font-family: 'Unbounded', sans-serif">
              Compete
            </v-col>
            <v-col align="center" cols="12">
              <v-icon size="64">mdi-fencing</v-icon>
            </v-col>
            <v-col align="center" cols="12">
              <v-card-text>
                Prove your worth and put your skills to the test against other
                players by competing in community esports tournaments. Rise to
                the top and claim your place as a champion.
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="8" sm="8" md="4">
        <v-card elevation="5" class="tw-p-3">
          <v-row justify="center" no-gutters>
            <v-col
              align="center"
              cols="12"
              class="tw-my-3 tw-text-xl"
              style="font-family: 'Unbounded', sans-serif">
              Organize
            </v-col>
            <v-col align="center" cols="12">
              <v-icon size="64">mdi-cogs</v-icon>
            </v-col>
            <v-col align="center" cols="12">
              <v-card-text>
                Organize and host your own esports tournaments on our platform,
                where you can and manage all aspects of the competition. Take
                your gaming experience to the next level by becoming a
                tournament organizer
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import landingbg from 'assets/landingbg.jpg';
  export default {
    layout: 'landing',
    data: () => ({
      img: `url(${landingbg})`,
    }),
    head: () => ({
      title: 'Welcome',
    }),
  };
</script>

<style></style>
