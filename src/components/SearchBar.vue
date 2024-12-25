<script setup>
import { ref } from "vue";

const props = defineProps({
  intialSearchTerm: {
    type: String,
    required: false,
  },
});
const emit = defineEmits(["apply-search"]);

const searchTerm = ref(props.intialSearchTerm);

const applySearch = () => {
  emit("apply-search", searchTerm.value);
};
</script>

<template>
  <VTextField
    v-model="searchTerm"
    append-inner-icon="mdi-magnify"
    density="compact"
    placeholder="Search for auctions"
    variant="solo"
    class="border rounded"
    @click:append-inner="applySearch"
    @keyup.enter="applySearch"
    autofocus
    hide-details
    flat
  />
</template>
