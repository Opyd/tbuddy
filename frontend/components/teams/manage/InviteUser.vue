<template>
  <div class="tw-w-full tw-flex tw-p-3 tw-justify-center">
    <div class="tw-w-full">
      <p class="tw-text-center" style="font-family: 'Unbounded', sans-serif">
        Invite player to the Team
      </p>
      <div class="tw-w-2/3 tw-mx-auto">
        <v-text-field
          v-model.lazy.trim="query"
          prepend-inner-icon="mdi-account-search"
          placeholder="Type in username"
          hint="Only players who are not currently on any team will be displayed."
          class="tw-w-full"
          :loading="loading" />
      </div>
      <div class="tw-w-full">
        <v-virtual-scroll
          bench="2"
          :items="found"
          class="tw-mt-3"
          height="300"
          item-height="64">
          <template #default="{item}">
            <v-list-item :key="item">
              <v-list-item-action>
                <v-icon> mdi-account </v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  {{ item.username }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <nuxt-link :to="`/users/${item.username}`"
                  ><v-icon small> mdi-open-in-new </v-icon></nuxt-link
                >
              </v-list-item-action>
              <v-list-item-action>
                <v-btn color="success">Invite</v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-divider></v-divider>
          </template>
        </v-virtual-scroll>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'InviteUser',
    data: () => ({
      query: '',
      found: [],
      loading: false,
    }),
    watch: {
      async query(newValue) {
        if (newValue.length === 0) {
          return;
        }
        try {
          this.loading = true;
          const res = await this.$axios.get(`/users/search/${newValue}`);
          this.found = res.data;
          this.loading = false;
        } catch (e) {
          this.$toast.error('Something went wrong');
        }
      },
    },
  };
</script>

<style scoped></style>
