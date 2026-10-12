<script setup>
</script>

<template>
  <router-view></router-view>
</template>

<style>
body {
  background-color: #050b16;
  color: #e4edff;
}

::-webkit-scrollbar {
  width: 4px;
  height: 6px;
}

::-webkit-scrollbar-corner {
  display: block;
}

::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: rgba(120, 165, 230, .35);
}

::-webkit-scrollbar-thumb,
::-webkit-scrollbar-track {
  border-right-color: transparent;
  border-left-color: transparent;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(120, 165, 230, .35);
}
</style>