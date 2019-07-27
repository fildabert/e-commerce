<template>
  <div>
    <!-- <v-alert v-model="alert" dismissible type="success">{{msg}}</v-alert> -->
    <v-snackbar v-model="alert" top :color="snackbar" class="mt-1">{{msg}}</v-snackbar>

    <!-- <div class="text-xs-center">
      <v-progress-circular indeterminate color="primary" v-show="loading"></v-progress-circular>
    </div> -->
    <v-container fluid grid-list-xl v-show="!details">
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg4 xl3 v-for="i in 12" :key="i-100" v-show="loading">
          <v-card height="200" class="mt-1 pt-2">
            <ContentLoader>
              <rect x="10" y="20" rx="3" ry="3" width="250" height="300" />
              <rect x="280" y="30" rx="3" ry="3" width="100" height="30" />
              <rect x="280" y="70" rx="3" ry="3" width="100" height="14" />
              <rect x="280" y="90" rx="3" ry="3" width="80" height="20" />
            </ContentLoader>
            <v-divider style="margin-top: 30px;"></v-divider>
            <v-card-actions>
              
              <ContentLoader>
                <rect x="250" y="0" rx="3" ry="3" width="140" height="40" />
                <rect x="140" y="0" rx="3" ry="3" width="100" height="40" />
              </ContentLoader>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex xs12 sm6 md4 lg4 xl3 v-for="(product, index) in $store.state.products" :key="index" v-show="!loading">
          <v-hover>
            <v-card color slot-scope="{ hover }" :class="`elevation-${hover ? 7 : 2}`" height="200">
              <v-layout class="mt-1" style="height: 150px;">
                <v-flex xs7>
                  <v-img :src="product.image" :lazy-src="product.image" id="productImage" class="ml-1 mt-3" contain style="max-height: 120px;">
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

                <v-flex xs5>
                  <v-card-title primary-title class="ml-0 pb-1" style="overflow-wrap: anywhere;">
                    <div>
                      <div class="headline">{{product.title}}</div>
                      <div class="caption grey--text">{{product.weaponType}}</div>
                      
                      <div class="subheading green--text">${{product.price}}</div>
                    </div>
                  </v-card-title>
                </v-flex>
              </v-layout>
              <v-divider light></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  flat
                  small
                  @click="triggerDetails"
                  :to="{path: `/products/details?id=${product._id}`}"
                >Details</v-btn>
                <v-btn flat small @click="addToCart(product._id)">Add To Cart</v-btn>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
    </v-container>

    <router-view></router-view>
  </div>
</template>

<script>
import Vuex from "vuex";
import axios from "axios";
import {ContentLoader} from "vue-content-loader"

export default {
  name: "ProductsDisplay",
  components: {
    ContentLoader
  },
  created() {
      this.loading = true
    if (this.$route.path !== "/products") {
      this.details = true;
    }
    this.$store
      .dispatch("GET_PRODUCTS")
      .then(products => {
        this.loading = false
        this.products = products;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    triggerDetails: function() {
      this.details = true;
    },
    addToCart: function(id) {
      var baseUrl = this.$store.state.baseUrl;
      axios
        .request({
          method: "POST",
          url: `${baseUrl}/cart/add`,
          data: {
            userId: this.$store.state._id,
            product: id,
            quantity: 1
          },
          headers: {
            token: sessionStorage.getItem("jwt")
          }
        })
        .then(created => {
          this.alert = true;
          this.msg = "Product is now added into your cart";
          this.snackbar = "success";
          setTimeout(() => (this.alert = ""), 2000);
        })
        .catch(err => {
          if(err.response.data === "Login First") {
            this.$emit("loginFirst");
          } else {
            this.alert = true
            this.msg = err.response.data
            this.snackbar = "red"
          }
        });
    }
  },
  data() {
    return {
      items: [
        // { id: 1, title: "AK 47", type:"Assault Rifle", price:2200},
        // { id: 2, title: "AK 48", type:"Assault Rifle", price:2200},
        // { id: 3, title: "AK 49", type:"Assault Rifle", price:2200},
        // { id: 4, title: "AK 41", type:"Assault Rifle", price:2200},
        // { id: 5, title: "AK 42", type:"Assault Rifle", price:2200},
      ],
      loading: false,
      details: false,
      alert: false,
      msg: "",
      snackbar: ""
    };
  },
  watch: {
    $route: function() {
      if (this.$route.path === "/products") {
        this.details = false;
      }
    }
    // watchProducts: function () {
    //     this.$store.dispatch("GET_PRODUCTS")
    //     .then(products =>{
    //         console.log(products, "ASDASDASD")
    //         this.products = products.data
    //     })
    //     .catch(err =>{
    //         console.log(err)
    //     })
    // }
  }
};
</script>

<style scoped>
/* #productImage {
    transition: 1s;
    opacity: 0.7; 
    height: 90px;
    
}

#productImage:hover {
    height: 110px;
    opacity: 1;
    -webkit-transition: all 0.5s ease;
    
} */
</style>
