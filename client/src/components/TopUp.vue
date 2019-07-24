<template>
    <div>
        <v-btn
      flat
      @click.stop="dialog = true"
    >
      Top Up
    </v-btn>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Top Up</v-card-title>

        <v-card-text>
          <v-text-field label="Amount" prepend-icon="fas fa-dollar-sign">

          </v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn flat color="green" @click="dialog = !dialog">
              Top Up
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return{
            dialog: false
        }
    }
}
</script>

<style>

</style>
