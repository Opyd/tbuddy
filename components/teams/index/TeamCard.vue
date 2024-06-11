<template>
  <v-card outlined elevation="2">
    <v-list-item :key="item.tag">
      <v-list-item-action>
        <v-avatar rounded :color="item.color">
          <v-icon color="white"> {{ item.icon }} </v-icon>
        </v-avatar>
      </v-list-item-action>

      <v-list-item-content>
        <v-list-item-title>
          {{ item.tag }}
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title>
          {{ item.name }}
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title>
          <v-icon color="#f59e0b">mdi-crown</v-icon>
          {{ item.owner }}
        </v-list-item-title>
      </v-list-item-content>

      <v-list-item-content> </v-list-item-content>

      <v-list-item-action>
        <nuxt-link :to="`/teams/${item.tag}`"
          ><v-icon small> mdi-open-in-new </v-icon></nuxt-link
        >
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>

<script>
  export default {
    name: 'TeamCard',
    props: {
      item: {
        default: null,
        type: Object,
      },
    },
  };
</script>

<style scoped></style>
