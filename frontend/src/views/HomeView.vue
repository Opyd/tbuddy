<script lang="ts" setup>
import { ref, onMounted } from 'vue';

// reactive state
const count = ref(0);

// functions that mutate state and trigger updates
function increment() {
  count.value++;
}
</script>

<template>
  <h1>{{ count }}</h1>
  <button @click="increment()">Klik</button>
</template>

<script lang="ts">
export default {
  name: 'HomeView',
};
</script>

<style scoped></style>
