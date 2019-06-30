<template>
    <div>
        <v-parallax v-show="!details"
          dark
          src='/gun-background.jpg'
        >
          <v-layout
            align-center
            column
            justify-center
          >
            <h1 class="display-2 font-weight-thin mb-3">HacktivGun</h1>
            <h4 class="subheading">Your No. 1 trusted weapons dealer</h4>
          </v-layout>
        </v-parallax>
            
                
        <v-container fluid grid-list-xl v-show="!details">
            <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg4 xl3 v-for="(product, index) in $store.state.products" :key="index">
            <v-hover>
                <v-card color=""
                    slot-scope="{ hover }"
                :class="`elevation-${hover ? 7 : 2}`"
                height=200
                >
                
                    <v-layout class="mt-1">
                        <v-flex xs7>
                            <v-img
                                :src="product.image"
                                contain
                                height="100px"
                                class="ml-1 mt-3"
                            ></v-img>
                        </v-flex>
                        
                        <v-flex xs5>
                        <v-card-title primary-title class="ml-3 pb-1">
                            <div>
                            <div class="headline" >{{product.title}}</div>
                            <div class="caption grey--text">{{product.weaponType}}</div>
                            <div class="subheading green--text">${{product.price}}</div>
                            </div>
                        </v-card-title>
                        </v-flex>
                    </v-layout>
                    <v-divider light></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat small @click="triggerDetails" :to="{path: `/products/details?id=${product._id}`}">Details</v-btn>
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
import Vuex from "vuex"
import axios from "axios"

export default {
    name: "ProductsDisplay",
    created () {
        if(this.$route.path !== "/products"){
            this.details = true
        }
        this.$store.dispatch("GET_PRODUCTS")
            .then(products =>{
                this.products = products
            })
            .catch(err =>{
                console.log(err)
            })
    },
    methods : {
        triggerDetails: function () {
            this.details = true
        },
        addToCart: function (id) {
            var baseUrl = this.$store.state.baseUrl
            axios.request({
                method: "POST",
                url: `${baseUrl}/cart/add`,
                data: {
                    userId: this.$store.state._id,
                    product: id,
                    quantity: 1
                },
                headers:{
                    token: sessionStorage.getItem("jwt")
                }
            })
            .then(created =>{
                console.log(created.data)
            })  
            .catch(err =>{
                this.$emit("loginFirst")
            }) 
        }
    },
    data () {
        return {
            items: [
                // { id: 1, title: "AK 47", type:"Assault Rifle", price:2200},
                // { id: 2, title: "AK 48", type:"Assault Rifle", price:2200},
                // { id: 3, title: "AK 49", type:"Assault Rifle", price:2200},
                // { id: 4, title: "AK 41", type:"Assault Rifle", price:2200},
                // { id: 5, title: "AK 42", type:"Assault Rifle", price:2200},
            ],
            details: false,
        }
    },
    watch: {
        $route: function(){
            if(this.$route.path === "/products"){
                this.details = false
            }
        },
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

}
</script>

<style>


</style>
