<script setup>
import SearchBar from "@/components/SearchBar.vue";
import AuctionsCatalog from "@/components/AuctionsCatalog.vue";
import { useDisplay } from "vuetify";
import { useRoute, useRouter } from "vue-router";
import { reactive } from "vue";

const { xs } = useDisplay();
const route = useRoute();
const router = useRouter();

const initialFilters = reactive({
  search: route.query.search || null,
});

const applySearch = (searchTerm) => {
  if (searchTerm == null || searchTerm.trim() === "") {
    return;
  }

  initialFilters.search = searchTerm;

  router.push({
    query: {
      ...route.query,
      search: searchTerm,
      page: 1,
    },
  });
};
</script>

<template>
  <VContainer class="h-100">
    <SearchBar
      :intial-search-term="initialFilters.search"
      @apply-search="applySearch"
      class="mb-4"
    />

    <AuctionsCatalog
      v-if="initialFilters.search"
      :initial-filters="initialFilters"
    >
      <template #title>
        <VIcon icon="mdi-magnify" :size="xs ? 'small' : 'default'" />
        <h2 :class="xs ? 'text-h6' : 'text-h5'">
          <span class="font-weight-light">Results for</span> '{{
            initialFilters.search
          }}'
        </h2>
      </template>
    </AuctionsCatalog>
  </VContainer>
</template>
