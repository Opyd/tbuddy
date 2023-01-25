<template>
  <v-card outlined elevation="2">
    <v-list-item>
      <v-list-item-action>
        <v-icon color="white"> mdi-tournament </v-icon>
      </v-list-item-action>

      <v-list-item-content>
        <v-list-item-title>
          {{ tournament.title }}
        </v-list-item-title>
      </v-list-item-content>

      <v-list-item-content>
        <v-list-item-action-text>
          {{ tournament.participants.length }} / {{ tournament.nrOfTeams }}
          <v-icon right>mdi-account-group</v-icon>
        </v-list-item-action-text>
      </v-list-item-content>

      <v-list-item-action>
        <v-list-item-action-text>
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
        </v-list-item-action-text>
      </v-list-item-action>

      <v-list-item-action>
        <nuxt-link :to="`/tournaments/${tournament.slug}`"
          ><v-icon small> mdi-open-in-new </v-icon></nuxt-link
        >
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>

<script>
  export default {
    name: 'TournamentCard',
    props: ['tournament'],
  };
</script>

<style scoped></style>
