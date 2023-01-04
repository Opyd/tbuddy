<template>
  <div class="tw-my-2">
    <v-row>
      <v-col sm="4">
        <div
          class="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center">
          <div class="tw-p-2">
            <v-icon>mdi-message-badge</v-icon>
          </div>
        </div>
      </v-col>
      <v-col sm="4">
        <div
          class="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center tw-p-2">
          <span class="tw-text-center">{{ msg }} </span>
        </div></v-col
      >
      <v-col sm="4">
        <div
          class="tw-w-full tw-h-full tw-flex tw-justify-evenly tw-items-center tw-py-2">
          <v-btn small fab @click="removeMsg()"
            ><v-icon>mdi-delete</v-icon></v-btn
          >
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'InboxMsg',
    props: {
      msg: String,
      index: Number,
    },
    methods: {
      async removeMsg() {
        try {
          await this.$axios.delete(`users/msg/${this.index}`);
          this.$el.parentNode.removeChild(this.$el);
        } catch (e) {
          this.$toast.error('Something went wrong');
        }
      },
    },
  };
</script>

<style scoped></style>
