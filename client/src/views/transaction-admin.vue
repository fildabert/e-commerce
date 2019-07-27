<template>
    <v-container>
    <div class="text-xs-center">
      <v-progress-circular indeterminate color="primary" v-show="loading"></v-progress-circular>
    </div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-layout row class="mb-2">
          <v-flex xs3>
            <div class="headline font-weight-light">Transactions</div>
          </v-flex>
        </v-layout>
      </v-flex>


        <v-flex xs12 v-for="(transaction, i) in transactions" :key="transaction.cartId">
            <v-card>
          <v-layout row wrap>
            <v-flex xs12 md3>
              <v-img :src="transaction.image" :lazy-src="transaction.image" height="100" contain>
                  <template v-slot:placeholder>
                    <v-layout
                      fill-height
                      align-center
                      justify-center
                      ma-0
                    >
                      <v-progress-circular indeterminate color="grey lighten-1"></v-progress-circular>
                    </v-layout>
                  </template>
              </v-img>
            </v-flex>

            <v-flex xs8 md2 class="ml-3 mt-4">
              <div class="title hidden-sm-and-down">Item: {{transaction.title}}</div>

              <div class="subheading hidden-sm-and-up">{{transaction.title}}</div>
              <div class="subheading hidden-sm-and-up">Quantity: {{transaction.quantity}}</div>
              <div class="subheading hidden-sm-and-up">
                Total Price:
                <span class="green--text">${{transaction.quantity * transaction.price}}</span>
              </div>
              <div
                class="grey--text text--darken-2 hidden-sm-and-up"
              >Purchased: {{new Date(transaction.checkoutDate).toLocaleString()}}</div>
            </v-flex>

            <v-flex xs1 offset-xs2 md1 offset-md2>
              <div class="title mt-4 hidden-sm-and-down">x{{transaction.quantity}}</div>
            </v-flex>

            <v-flex xs3 md3>
              <div class="title mt-4 hidden-sm-and-down">
                Total Price:
                <span class="green--text">${{transaction.quantity * transaction.price}}</span>
                <br>
                <v-btn outline color="green" :loading="buttonloading[i]" @click="approve(transaction.cartId, i)">Approve</v-btn>
              </div>
              
            </v-flex>
            <v-flex xs3 md5>
              <div
                class="body-2 ml-2 mt-3 grey--text text--darken-2 hidden-sm-and-down"
              >
              Purchased: {{new Date(transaction.checkoutDate).toLocaleString()}} <br> Buyer: {{transaction.username}}</div>
            </v-flex>
          </v-layout>
        </v-card>
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
            this.getTransactions()
        }
    },
    components:{
        TransactionCard
    },
    data() {
        return {
            loading: false,
            buttonloading: [],
            transactions: [],
            dialog: false
        }
    },
    methods: {
        getTransactions: function () {
            this.$store.dispatch("GET_TRANSACTIONS_ADMIN")
            .then(transactions =>{
                var temp = []
                var temploading = []
                transactions.forEach((t, index) => {    
                    temploading.push(false)
                    temp.push({
                        ...t.product,
                        quantity: t.quantity,
                        cartId: t._id,
                        checkoutDate: t.checkoutDate,
                        ...t.userId
                    })
                }
                )
                this.transactions = temp
                this.buttonloading = temploading
                this.loading = false
            })
            .catch(err =>{
                console.log(err)
            })
        },
        closeDialog: function () {
            this.dialog = false
            this.$router.push("/products")
        },
        approve: function(id, i) {
            // this.buttonloading[i] = true
            // console.log(this.buttonloading[i], "THEN")
            // console.log(this.buttonloading)
            this.loading = true
            this.$store.dispatch("APPROVE_TRANSACTION", {id: id, status: "sent"})
            .then(response =>{
                this.getTransactions()
                // this.buttonloading[i] = false
            })
            .catch(err =>{
                console.log(err)
            })
        }
    }
}
</script>

<style>

</style>
