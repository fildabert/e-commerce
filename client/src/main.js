import Vue from 'vue'
import Vuex from "vuex"
import './plugins/vuetify'
import App from './App.vue'
import VueRouter from "vue-router"
import GAuth from "vue-google-oauth2"
const gauthOption = {
  clientId: '58857443225-5c2ubp38j7cpjhhukju5qebolnqg2nm5.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}

import routes from "./routes"
import jwt from "jsonwebtoken"
import axios from "axios"

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(GAuth, gauthOption)


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
    _id: "",
    balance: 0
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
    SET_BALANCE (state, payload) {
      state.balance = payload
    },
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
      state.balance = payload.balance
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
        state._id = decoded._id,
        state.balance = decoded.balance
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
    GET_BALANCE (context) {
      axios.request({
        method: "GET",
        url: `${this.state.baseUrl}/users/getBalance`,
        headers: {
          token: sessionStorage.getItem("jwt")
        }
      })
      .then(response =>{
        context.commit("SET_BALANCE", response.data)
      })
      .catch(err =>{
        console.log(err.response)
      })
    },
    GET_CART (context, payload) {
      return new Promise((resolve, reject) =>{
        axios.request({
          method: "GET",
          url: `${this.state.baseUrl}/cart/all`,
          headers:{
            token: sessionStorage.getItem("jwt")
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
    GET_PENDING_TRANSACTIONS (context) {
      return new Promise((resolve, reject) =>{
        axios.request({
          method: "GET",
          url: `${this.state.baseUrl}/cart/transactions/pending`,
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
    },
    GET_SENT_TRANSACTIONS (context) {
      return new Promise((resolve, reject) =>{
        axios.request({
          method: "GET",
          url: `${this.state.baseUrl}/cart/transactions/sent`,
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
    },
    GET_RECEIVED_TRANSACTIONS (context) {
      return new Promise((resolve, reject) =>{
        axios.request({
          method: "GET",
          url: `${this.state.baseUrl}/cart/transactions/received`,
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
    },
    GET_TRANSACTIONS_ADMIN (context) {
      return new Promise((resolve, reject) =>{
        axios.request({
          method: "GET",
          url: `${this.state.baseUrl}/cart/transactions/admin`,
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
    },
    APPROVE_TRANSACTION (context, payload) {
      return new Promise((resolve, reject) => {
        axios.request({
          method: "PATCH",
          url: `${this.state.baseUrl}/cart/transactions/admin`,
          headers: {
            token: sessionStorage.getItem("jwt")
          },
          data: {
            status: payload.status,
            id: payload.id
          }
        })
        .then(response =>{
          resolve(response.data)
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

