<template>
    <v-container>
    <div class="text-xs-center">
      <v-progress-circular indeterminate color="primary" v-show="loading"></v-progress-circular>
    </div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-layout row class="mb-2">
          <v-flex xs3>
            <div class="headline">Transaction History</div>
          </v-flex>
        </v-layout>
      </v-flex>

      
      



    </v-layout>
  </v-container>
</template>

<script>
import TransactionCard from "../components/transaction-card"

export default {
    created() {
        this.loading = true
    },
    components:{
        TransactionCard
    },
    data() {
        return {
            loading: false
        }
    }
}
</script>

<style>

</style>
