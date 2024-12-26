<script setup>
import AuctionFiltersDialog from "@/components/AuctionFiltersDialog.vue";
import AuctionsGrid from "@/components/AuctionsGrid.vue";
import useAuctionsManager from "@/composables/useAuctionsManager";

const props = defineProps({
  disableCategoryFilter: {
    type: Boolean,
    default: false,
  },
});

const {
  auctions,
  loading,
  page,
  pageSize,
  totalPages,
  filters,
  changePage,
  changeFilters,
} = useAuctionsManager();
</script>

<template>
  <section>
    <div class="d-flex align-center ga-2 mb-3">
      <!-- Title slot for customizable header -->
      <slot name="title" />
      <VSpacer />
      <AuctionFiltersDialog
        :filters="filters"
        :disable-category-filter="disableCategoryFilter"
        @apply-filters="changeFilters"
      />
    </div>

    <AuctionsGrid
      :auctions="auctions"
      :loading="loading"
      :current-page="page"
      :page-size="pageSize"
      :total-pages="totalPages"
      @page-change="changePage"
    />
  </section>
</template>
