<script setup lang="ts">
import { NButton } from 'naive-ui';
import NavBar from '@/components/navbar/NavBar.vue';
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <NavBar></NavBar>
    <p class="">no elo elo</p>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { darkTheme } from 'naive-ui';

export default defineComponent({
  setup() {
    return {
      darkTheme,
    };
  },
});
</script>

<style scoped></style>
