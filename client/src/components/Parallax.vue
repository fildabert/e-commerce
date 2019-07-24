<template>
    <v-parallax
          dark
          src='/gun-background.jpg'
          style="height: 400px;"
          id="parallax"
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
</template>

<script>
export default {
    name: "Parallax"
}
</script>

<style scoped>
#parallax {
  transition: transform 1s, ease-in-out;
  /* transform-origin: center center; */
}

/* The Transformation */
#parallax:hover {
  transform: scale(1.01);
}
</style>
