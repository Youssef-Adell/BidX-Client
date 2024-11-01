<script setup>
defineProps(["error", "centered"]);
</script>

<template>
  <ul
    v-if="error"
    :class="[
      centered ? 'py-1 list-style-none text-center' : 'py-2 pl-6',
      'bg-error rounded text-caption',
    ]"
  >
    <li v-for="errorMessage in error.errorMessages">
      {{ errorMessage }}
    </li>
  </ul>
</template>

<style scoped>
.list-style-none {
  list-style: none;
}
</style>
