<template>
  <v-container>
    <v-snackbar v-model="alert" top :color="snackbar" class="mt-1">{{errormsg}}</v-snackbar>
    <div class="text-xs-center">
      <v-progress-circular indeterminate color="primary" v-show="loading"></v-progress-circular>
    </div>
    <v-layout v-show="items.length === 0">
      <v-flex xs6 offset-xs3 style="margin-top:15%;">
        <div class="headline font-weight-light">You have no items in your cart. Start shopping first!</div>
      </v-flex>
    </v-layout>

    <v-card v-show="items.length > 0">
      <v-card-title>
        <v-layout v-show="items.length > 0" row class="hidden-sm-and-down">
          <v-flex xs3>
            <div class="title">Shopping Cart</div>
          </v-flex>

          <v-flex xs4>
            <div class="title">Item Name</div>
          </v-flex>

          <v-flex xs1 offset-xs2>
            <div class="title ml-5">Quantity</div>
          </v-flex>

          <v-flex xs2 offset-xs1>
            <div class="title ml-5">Total Price</div>
          </v-flex>
        </v-layout>
      </v-card-title>
    </v-card>

    <CartItems :item="item" v-for="item in items" :key="item._id" @deleteItem="splice"></CartItems>

    <v-btn
      v-show="items.length > 0"
      color="green"
      class="right mt-3 white--text"
      @click="checkout"
    >Checkout</v-btn>
  </v-container>
</template>

<script>
import CartItems from "./cart-items";
import axios from "axios";

export default {
  name: "ShoppingCart",
  components: {
    CartItems
  },
  created() {
    if (!this.$store.state.isLogin) {
      this.$emit("loginFirst");
      this.$router.push("/products");
    } else {
      this.loading = true;
      this.$store
        .dispatch("GET_CART", this.$store.state._id)
        .then(carts => {
          this.loading = false;
          var cartz = carts.data;
          cartz.forEach(item =>
            this.items.push({
              ...item.product,
              quantity: item.quantity,
              cartId: item._id
            })
          );
        })
        .catch(err => {
          console.log(err.reponse);
        });
    }
  },
  data() {
    return {
      items: [],
      loading: false,
      totalPrice: [],
      alert: false,
      errormsg: "",
      snackbar: ""
    };
  },
  methods: {
    splice: function(id) {
      var index = this.items.findIndex(i => i.cartId == id);
      this.items.splice(index, 1);
    },
    checkout: function() {
      var baseUrl = this.$store.state.baseUrl;
      var promises = [];
      this.loading = true;
      this.$store
        .dispatch("GET_CART")
        .then(carts => {
          this.items.forEach(item => {
            promises.push(
              axios.request({
                method: "PUT",
                url: `${baseUrl}/products/decrement/${item._id}`,
                headers: {
                  token: sessionStorage.getItem("jwt")
                },
                data: {
                  quantity: item.quantity
                }
              })
            );
          });
          return Promise.all(promises);
          })
        .then(() => {
          return axios.request({
            method: "PUT",
            url: `${baseUrl}/cart/updatestatus`,
            headers: {
              token: sessionStorage.getItem("jwt")
            }
          });
          
        })
        .then(() =>{
            this.loading = false
            this.alert = true
            this.snackbar = "success"
            this.errormsg = "Transaction Success! Your items will be delivered once our staffs have approved your orders"
            setTimeout(() =>{
              this.alert = false
              this.errormsg = ""
              this.$store.dispatch("GET_BALANCE")
              this.$router.push("/history")
            }, 6000)
        })
        .catch(err => {
          this.loading = false;
          this.alert = true;
          this.snackbar = "red"
          this.errormsg = err.response.data;
          setTimeout(() => {
            this.alert = false;
            this.errormsg = "";
          }, 2000);
        });

      // this.items.forEach(item =>{
      //     promises.push(
      //         axios.request({
      //             method: "PUT",
      //             url: `${baseUrl}/products/decrement/${item._id}`,
      //             headers: {
      //                 token: sessionStorage.getItem("jwt")
      //             },
      //             data: {
      //                 quantity: item.quantity
      //             }
      //         })
      //     )
      // })
      // Promise.all(promises)
      // .then(() =>{
      //     this.$store.dispatch("GET_CART", this.$store.state._id)
      //         .then(cartz =>{
      //             axios.request({
      //                 method: "PUT",
      //                 url: `${baseUrl}/cart/updatestatus`,
      //                 data: {
      //                     userId: this.$store.state._id,
      //                     checkoutDate: new Date()
      //                 },
      //                 headers: {
      //                     token: sessionStorage.getItem("jwt")
      //                 }
      //             })
      //             .then(data =>{
      //                 this.$router.push("/history")
      //             })
      //         })
      // })
      // .catch(err =>{
      //     console.log(err.response)
      // })
    }
  }
};
</script>

<style>
</style>
