<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <div v-if="!loggedIn">
        <nuxt-link to="/auth">
          <v-btn color="primary">
            <v-icon left>mdi-login</v-icon>
            Login
          </v-btn>
        </nuxt-link>
      </div>
      <div v-if="loggedIn">
        <nuxt-link to="/users/me">
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
    <v-footer :absolute="!fixed" app>
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
          icon: 'mdi-login',
          title: 'Log in',
          to: '/auth/login',
        },
      ],
      title: 'TBuddy',
    }
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn
    },
  },
  created() {},
}
</script>
