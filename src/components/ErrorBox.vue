<script setup>
defineProps(["error"]);
</script>

<template>
  <div v-if="error" class="bg-error py-2 pl-3 rounded text-caption">
    <span v-for="errorMessage in error.errorMessages" class="d-block">
      - {{ errorMessage }}
    </span>
  </div>
</template>
