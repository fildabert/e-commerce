import Vue from 'vue'
import Vuex from "vuex"
import './plugins/vuetify'
import App from './App.vue'
import VueRouter from "vue-router"

import routes from "./routes"
import jwt from "jsonwebtoken"
import axios from "axios"

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueRouter)


const router = new VueRouter({routes})

const store = new Vuex.Store({
  state: {
    cart: [],
    baseUrl: "http://hacktivgun-server.fildabert.com",
    isLogin: "",
    email: "",
    username: "",
    profilePicture: "",
    admin: false,
    products: "",
    _id: ""
  },
  mutations: {
    // ADD_TO_CART (state, newItem) {
    //   var found = state.cart.findIndex(item => item.id == newItem.id)
    //   if(found < 0){
    //     state.cart.push({
    //       ...newItem,
    //       quantity: 1
    //     })
    //   }else{
    //     state.cart[found].quantity ++
    //   }
    // },
    SET_CART (state, payload) {
      state.cart = payload
    },
    SET_IS_LOGIN (state, payload){
      state.isLogin = payload.isLogin
      state.email = payload.email
      state.username = payload.username
      state.profilePicture = payload.profilePicture
      state.admin = payload.admin
      state._id = payload._id
    },
    CHECK_LOGIN (state) {
      var token = sessionStorage.getItem("jwt")
      if(token){
        var decoded = jwt.decode(token)
        state.isLogin = true
        state.email = decoded.email
        state.username = decoded.username
        state.profilePicture = decoded.profilePicture
        state.admin = decoded.admin
        state._id = decoded._id
      }
    },
    SET_ALL_PRODUCTS (state, payload) {
      if(payload.data){
        state.products = payload.data
      }else{
        state.products = payload
      }
    }
  },
  actions: {
    GET_CART (context, payload) {
      return new Promise((resolve, reject) =>{
        axios.request({
          method: "GET",
          url: `${this.state.baseUrl}/cart/all?_id=${payload}`,
          headers:{
          }
        })
        .then(carts =>{
          context.commit("SET_CART", carts.data)
          resolve(carts)
        })
        .catch(err =>{
          reject(err)
        })
      })
    },
    GET_PRODUCTS (context) {
      return new Promise((resolve, reject) =>{
        axios.request({
          method: "GET",
          url: `${this.state.baseUrl}/products/all`,
          headers: {
            token: sessionStorage.getItem("jwt")
          }
        })
        .then(products =>{
          context.commit("SET_ALL_PRODUCTS", products)
          resolve(products)
        })
        .catch(err =>{
          reject(err)
        })
      })
    },
    GET_TRANSACTIONS (context) {
      return new Promise((resolve, reject) =>{
        axios.request({
          method: "GET",
          url: `${this.state.baseUrl}/cart/transactions?userId=${this.state._id}`,
          headers: {
            token: sessionStorage.getItem("jwt")
          }
        })
        .then(transactions =>{
          resolve(transactions.data)
        })
        .catch(err =>{
          reject(err)
        })
      })
    }

  },
  getters : {
    GET_PRODUCT_BY_ID: (state) => (id) => {
      return state.products.find(product => product._id == id)
    }
  }
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')

