<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap v-show="!edit">
      <v-flex xs12 sm6 md4 lg4 xl3 v-for="(product, index) in $store.state.products" :key="index">
        <v-hover>
          <v-card color slot-scope="{ hover }" :class="`elevation-${hover ? 7 : 2}`" height="200">
            <v-layout class="mt-1" style="height: 150px;">
              <v-flex xs7>
                <v-img
                  :src="product.image"
                  :lazy-src="product.image"
                  contain
                  style="max-height: 120px;"
                  class="ml-1 mt-3"
                >
                  <template v-slot:placeholder>
                    <v-layout fill-height align-center justify-center ma-0>
                      <v-progress-circular indeterminate color="grey lighten-1"></v-progress-circular>
                    </v-layout>
                  </template>
                </v-img>
              </v-flex>

              <v-flex xs5>
                <v-card-title primary-title class="ml-3 pb-1">
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
                color="orange"
                @click="triggerEdit"
                :to="{path: `/admin/modify/edit?id=${product._id}`}"
              >Edit</v-btn>
              <v-btn flat small color="red" @click="del(product._id)">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-flex>

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
    </v-layout>
    <router-view></router-view>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "AddProduct",
  created() {
    if (this.$store.state.admin) {
      if (this.$route.path !== "/admin/modify") {
        this.edit = true;
      }
      this.$store.dispatch("GET_PRODUCTS");
    } else {
      this.dialog = true;
    }
  },
  data() {
    return {
      title: "Image Upload",
      imageName: "",
      imageUrl: "",
      imageFile: "",
      edit: false,
      dialog: false
    };
  },
  methods: {
    triggerEdit: function() {
      this.edit = true;
    },
    del: function(id) {
      var baseUrl = this.$store.state.baseUrl;
      axios
        .request({
          method: "DELETE",
          url: `${baseUrl}/products/delete/${id}`,
          headers: {
            token: sessionStorage.getItem("jwt")
          }
        })
        .then(() => {
          console.log("Product deleted");
          this.$store.dispatch("GET_PRODUCTS");
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    closeDialog: function() {
      this.dialog = false;
      this.$router.push("/products");
    }
  },
  watch: {
    $route: function() {
      if (this.$route.path === "/admin/modify") {
        this.edit = false;
      } else if (this.$route.path !== "/admin/modify") {
        this.edit = true;
      } else {
        this.edit = true;
      }
    }
  }
};
</script>

<style>
</style>
