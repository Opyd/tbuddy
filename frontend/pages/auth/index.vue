<template>
  <v-main>
    <v-container class="tw-w-full">
      <v-tabs
        v-model="tab"
        :color="$vuetify.theme.dark ? 'white' : 'black'"
        fixed-tabs
        class="tw-w-full">
        <v-tab>Log in</v-tab>
        <v-tab align-with-title>Create new account</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item class="tw-flex tw-justify-center">
          <LoginCard class="tw-w-2/3 tw-py-10" />
        </v-tab-item>
        <v-tab-item class="tw-flex tw-justify-center">
          <RegisterCard class="tw-w-2/3 tw-py-10" />
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </v-main>
</template>

<script>
  import LoginCard from '@/components/auth/LoginCard';
  import RegisterCard from '@/components/auth/RegisterCard';
  export default {
    components: {RegisterCard, LoginCard},
    data() {
      return {
        tab: null,
      };
    },

    head() {
      return {
        title: 'Authorize',
      };
    },
  };
</script>

<style scoped></style>
