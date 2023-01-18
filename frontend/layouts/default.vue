<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-if="loggedIn" #append>
        <div class="pa-2">
          <v-btn block @click="logout"> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-btn
        class="tw-mr-2"
        rounded
        small
        @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
      <div v-if="!loggedIn">
        <nuxt-link to="/auth">
          <v-btn color="primary">
            <v-icon left>mdi-login</v-icon>
            Login
          </v-btn>
        </nuxt-link>
      </div>
      <div v-if="loggedIn">
        <nuxt-link :to="`/users/${$auth.user.username}`">
          <v-btn color="primary">
            <v-icon left>mdi-account</v-icon>
            My Account
          </v-btn>
        </nuxt-link>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app class="tw-justify-end">
      <span>Daniel Opyd &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    name: 'DefaultLayout',
    data() {
      return {
        clipped: false,
        drawer: false,
        fixed: false,
        user: '',
        items: [
          {
            icon: 'mdi-apps',
            title: 'Welcome',
            to: '/',
          },
          {
            icon: 'mdi-tournament',
            title: 'Tournaments',
            // to: '/auth/login',
          },
          {
            icon: 'mdi-account-group',
            title: 'Teams',
            to: '/teams',
          },
          {
            icon: 'mdi-account-search',
            title: 'Users',
            to: '/users',
          },
          {
            icon: 'mdi-account-multiple-plus',
            title: 'Looking for Team',
            // to: '/auth/login',
          },
        ],
        title: 'TBuddy',
      };
    },
    computed: {
      loggedIn() {
        return this.$auth.loggedIn;
      },
    },
    created() {},
    methods: {
      async logout() {
        try {
          const res = await this.$axios.get('auth/logout');
          if (res.status === 200) {
            this.$toast.success('Successfully logged out');
            await this.$auth.logout();
            await this.$router.push('/auth');
          }
        } catch (e) {
          this.$toast.error('Something went wrong');
        }
      },
    },
  };
</script>

<style>
  #style-2::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
    border-radius: 10px;
    background-color: rgba(245, 245, 245, 0);
  }

  #style-2::-webkit-scrollbar {
    width: 12px;
    background-color: rgba(245, 245, 245, 0);
  }

  #style-2::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: rgba(152, 147, 147, 0.5);
  }
</style>
