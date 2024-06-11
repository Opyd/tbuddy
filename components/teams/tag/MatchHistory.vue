<template>
  <div
    class="tw-py-3 tw-text-white"
    :class="match.result === 'win' ? 'tw-bg-green-700' : 'tw-bg-red-700'">
    <v-row>
      <v-col class="tw-flex tw-justify-center" cols="4">
        <small class="text-center">{{
          $dateFns.format(match.date, 'yyyy-MM-dd HH:mm')
        }}</small>
      </v-col>
      <v-col class="tw-flex tw-justify-center" cols="4">
        <span class="text-center">{{ match.opponent }}</span>
      </v-col>
      <v-col class="tw-flex tw-justify-center" cols="4">
        <span class="text-center">{{ match.result.toUpperCase() }}</span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'MatchHistory',
    props: {
      match: Object,
    },
  };
</script>

<style scoped></style>
