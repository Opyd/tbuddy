<template>
  <v-card outlined elevation="2">
    <div class="tw-w-full">
      <p
        class="tw-text-2xl tw-text-center tw-pt-3"
        style="font-family: 'Unbounded', sans-serif">
        My Team
      </p>
    </div>
    <v-divider></v-divider>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-overline mb-4">
          <span style="font-family: 'Unbounded', cursive">{{ team.tag }}</span>
        </div>
        <v-list-item-title class="text-h5 mb-1">
          {{ team.name }}
        </v-list-item-title>
        <v-list-item-subtitle
          >Created:
          {{
            $dateFns.format(team.createdAt, 'yyy-MM-dd')
          }}</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-avatar size="60" :color="team.color" rounded>
        <v-icon color="white" size="40">{{ team.icon }}</v-icon>
      </v-list-item-avatar>
    </v-list-item>

    <v-card-actions>
      <nuxt-link :to="`/teams/${team.tag}`">
        <v-btn outlined rounded text>
          More <v-icon right>mdi-open-in-new</v-icon>
        </v-btn></nuxt-link
      >
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'UserTeam',
    props: ['team'],
  };
</script>

<style scoped></style>
