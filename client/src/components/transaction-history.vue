<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-layout row class="mb-2">
                    <v-flex xs3>
                        <div class="headline">Transaction History</div>
                    </v-flex>
                    
                </v-layout>

            </v-flex>
            <v-flex xs12 v-for="transaction in transactions" :key="transaction.cartId">
                <v-card>
                    <v-layout row>
                        <v-flex xs3>
                            <v-img :src="transaction.image" height="100" contain>
                                
                            </v-img>
                        </v-flex>

                        <v-flex xs2 class="ml-3 mt-4">
                            <div class="title">{{transaction.title}}</div>
                        </v-flex>


                        <v-flex xs1 offset-xs2>
                            <div class="title mt-4">x{{transaction.quantity}}</div>
                        </v-flex>

                        <v-flex xs3>
                            <div class="title mt-4">Total Price: <span class="green--text">${{transaction.quantity * transaction.price}}</span></div>
                        </v-flex>
                        <v-flex xs3>
                            <div class="body-2 ml-2 mt-3 grey--text text--darken-2">Purchased: {{new Date(transaction.checkoutDate).toLocaleString()}}</div>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>


export default {
    name: "TransactionHistory",
    created () {
        if(!this.$store.state.isLogin){
            this.$emit("loginFirst")
            this.$router.push("/products")
        }
        this.$store.dispatch("GET_TRANSACTIONS")
         .then(transactions =>{
             transactions.forEach(t => this.transactions.push({...t.product, quantity: t.quantity, cartId: t._id, checkoutDate: t.checkoutDate}))
         })
         .catch(err =>{
             console.log(err.response)
         })
    },
    data () {
        return {
            transactions: []
        }
    }
}
</script>

<style>

</style>
