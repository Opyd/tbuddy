<template>
  <v-container>
    <v-main>
      <v-row justify="center">
        <v-col xl="8" lg="12" md="12" sm="12" cols="12" align="center">
          <v-card class="tw-p-5">
            <p
              class="md:tw-text-3xl tw-text-center sm:tw-text-xl xs:tw-text-sm">
              Create tournament
            </p>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <v-text-field v-model="title" outlined label="Title" />
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="teams"
                    outlined
                    :items="nrOfTeams"
                    label="Number of teams" />
                </v-col>
              </v-row>
              <v-textarea v-model="description" outlined label="Description" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<script>
  export default {
    name: 'CreateTournament',
    data: () => ({
      title: '',
      description: '',
      nrOfTeams: [4, 8, 16, 32, 64],
      teams: 0,
    }),
    head: () => ({
      title: 'Create Tournament',
    }),
  };
</script>

<style scoped></style>
