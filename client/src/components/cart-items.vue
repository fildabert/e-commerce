<template>
  <v-card>
    <v-snackbar v-model="alert" top :color="snackbar" class="mt-1">{{errormsg}}</v-snackbar>
    <v-layout row :wrap="mobile">
      <v-flex xs12 md6 style="max-width: 20%;">
        <v-img :src="item.image" :lazy-src="item.image" height="100" contain class="ml-3">
          <template v-slot:placeholder>
            <v-layout fill-height align-center justify-center ma-0>
              <v-progress-circular indeterminate color="grey lighten-1"></v-progress-circular>
            </v-layout>
          </template>
        </v-img>
      </v-flex>
      <v-flex xs8 md5 class="mt-2 ml-4" style="min-width: 8%;">
        <div class="headline hidden-sm-and-down">{{item.title}}</div>
        <div class="subheading green--text hidden-sm-and-down">${{item.price}}</div>

        <div class="title hidden-md-and-up">Item: {{item.title}}</div>
        <div class="subheading hidden-md-and-up">
          Price:
          <span class="green--text">${{item.price}}</span>
        </div>
        <div class="subheading hidden-md-and-up">
          Quantity:
          <v-text-field
            v-model="item.quantity"
            type="number"
            class="hidden-md-and-up"
            style="width: 40px;"
          ></v-text-field>
        </div>
        <div class="subheading hidden-md-and-up">
          Total Price:
          <span class="green--text">${{item.price * item.quantity}}</span>
        </div>
      </v-flex>

      <v-flex xs1 offset-xs1 md1 offset-md3>
        <v-icon @click="del()" class="mt-4 hidden-sm-and-down">delete</v-icon>
      </v-flex>

      <v-btn fab small @click="decrement" class="mt-3 hidden-sm-and-down">
        <v-icon>remove</v-icon>
      </v-btn>
      <v-flex xs2 md1>
        <v-text-field
          class="quantity mt-2 hidden-sm-and-down"
          id="quantityinput"
          v-model="item.quantity"
          type="number"
        ></v-text-field>
      </v-flex>
      <v-btn fab small @click="increment" color="green mt-3 hidden-sm-and-down">
        <v-icon>add</v-icon>
      </v-btn>

      <v-flex xs1 offset-xs1 md2>
        <div class="subheading green--text mt-3 hidden-sm-and-down">${{item.price * item.quantity}}</div>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "CartItems",
  props: ["item"],
  created() {
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      mobile: false,
      alert: false,
      errormsg: "",
      snackbar: ""
    };
  },
  methods: {
    increment: function() {
      if (this.item.quantity < this.item.stock) {
        this.item.quantity++;
      } else {
        this.alert = true
        this.errormsg = "Item is out of stock"
        this.snackbar= "red"
        setTimeout(() =>{
          this.errormsg = ""
          this.alert = false
        }, 3000)
      }
    },
    decrement: function() {
      if (this.item.quantity > 0) {
        this.item.quantity--;
      }
    },
    del: function() {
      var baseUrl = this.$store.state.baseUrl;
      axios
        .request({
          method: "DELETE",
          url: `${baseUrl}/cart/delete?id=${this.item.cartId}`,
          headers: {
            token: sessionStorage.getItem("jwt")
          }
        })
        .then(() => {
          this.$emit("deleteItem", this.item.cartId);
        })
        .catch(err => {
          console.log(err);
        });
    },
    onResize() {
      if (window.innerWidth < 800) {
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    }
  },
  watch: {
    item: {
      handler: function() {
        if (this.item.quantity > this.item.stock) {
          this.item.quantity = this.item.stock;
        }
        var baseUrl = this.$store.state.baseUrl;
        axios
          .request({
            method: "PUT",
            url: `${baseUrl}/cart/updatequantity`,
            data: {
              _id: this.item.cartId,
              quantity: this.item.quantity
            },
            headers: {
              token: sessionStorage.getItem("jwt")
            }
          })
          .then(updated => {
            this.$emit("addTotal", this.item.price * this.item.quantity);
            // console.log(updated)
          })
          .catch(err => {
            console.log(err);
          });
      },
      deep: true
    }
  }
};
</script>

<style>
.quantity input {
  text-align: center;
}
.quantity input[type="number"] {
  -moz-appearance: textfield;
}
</style>
