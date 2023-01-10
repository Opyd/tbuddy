<template>
  <div>
    <v-card rounded>
      <p>{{ user.username }}</p>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'SearchResult',
    props: {
      user: Object,
    },
  };
</script>

<style scoped></style>
