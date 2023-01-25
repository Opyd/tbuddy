<template>
  <v-card outlined elevation="2">
    <v-list-item :key="item.username">
      <v-list-item-action>
        <v-icon v-if="item.avatar === null"> mdi-account </v-icon>
        <img v-else :src="item.avatar" />
      </v-list-item-action>

      <v-list-item-content>
        <v-list-item-title>
          {{ item.username }}
        </v-list-item-title>
      </v-list-item-content>

      <v-list-item-content>
        <div style="display: flex">
          <RoleIcon
            v-for="role in item.details.preferredRoles"
            :key="role"
            :role="role" />
        </div>
      </v-list-item-content>

      <v-list-item-action>
        <nuxt-link :to="`/users/${item.username}`"
          ><v-icon small> mdi-open-in-new </v-icon></nuxt-link
        >
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>

<script>
  import RoleIcon from '@/components/user/roles/RoleIcon.vue';

  export default {
    name: 'UserCard',
    components: {RoleIcon},
    props: ['item'],
  };
</script>

<style scoped></style>
