<template>
    <v-card>
        <v-layout>
            <v-flex xs3>
                <v-img
                    :src='item.image'
                    height="100"
                    contain    
                    class="ml-3"
                ></v-img>

            </v-flex>
            <v-flex xs4 class="mt-2 ml-4">
                <div class="headline">{{item.title}}</div>
                <div class="subheading green--text">${{item.price}}</div>
            </v-flex>

          
            <v-flex xs1 offset-xs1>
                
                <v-icon @click="del()" class="mt-4">delete</v-icon>
              
            </v-flex>

            
                <v-btn fab small @click="decrement" class="mt-3">
                <v-icon>remove</v-icon>
                </v-btn>
            <v-flex xs1 >
                <v-text-field class="quantity mt-2" id="quantityinput" v-model="item.quantity" type="number"></v-text-field>
            </v-flex>
                <v-btn fab small @click="increment" color="green mt-3">
                <v-icon>add</v-icon>
                </v-btn>

            <v-flex xs1 offset-xs1>
                <div class="subheading green--text mt-3">${{item.price * item.quantity}}</div>
            </v-flex>

        </v-layout>
        <v-divider></v-divider>

        </v-card>
</template>

<script>
import axios from "axios"

export default {
    name: "CartItems",
    props:["item"],
    methods:{
        increment: function () {
            if(this.item.quantity < this.item.stock){
                this.item.quantity ++
            }
            
        },
        decrement: function () {
            if(this.item.quantity > 0){
                this.item.quantity --
            }
        },
        del: function () {
            var baseUrl = this.$store.state.baseUrl
            axios.request({
                method: "DELETE",
                url: `${baseUrl}/cart/delete?id=${this.item.cartId}`,
                headers:{
                    token: sessionStorage.getItem("jwt")
                }
            })
            .then(() =>{
                this.$emit("deleteItem", this.item.cartId)
            })
            .catch(err =>{
                console.log(err)
            })
        },
    },
    watch: {
        item: {
            handler: function () {
                if(this.item.quantity > this.item.stock){
                    this.item.quantity = this.item.stock
                }
                var baseUrl = this.$store.state.baseUrl
                axios.request({
                    method: "PUT",
                    url: `${baseUrl}/cart/updatequantity`,
                    data: {
                        _id: this.item.cartId,
                        quantity: this.item.quantity
                    },
                    headers:{
                      token: sessionStorage.getItem("jwt")
                    }
                })
                .then(updated =>{
                    // console.log(updated)
                })
                .catch(err =>{
                    console.log(err)
                })
            },
            deep: true
        } 
    }
}
</script>

<style>
.quantity input{
    
text-align: center;
}
.quantity input[type='number'] {
    -moz-appearance:textfield;
}
</style>
