<template>
  <router-view />
  <LoadingOverlay />
  <ConfirmOverlay />
  <NotifyOverlay />
</template>


<script setup>
  import LoadingOverlay from '@/components/overlays/LoadingOverlay.vue'
  import ConfirmOverlay from '@/components/overlays/ConfirmOverlay.vue'
  import NotifyOverlay from '@/components/overlays/NotifyOverlay.vue'
</script>


<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
  }
</style>