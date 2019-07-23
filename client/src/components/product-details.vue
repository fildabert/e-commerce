<template>
    <v-container>
        <!-- <v-alert v-model="alert" dismissible type="error">{{errormsg}}</v-alert> -->
        <v-snackbar
            v-model="alert"
            top
            color="red"
            class="mt-1"
            >
                {{errormsg}}
            </v-snackbar>
        <v-flex xs1>
            <v-btn flat :to="{path: '/products'}"><v-icon>arrow_back</v-icon> Back to Products</v-btn>
        </v-flex>
        <v-flex xs11></v-flex>
            <v-card>
        <v-layout row wrap>
                <v-flex xs12 md7 class="pa-4">
                    <v-img :src="selected.image">

                    </v-img>
                </v-flex>
                <v-flex xs12 md4 offset-md1 class="pa-4">
                    <div class="display-3">{{selected.title}}</div>
                    <div class="title grey--text text--darken-2">{{selected.weaponType}}</div>
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
                <v-flex xs12 class="pa-5">
                    <div class="subheading mt-2">
                        {{selected.description}}
                    </div>
                </v-flex>
        </v-layout>
            </v-card>
    </v-container>
</template>

<script>
import axios from "axios"

export default {
    name: "ProductDetails",
    created () {
        this.$store.dispatch("GET_PRODUCTS")
        .then(() =>{
            var id = this.$route.query.id
            var selected = this.$store.getters.GET_PRODUCT_BY_ID(id)
            this.selected = selected
        })
        .catch(err =>{
            console.log(err)
        })
    },
    data () {
        return {
            selected: "",
            quantity: 0,
            errormsg: "",
            alert: false
        }
    },
    methods: {
        addToCart: function () {
            console.log(this.$route.params)
            var baseUrl = this.$store.state.baseUrl
            axios.request({
                method: "POST",
                url: `${baseUrl}/cart/add`,
                data: {
                    userId: this.$store.state._id,
                    product: this.$route.query.id,
                    quantity: this.quantity
                },
                headers:{
                    token: sessionStorage.getItem("jwt")
                }
            })
            .then(created =>{
                this.$router.push("/cart")
            })  
            .catch(err =>{
                this.$emit("loginFirst")
            }) 
        },
        increment: function () {
            if(this.quantity < this.selected.stock) {
                this.quantity ++
            }
            
        },
        decrement: function () {
            if(this.selected.quantity > 0){
                this.quantity --
            }
        },
    },
    watch: {
        quantity: function () {
            if(this.quantity > this.selected.stock) {
                this.quantity = this.selected.stock
                this.errormsg = `Item is out of stock(${this.selected.stock})`
                this.alert = true
                setTimeout(() => this.alert = "", 3000)
            }
        }
    }
    
}
</script>

<style>

</style>
