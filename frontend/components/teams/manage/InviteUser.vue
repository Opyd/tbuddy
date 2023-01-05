<template>
  <v-card>
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
              <v-list-item :key="item.username">
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
                  <v-btn v-if="alreadyInvited(item.username)" disabled>
                    Invited
                  </v-btn>
                  <v-btn v-else color="success" @click="invite(item.username)"
                    >Invite</v-btn
                  >
                </v-list-item-action>
              </v-list-item>

              <v-divider></v-divider>
            </template>
          </v-virtual-scroll>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
  export default {
    name: 'InviteUser',
    components: {},
    props: ['invitedUsernames'],
    data: () => ({
      query: '',
      found: [],
      invitedInThisSession: [],
      loading: false,
    }),
    computed: {},
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
    methods: {
      async invite(username) {
        const teamtag = this.$route.params.tag.toUpperCase();
        try {
          const res = await this.$axios.post('teams/invite', {
            username,
            teamtag,
          });
          if (res.status === 201) {
            this.$toast.success('Successfully invited');
            this.invitedInThisSession.push(username);
            this.$emit('invited', username);
          }
        } catch (e) {
          this.$toast.error('Something went wrong');
        }
      },
      alreadyInvited(username) {
        if (
          this.invitedUsernames.includes(username) ||
          this.invitedInThisSession.includes(username)
        ) {
          return true;
        }
        return false;
      },
    },
  };
</script>

<style scoped></style>
