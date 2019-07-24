<template>
  <v-layout row justify-end>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="grey darken-1" dark v-on="on">Login</v-btn>
      </template>   
      <v-card>
        <v-card-title>
          <span class="headline">Login</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Email*" v-model="email" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password*" type="password" v-model="password" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <div class="body-2 red--text" v-show="error">*{{error}}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          
            
          <v-btn flat @click="googleLogin"><v-icon class="mr-2">fab fa-google</v-icon> Login With Google</v-btn>
          <v-btn color="grey darken-4" flat @click="dialog = false">Cancel</v-btn>
          <v-btn color="grey darken-4" flat @click="login">Login</v-btn>
          
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import axios from "axios"
// import GoogleLogin from "vue-google-login"

export default {
    props: ["triggerLogin"],
    components:{
      // GoogleLogin
    },
    name: "LoginButton",
    data () {
      return {
        dialog: false,
        email: "",
        password: "",
        error: "",

      }
    },
    methods:{
      googleLogin: function() {
        var baseUrl = this.$store.state.baseUrl
        this.$gAuth.signIn()
        .then(GoogleUser =>{
          var token = GoogleUser.getAuthResponse().id_token
          return axios.request({
            method: "POST",
            url: `${baseUrl}/users/googlelogin`,
            data: {
              code: token
            }
          })
          .then(userInfo =>{
             console.log(userInfo.data)
             sessionStorage.setItem("jwt", userInfo.data.access_token)
             this.$store.commit({
            type: "SET_IS_LOGIN",
            email: userInfo.data.email,
            username: userInfo.data.username,
            isLogin: true,
            profilePicture: userInfo.data.profilePicture,
            admin: userInfo.data.admin,
            _id: userInfo.data._id,
            balance: userInfo.data.balance
          })
          this.dialog = false
          })
          .catch(err =>{
            console.log(err)
          })
        })
      },
      login: function () {
        var baseUrl = this.$store.state.baseUrl
        axios.request({
          method: "POST",
          url: `${baseUrl}/users/login`,
          data:{
            email: this.email,
            password: this.password 
          }
        })
        .then(userInfo =>{
          sessionStorage.setItem("jwt", userInfo.data.access_token)
          this.email = ""
          this.password = ""
          this.$store.commit({
            type: "SET_IS_LOGIN",
            email: userInfo.data.email,
            username: userInfo.data.username,
            isLogin : true,
            admin: userInfo.data.admin,
            _id: userInfo.data._id,
            balance: userInfo.data.balance
          })
          this.dialog = false
        })
        .catch(err =>{
          this.error = err.response.data
        })
      }
    },
    watch: {
      triggerLogin: function () {
        this.dialog = true
      }
    }
}
</script>
