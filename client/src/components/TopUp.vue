<template>
    <div>
        <v-btn
      flat
      @click.stop="dialog = true"
    >
      Top Up
    </v-btn>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Top Up</v-card-title>

        <v-card-text>
          <v-text-field label="Amount" type="number" v-model="inputBalance" prepend-icon="fas fa-dollar-sign">

          </v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn flat color="green" @click="topup">
              Top Up
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
</template>

<script>
import axios from "axios"

export default {
    data() {
        return{
            dialog: false,
            inputBalance: 0
        }
    },
    methods: {
      topup:function() {
        var baseUrl = this.$store.state.baseUrl;
        axios.request({
          method: "PATCH",
          url: `${baseUrl}/users/topup`,
          headers: {
            token: sessionStorage.getItem("jwt")
          },
          data: {
            balance: this.inputBalance
          }
        })
        .then(response =>{
          console.log(response.data)
          this.$store.dispatch("GET_BALANCE")
          this.dialog = false
        })
        .catch(err =>{
          console.log(err.response)
        })
      }
    }
}
</script>

<style>

</style>
