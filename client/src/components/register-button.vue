<template>
  <v-layout row>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="grey darken-1" dark v-on="on">Register</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Register New User</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Username*" v-model="username" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Email*" v-model="email" required :rules="[rules.email]"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password*" v-model="password" type="password" required :rules="[rules.password]"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <div class="body-2 red--text" v-show="error">*{{error}}</div>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-4" flat @click="dialog = false">Cancel</v-btn>
          <v-btn color="grey darken-4" flat @click="register">Register</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import axios from "axios"

export default {
    props: ["triggerRegister"],
    name: "RegisterButton",
    data (){
        return{
            dialog: false,
            username: "",
            password: "",
            email: "",
            error: "",
            rules: {
              password: v => (v || '').length >= 6 || 'Password must be at least 6 characters long',
              email: v => (v || '').match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ||
              'Invalid email input'
            }
        }
    },
    methods:{
      register: function () {
        var baseUrl = this.$store.state.baseUrl
        axios.request({
          method: "POST",
          url: `${baseUrl}/users/register`,
          data: {
            username: this.username,
            email: this.email,
            password: this.password,
            admin: false
          },
          headers: {
          }
        })
        .then(userInfo =>{
          this.dialog = false
          this.error = ""
          this.username = ""
          this.email = ""
          this.password = ""
          this.$store.commit({
            type: "SET_IS_LOGIN",
            email: userInfo.data.email,
            username: userInfo.data.username,
            isLogin : true,
            admin: userInfo.data.admin
          })
        })
        .catch(err =>{
          console.log(err.response.data)
          this.error = err.response.data
        })
      }
    },
    watch: {
      triggerRegister: function(){
        this.dialog = true
      }
    }
}
</script>
