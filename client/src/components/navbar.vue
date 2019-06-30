<template>
  <v-app id="keep">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      class="grey lighten-3"
      app
    >
      <v-list
        dense
        class="grey lighten-3"
      >
        <template v-for="(item, i) in items">
          <v-layout
            v-if="item.heading"
            :key="i"
            row
            align-center
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
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
            @click=""
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text">
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="grey darken-3" app fixed clipped-left>
      <v-toolbar-side-icon @click="drawer = !drawer" class="white--text"></v-toolbar-side-icon>
      <span class="title ml-3 mr-5 white--text">E-Commerce&nbsp;<span class="font-weight-light"></span></span>
      <v-text-field
        solo-inverted
        flat
        hide-details
        label="Search"
        prepend-inner-icon="search"
        background-color="grey lighten-4"
      ></v-text-field>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height class="grey lighten-4">
        
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: null,
      items: [
        { heading: "Welcome" },
        { icon: 'shopping_basket', text: 'Products' },
        { icon: 'shopping_cart', text: 'Shopping Cart' },
        { icon: "history", text: "Transaction History"},
        { divider: true },
        { heading: 'Admin Mode' },
        { icon: 'add', text: 'Add New Product' },
        { icon: 'edit', text: "Modify Products"},
      ]
    }),
    props: {
      source: String
    }
  }
</script>

<style lang="stylus">
  #keep
    .v-navigation-drawer__border
      display: none
</style>