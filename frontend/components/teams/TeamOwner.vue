<template>
  <div class='tw-flex tw-justify-start tw-items-center tw-flex-wrap'>
    <div class='tw-mr-2'>
      <v-icon color='#f59e0b'>mdi-crown</v-icon>
    </div>
    <div style="font-family: 'Unbounded', sans-serif" class='tw-w-5/6'>
      Owner
    </div>
    <div class='tw-w-full tw-mt-2 tw-p-1 '>
      <div v-if="$fetchState.pending" class='tw-w-full'>
        <v-skeleton-loader
          class="tw-w-full"
          type="list-item"></v-skeleton-loader>
      </div>
      <div class='tw-w-full' v-else>
        <p>{{owner.username}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['ownerId'],
  name: 'TeamOwner',
  data: () => ({
    owner: {},
  }),
  async fetch() {
    try {
      const res = await this.$axios.get(`/users/${this.ownerId}`);
      this.owner = res.data;
    } catch (e) {
      this.$toast.error("Something went wrong")
    }
  }
}
</script>

<style scoped>

</style>
