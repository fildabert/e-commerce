<template>
  <v-container>
    <!-- <v-alert v-model="alert" dismissible type="error">{{errormsg}}</v-alert> -->
    <!-- <div class="text-xs-center">
      <v-progress-circular indeterminate color="primary" v-show="loading"></v-progress-circular>
    </div> -->
    <v-snackbar v-model="alert" top color="red" class="mt-1">{{errormsg}}</v-snackbar>
    <v-flex xs1>
      <v-btn flat :to="{path: '/products'}">
        <v-icon>arrow_back</v-icon>Back to Products
      </v-btn>
    </v-flex>
    <v-flex xs11></v-flex>
    <v-card>
      <v-layout row wrap>
        <template>
          <div v-show="loading">
        <ContentLoader>
          <rect x="10" y="20" rx="3" ry="3" width="240" height="200" />
          <rect x="270" y="30" rx="3" ry="3" width="55" height="20" />
          <rect x="270" y="54" rx="3" ry="3" width="40" height="10" />
          <rect x="270" y="66" rx="3" ry="3" width="35" height="15" />
          <rect x="270" y="83" rx="3" ry="3" width="30" height="8" />
          <rect x="270" y="93" rx="3" ry="3" width="80" height="15" />
          <rect x="270" y="110" rx="3" ry="3" width="40" height="18" />
        </ContentLoader>
        <ContentLoader>
          <rect x="10" y="20" rx="3" ry="3" width="370" height="10" />
          <rect x="10" y="32" rx="3" ry="3" width="360" height="10" />
          <rect x="10" y="44" rx="3" ry="3" width="300" height="10" />
          <rect x="10" y="56" rx="3" ry="3" width="340" height="10" />
          <rect x="10" y="68" rx="3" ry="3" width="325" height="10" />
          <rect x="10" y="80" rx="3" ry="3" width="350" height="10" />
          <rect x="10" y="92" rx="3" ry="3" width="370" height="10" />
        </ContentLoader>
          </div>
        </template>
        
        <v-flex xs12 md7 class="pa-4" v-show="!loading">
          <v-img :src="selected.image" :lazy-src="selected.image">
            <template v-slot:placeholder>
              <v-layout fill-height align-center justify-center ma-0>
                <v-progress-circular indeterminate color="grey lighten-1"></v-progress-circular>
              </v-layout>
            </template>
          </v-img>
        </v-flex>
        <v-flex xs12 md4 offset-md1 class="pa-4" v-show="!loading">
          <div class="display-3 font-weight-light">{{selected.title}}</div>
          
          <v-chip color="grey" style="height: 30px;" text-color="white">{{selected.weaponType}}</v-chip>
          <div class="display-1 green--text mt-1">${{selected.price}}</div>
          <div class="body-2 grey--text text--lighten mt-1">{{selected.stock}} in stock</div>
          <v-layout row>
            <v-btn fab small @click="decrement" class="mt-3">
              <v-icon>remove</v-icon>
            </v-btn>
            <v-flex xs3>
              <v-text-field class="quantity mt-2" type="number" v-model="quantity"></v-text-field>
            </v-flex>

            <v-btn fab small @click="increment" color="green mt-3">
              <v-icon>add</v-icon>
            </v-btn>
          </v-layout>
          <v-btn color="green" class="white--text" @click="addToCart">Add to cart</v-btn>
        </v-flex>
        <v-flex xs12 class="pa-5" v-show="!loading">
          <div class="subheading mt-2">{{selected.description}}</div>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import {ContentLoader} from 'vue-content-loader'


export default {
  name: "ProductDetails",
  components: {
    ContentLoader
  },
  created() {
    this.loading = true;
    this.$store
      .dispatch("GET_PRODUCTS")
      .then(() => {
        var id = this.$route.query.id;
        var selected = this.$store.getters.GET_PRODUCT_BY_ID(id);
        this.selected = selected;
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
      });
  },
  data() {
    return {
      selected: "",
      quantity: 0,
      errormsg: "",
      alert: false,
      loading: false
    };
  },
  methods: {
    addToCart: function() {
      console.log(this.$route.params);
      var baseUrl = this.$store.state.baseUrl;
      axios
        .request({
          method: "POST",
          url: `${baseUrl}/cart/add`,
          data: {
            userId: this.$store.state._id,
            product: this.$route.query.id,
            quantity: this.quantity
          },
          headers: {
            token: sessionStorage.getItem("jwt")
          }
        })
        .then(created => {
          this.$router.push("/cart");
        })
        .catch(err => {
          if(err.response.data === "Login First") {
            this.$emit("loginFirst");
          } else {
            this.alert = true
            this.errormsg = err.response.data
            this.snackbar = "red"
          }
        });
    },
    increment: function() {
      if (this.quantity < this.selected.stock) {
        this.quantity++;
      }
    },
    decrement: function() {
      if (this.selected.quantity > 0) {
        this.quantity--;
      }
    }
  },
  watch: {
    quantity: function() {
      if (this.quantity > this.selected.stock) {
        this.quantity = this.selected.stock;
        this.errormsg = `Item is out of stock(${this.selected.stock})`;
        this.alert = true;
        setTimeout(() => (this.alert = ""), 3000);
      }
    }
  }
};
</script>

<style>
</style>
