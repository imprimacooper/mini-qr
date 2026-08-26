<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="simple-footer">© {{ currentYear }} ImprimaCooper</footer>
</template>

<style scoped>
.simple-footer {
  padding: 1rem;
  color: #52525b;
  font-size: 0.875rem;
  text-align: center;
}
</style>
