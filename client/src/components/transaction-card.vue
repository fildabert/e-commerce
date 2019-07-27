<template>
    <v-card>
          <v-layout row wrap>
            <v-flex xs12 md3>
              <v-img :src="transaction.image" height="100" contain></v-img>
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
              </div>
              
            </v-flex>
            <v-flex xs3 md5>
              <div
                class="body-2 ml-2 mt-3 grey--text text--darken-2 hidden-sm-and-down"
              >Purchased: {{new Date(transaction.checkoutDate).toLocaleString()}}</div>
            </v-flex>
          </v-layout>
        </v-card>
</template>

<script>
export default {
    name: "TransactionCard",
    props: ['transaction']
}
</script>

<style>

</style>
