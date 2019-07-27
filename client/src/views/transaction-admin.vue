<template>
    <v-container>
    <div class="text-xs-center">
      <v-progress-circular indeterminate color="primary" v-show="loading"></v-progress-circular>
    </div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-layout row class="mb-2">
          <v-flex xs3>
            <div class="headline">Transactions</div>
          </v-flex>
        </v-layout>
      </v-flex>

      
      



    </v-layout>








    <v-layout row justify-center>
                <v-dialog v-model="dialog" persistent max-width="290">
                    <v-card>
                        <v-card-title class="headline">Access Denied: Unauthorized</v-card-title>
                        <v-card-text>Only admins are allowed to access this page, contact the developers to get an admin key.</v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" flat @click="closeDialog">OK</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
    </v-layout>

  </v-container>
</template>

<script>
import TransactionCard from "../components/transaction-card"

export default {
    name: "TransactionsAdmin",
    created() {
        if(!this.$store.state.admin) {
            this.dialog = true
        } else {
            this.loading = true
            console.log("?????")
            this.$store.dispatch("GET_TRANSACTIONS_ADMIN")
            .then(transactions =>{
                console.log("HELLOOO???")
                this.transactions = transactions
                this.loading = false
            })
            .catch(err =>{
                console.log(err)
            })
        }
    },
    components:{
        TransactionCard
    },
    data() {
        return {
            loading: false,
            transactions: [],
            dialog: false
        }
    },
    methods: {
        closeDialog: function () {
            this.dialog = false
            this.$router.push("/products")
        }
    }
}
</script>

<style>

</style>
