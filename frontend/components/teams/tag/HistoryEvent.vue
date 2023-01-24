<template>
  <v-row align="center" justify="center">
    <v-col cols="3">
      <v-icon v-if="event.type == 'CREATED'">mdi-calendar</v-icon>
      <v-icon v-if="event.type == 'JOINED'" color="green">mdi-plus</v-icon>
      <v-icon v-if="event.type == 'LEFT'" color="red">mdi-minus</v-icon>
      <v-icon v-if="event.type == 'TOURNAMENT_DROPPED'">mdi-skull</v-icon>
      <v-icon v-if="event.type == 'TOURNAMENT_WIN'">mdi-crown</v-icon>
    </v-col>
    <v-col cols="4">
      <span>
        {{ $dateFns.format(event.date, 'yyy-MM-dd') }}
      </span>
    </v-col>
    <v-col cols="5">
      <span v-if="event.msg !== ''">{{ event.msg }}</span>
      <span v-if="event.type == 'CREATED'">The team was created </span>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'HistoryEvent',
    props: {
      event: Object,
    },
    data: () => ({}),
  };
</script>

<style scoped></style>
