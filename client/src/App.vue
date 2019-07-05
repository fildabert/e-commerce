<template>
  <v-app id="keep">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      class="grey lighten-3"
      app
    >

    <v-layout column align-center>
      <v-flex class="mt-3">
        <v-avatar size="100">
          <img v-show="$store.state.profilePicture !== ''" :src="$store.state.profilePicture">
          <img v-show="$store.state.isLogin && !$store.state.profilePicture" src="/avatar.jpeg">
          <img v-show="!$store.state.isLogin" src="/avatar.png">
        </v-avatar>
      </v-flex>
      <v-badge color="blue-grey lighten-1" inline v-show="$store.state.admin">
        <template v-slot:badge>
        <v-icon small color="white">done</v-icon>
        </template>
          <p class="mt-1 subheading">{{$store.state.username}} </p>
        </v-badge>
      
         <p class="mt-1 subheading" v-show="!$store.state.admin">{{$store.state.username}} </p>
        
    </v-layout>
    <v-divider></v-divider>

      <v-list
        dense
        class="grey lighten-3"
      >

      <v-list-tile
            class="hidden-md-and-up"
         @click="triggerLoginModal"
          >
        <v-list-tile-content>
          <v-list-tile-title class="grey--text text--darken-3">
            Login
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile
            class="hidden-md-and-up"
         @click="triggerRegisterModal"
          >
        <v-list-tile-content>
          <v-list-tile-title class="grey--text text--darken-3">
            Register
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      

        <template v-for="(item, i) in items">
          <v-layout
            v-if="item.heading"
            :key="i"
            row
            align-center
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading" class="black--text">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
          </v-layout>
          <v-divider
            v-else-if="item.divider"
            :key="i"
            dark
            class="my-3"
          ></v-divider>


          
          <v-list-tile
            v-else
            :key="i"
            :to="{path: item.link}"
          >
          

            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text text--darken-3">
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>


      


      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="grey darken-3" app fixed clipped-left>
      <v-toolbar-side-icon @click="drawer = !drawer" class="white--text"></v-toolbar-side-icon>
      <v-toolbar-items>
        <v-btn class="title ml-3 mr-5 white--text" @click="home" flat>HacktivGun</v-btn>
      </v-toolbar-items>
      <!-- <div @click="" class="title ml-3 mr-5 white--text">HacktivGun&nbsp;<span class="font-weight-light"></span></div> -->
      <v-text-field
        style="width: 50%;"
        solo-inverted
        flat
        hide-details
        label="Search"
        prepend-inner-icon="search"
        dark
        v-model="search"
      ></v-text-field>
      <v-spacer></v-spacer>
      
      <LoginButton style="margin-left: 20%" class="hidden-sm-and-down" v-show="!$store.state.isLogin" :triggerLogin="triggerLogin"></LoginButton>
      <RegisterButton class="hidden-sm-and-down" v-show="!$store.state.isLogin" :triggerRegister="triggerRegister"></RegisterButton>
      <v-btn class="grey darken-1 white--text" v-show="$store.state.isLogin" @click="logout">Logout</v-btn>
    </v-toolbar>


    <v-content class="grey lighten-4">
      <v-container fluid>      
        

        <router-view :drawer="drawer" @loginFirst="triggerLoginModal"></router-view>
      <div style="height: 200px;"></div>


        
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import LoginButton from "./components/login-button"
import RegisterButton from "./components/register-button"
import Vue from "vue"
import GoogleAuth from "vue-google-auth"

Vue.use(GoogleAuth, { clientID: '58857443225-5c2ubp38j7cpjhhukju5qebolnqg2nm5.apps.googleusercontent.com' })
Vue.googleAuth().load()

  export default {
    components:{
      LoginButton,
      RegisterButton
    },
    created () {
      this.$store.commit("CHECK_LOGIN")
      this.$store.dispatch("GET_PRODUCTS")
            .then(products =>{
                this.products = products.data
                if(this.$route.path === "/"){
                  this.$router.push("/products")
                }
            })
            .catch(err =>{
                console.log(err)
            })

    },
    data: () => ({
      drawer: null,
      items: [
        { heading: "Welcome" },
        { icon: 'shopping_basket', text: 'Products', link: "/products"},
        { icon: 'shopping_cart', text: 'Shopping Cart', link: "/cart" },
        { icon: "history", text: "Transaction History", link: "/history" },
        { divider: true },
        { heading: 'Admin Mode' },
        { icon: 'add', text: 'Add New Product', link: "/products/add" },
        { icon: 'edit', text: "Modify Products", link: "/admin/modify" },
      ],
      triggerLogin: 0,
      triggerRegister: 0,
      search: "",
      products: ""
    }),
    props: {
      source: String
    },
    methods: {
      home : function () {
        this.$router.push("/products")
      },
      triggerLoginModal: function () {
        this.triggerLogin ++
      },
      triggerRegisterModal: function () {
        this.triggerRegister ++
      },
      logout: function () {
        sessionStorage.setItem("jwt", "")
        this.$store.commit({
          type: "SET_IS_LOGIN",
          isLogin: false,
          email: "",
          username: "",
          admin: false
        })

        Vue.googleAuth().signOut(function () {
          
        })
      }
    },
    watch: {
      search: function () {
        var regexp = new RegExp(this.search, "i")
        var searchResults = this.products.filter((product) => product.title.match(regexp))
        this.$store.commit("SET_ALL_PRODUCTS", searchResults)
      }
    }
  }
</script>

<style lang="stylus">
  #keep
    .v-navigation-drawer__border
      display: none
</style>
