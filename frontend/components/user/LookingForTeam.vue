<template>
  <div class="tw-w-flex tw-p-3">
    <div class="tw-w-full tw-mb-2 tw-flex tw-justify-center">
      <v-icon size="32" color="green" class="tw-animate-bounce"
        >mdi-flag-triangle</v-icon
      >
    </div>
    <div class="tw-w-full">
      <span>{{ username }} is looking for a Team!</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LookingForTeam',
    props: ['username'],
  };
</script>

<style scoped></style>
