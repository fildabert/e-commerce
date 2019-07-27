<template>
  <v-container>
    <div class="text-xs-center">
      <v-progress-circular indeterminate color="primary" v-show="loading"></v-progress-circular>
    </div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-layout row class="mb-2">
          <v-flex xs3>
            <div class="headline font-weight-light">Transaction History</div>
          </v-flex>
        </v-layout>

        <v-tabs centered dark>
          <v-tabs-slider color="yellow"></v-tabs-slider>

          <v-tab href="#tab-1">Pending</v-tab>

          <v-tab href="#tab-2">Sent</v-tab>

          <v-tab href="#tab-3">Received</v-tab>

          <v-tab-item :value="'tab-1'">
            <v-layout justify-center v-if="transactions.length === 0">
              <h1
                class="text-center grey--text text--darken-2 font-weight-light"
                style="padding-top: 4%;"
              >Your orders will be displayed here</h1>
            </v-layout>
            <v-flex xs12 v-for="pending in transactions" :key="pending.cartId">
              <TransactionCard :transaction="pending"></TransactionCard>
            </v-flex>
          </v-tab-item>

          <v-tab-item :value="'tab-2'">
            <v-layout justify-center v-if="sent.length === 0">
              <h1
                class="text-center grey--text text--darken-2 font-weight-light"
                style="padding-top: 4%;"
              >You have no items here, please wait while our staffs are going through your orders</h1>
            </v-layout>
            <v-flex xs12 v-for="item in sent" :key="item.cartId">
              <TransactionCard :transaction="item" @complete="complete"></TransactionCard>
            </v-flex>
          </v-tab-item>

          <v-tab-item :value="'tab-3'">
            <v-layout justify-center v-if="received.length === 0">
              <h1
                class="text-center grey--text text--darken-2 font-weight-light"
                style="padding-top: 4%;"
              >Your completed orders will be displayed here</h1>
            </v-layout>
            <v-flex xs12 v-for="item in received" :key="item.cartId">
              <TransactionCard :transaction="item"></TransactionCard>
            </v-flex>
          </v-tab-item>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TransactionCard from "./transaction-card";
import axios from "axios";

export default {
  name: "TransactionHistory",
  components: {
    TransactionCard
  },
  created() {
    if (!this.$store.state.isLogin) {
      this.$emit("loginFirst");
      this.$router.push("/products");
    }
    this.loading = true;
    this.getAllTransactions();
  },
  data() {
    return {
      transactions: [],
      sent: [],
      received: [],
      loading: false,
      tabs: ["pending", "sent", "received"],
      text: "asdkasodiasidasiodasoidasoidajsodiasjo"
    };
  },
  methods: {
    getAllTransactions() {
      this.$store
        .dispatch("GET_PENDING_TRANSACTIONS")
        .then(transactions => {
          var temp1 = [];
          transactions.forEach(t => {
            temp1.push({
              ...t.product,
              quantity: t.quantity,
              cartId: t._id,
              checkoutDate: t.checkoutDate,
              status: t.status
            });
          });
          this.transactions = temp1;
        })
        .catch(err => {
          console.log(err.response);
        });

      this.$store
        .dispatch("GET_SENT_TRANSACTIONS")
        .then(transactions => {
          var temp2 = [];
          transactions.forEach(t => {
            temp2.push({
              ...t.product,
              quantity: t.quantity,
              cartId: t._id,
              checkoutDate: t.checkoutDate,
              status: t.status
            });
          });
          this.sent = temp2;
        })
        .catch(err => {
          console.log(err.response);
        });

      this.$store
        .dispatch("GET_RECEIVED_TRANSACTIONS")
        .then(transactions => {
          this.loading = false;
          var temp3 = [];
          transactions.forEach(t => {
            temp3.push({
              ...t.product,
              quantity: t.quantity,
              cartId: t._id,
              checkoutDate: t.checkoutDate,
              status: t.status
            });
          });
          this.received = temp3;
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    complete: function(id) {
      this.loading = true;
      var baseUrl = this.$store.state.baseUrl;
      axios
        .request({
          method: "PATCH",
          url: `${baseUrl}/cart/transactions/complete`,
          headers: {
            token: sessionStorage.getItem("jwt")
          },
          data: {
            id: id,
            status: "received"
          }
        })
        .then(response => {
          this.getAllTransactions();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
</style>
