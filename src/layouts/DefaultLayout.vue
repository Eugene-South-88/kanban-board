<template>
  <div :class="$style.container">
    <SidebarPanel />

    <router-view />
  </div>
</template>

<script setup>
  import SidebarPanel from '../components/sidebar/SidebarPanel.vue';
</script>

<style module lang="scss">
  .container {
    max-width: 1250px;
    margin: 0 auto;
    display: flex;
    height: 100vh;
    background: #fff;
  }
</style>
