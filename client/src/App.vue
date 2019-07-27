<template>
  <v-app id="keep">
    <NavigationDrawer :loginFirst="triggerLogin"></NavigationDrawer> 

    <v-content class="grey lighten-4">
      <Parallax v-show="$route.path === '/' || $route.path === '/products'"></Parallax>
      <v-container fluid>      

        <router-view :drawer="drawer" @loginFirst="triggerLoginModal"></router-view>
      <div style="height: 200px;"></div>
        
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Vue from "vue"
import NavigationDrawer from "./components/NavigationDrawer"
import Parallax from "./components/Parallax"


  export default {
    components:{
      NavigationDrawer,
      Parallax
    },
    created () {
      this.$store.dispatch("GET_BALANCE")
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
     
      triggerLogin: 0,
      triggerRegister: 0,
      search: "",
      products: ""
    }),
    props: {
      source: String
    },
    methods: {
      triggerLoginModal: function () {
        this.triggerLogin ++
      },
      triggerRegisterModal: function () {
        this.triggerRegister ++
      },
    
    },
    
  }
</script>

<style lang="stylus">
  #keep
    .v-navigation-drawer__border
      display: none
</style>
