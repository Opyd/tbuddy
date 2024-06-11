<template>
  <div>
    <img
      :src="require(`~/assets/role_icons/${role.toUpperCase()}.png`)"
      class="resize"
      :alt="role" />
  </div>
</template>

<script>
  export default {
    name: 'RoleIcon',
    props: ['role'],
  };
</script>

<style scoped>
  .resize {
    width: 24px;
    height: auto;
  }
</style>
