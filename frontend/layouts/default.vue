<template>
  <v-app dark :style="$vuetify.theme.dark ? imageDark : image">
    <v-navigation-drawer
      v-model="drawer"
      mini-variant
      expand-on-hover
      clipped
      fixed
      app>
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
        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon>mdi-door-open</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon aria-label="Navigation" @click.stop="drawer = !drawer" />
      <v-toolbar-title
        ><v-icon left>mdi-trophy</v-icon>
        <span style="font-family: 'Unbounded', sans-serif">{{
          title
        }}</span></v-toolbar-title
      >
      <v-spacer />
      <v-btn
        class="tw-mr-2"
        rounded
        small
        aria-label="theme"
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
          <v-btn color="primary" aria-label="Account">
            <v-icon
              :left="
                $vuetify.breakpoint.name !== 'sm' &&
                $vuetify.breakpoint.name !== 'xs'
              "
              >mdi-account</v-icon
            >
            {{
              $vuetify.breakpoint.name === 'sm' ||
              $vuetify.breakpoint.name === 'xs'
                ? ''
                : 'My Account'
            }}
          </v-btn>
        </nuxt-link>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      color="transparent"
      inset
      app
      :absolute="!fixed"
      class="tw-justify-center">
      <v-chip>Daniel Opyd &copy; {{ new Date().getFullYear() }}</v-chip>
    </v-footer>
  </v-app>
</template>

<script>
  import waves from 'assets/waves.svg';
  import wavesDark from 'assets/waves-dark.svg';

  export default {
    name: 'DefaultLayout',
    data() {
      return {
        clipped: true,
        drawer: false,
        fixed: false,
        image: {
          backgroundImage: `url(${waves})`,
          backgroundSize: 'cover',
        },
        imageDark: {
          backgroundImage: `url(${wavesDark})`,
          backgroundSize: 'cover',
        },
        user: '',
        items: [
          {
            icon: 'mdi-apps',
            title: 'Welcome',
            to: '/',
          },
          {
            icon: 'mdi-view-dashboard',
            title: 'Dashboard',
            to: '/dashboard',
          },
          {
            icon: 'mdi-tournament',
            title: 'Tournaments',
            to: '/tournaments',
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
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
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
