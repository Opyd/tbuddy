<template>
  <v-card outlined elevation="2">
    <v-card-title>
      <span class="text-h5">Edit details</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="newFirstname"
              outlined
              label="First name"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="newAbout"
              outlined
              label="About"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="newRoles"
              outlined
              :items="['TOP', 'JUNGLE', 'MID', 'BOT', 'SUPPORT']"
              label="Role"
              multiple
              required></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-autocomplete
              v-model="newCountry"
              outlined
              :items="countries"
              label="Country"></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12">
            <v-switch v-model="newLFT" label="Looking for Team" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="$emit('close')"> Close </v-btn>
      <v-btn color="blue darken-1" text @click="updateDetails"> Save </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import {countryList} from '@/components/user/countries';

  export default {
    name: 'DetailsDialog',
    props: {
      userDetails: {
        type: Object,
        default: null,
      },
    },
    data: () => ({
      countries: [],
      newFirstname: '',
      newAbout: '',
      newRoles: [],
      newCountry: '',
      newLFT: false,
    }),
    created() {
      this.countries = countryList;
      this.newFirstname = this.userDetails.firstname;
      this.newAbout = this.userDetails.about;
      this.newRoles = this.userDetails.preferredRoles;
      this.newCountry = this.userDetails.country;
      this.newLFT = this.userDetails.lookingForTeam;
    },
    methods: {
      async updateDetails() {
        try {
          const res = await this.$axios.patch('/users/me', {
            details: {
              firstname: this.newFirstname,
              about: this.newAbout,
              preferredRoles: this.newRoles,
              country: this.newCountry,
              lookingForTeam: this.newLFT,
            },
          });
          if (res.status === 200) {
            this.$toast.success('Successfully updated details!');
          }
        } catch (e) {
          this.$toast.error('Something went wrong, try again later!');
        }
      },
    },
  };
</script>

<style scoped></style>
