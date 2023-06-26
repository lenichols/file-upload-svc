<template>
  <FormatFile msg="Parse File & Save"/>
</template>

<script>
import FormatFile from './components/FormatFile.vue'

export default {
  name: 'App',
  components: {
    FormatFile
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
