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
          
            
            
          
          <GoogleLogin :params="params" :renderParams="renderParams" :onSuccess="onSuccess" :onFailure="onFailure">Sign in with Google</GoogleLogin>
          <v-btn color="grey darken-4" flat @click="dialog = false">Cancel</v-btn>
          <v-btn color="grey darken-4" flat @click="login">Login</v-btn>
          
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import axios from "axios"
import GoogleLogin from "vue-google-login"

export default {
    props: ["triggerLogin"],
    components:{
      GoogleLogin
    },
    name: "LoginButton",
    data () {
      return {
        dialog: false,
        email: "",
        password: "",
        error: "",
        params: {
          client_id: "58857443225-5c2ubp38j7cpjhhukju5qebolnqg2nm5.apps.googleusercontent.com"
        },
        renderParams: {
          width: 150,
          height: 50,
          longtitle: false,
        },
      }
    },
    methods:{
      onSuccess: function (googleUser) {
        var baseUrl = this.$store.state.baseUrl
        var user =googleUser.getBasicProfile()
        axios.request({
          method: "POST",
          url: `${baseUrl}/users/googlelogin`,
          data: {
            email: user.U3,
            username: user.ig,
            password: user.Eea,
            profilePicture: user.Paa
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
            profilePicture: user.Paa,
            admin: userInfo.data.admin,
            _id: userInfo.data._id
          })
          this.dialog = false
        })
        .catch(err =>{
          this.error= err.response.data
        })

      },
      onFailure: function () {
        console.log("ERROR")
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
            _id: userInfo.data._id
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
