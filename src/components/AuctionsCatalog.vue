<script setup>
import { computed, onBeforeUnmount, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuctionsStore } from "@/stores/AuctionsStore";
import AuctionFiltersDialog from "@/components/AuctionFiltersDialog.vue";
import AuctionsGrid from "@/components/AuctionsGrid.vue";

const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({
      search: null,
      activeOnly: true,
      productCondition: null,
      categoryId: null,
      cityId: null,
    }),
  },
  disableCategoryFilter: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();
const router = useRouter();
const auctionsStore = useAuctionsStore();

const pagination = reactive({
  page: 1,
  pageSize: 12,
});

const filters = reactive({ ...props.initialFilters });

const totalPages = computed(() => {
  return auctionsStore.auctions.metadata?.totalPages ?? 1;
});

const changePage = (page) => {
  pagination.page = page;
  updateURL();
};

const changeFilters = (newFilters) => {
  pagination.page = 1;
  Object.assign(filters, newFilters);
  updateURL();
};

const updateURL = () => {
  const query = {
    ...pagination,
    ...Object.fromEntries(
      Object.entries(filters).filter(
        ([key, value]) =>
          value !== null &&
          value !== "" &&
          (!props.disableCategoryFilter || key !== "categoryId")
      )
    ),
  };

  router.push({ query });
};

const syncFromURL = () => {
  const query = route.query;

  pagination.page = Number(query.page) || 1;
  pagination.pageSize = Number(query.pageSize) || 12;

  filters.search = query.search || null;
  filters.activeOnly = query.activeOnly === "true" || query.activeOnly == null;
  filters.productCondition = query.productCondition || null;
  filters.cityId = Number(query.cityId) || null;

  if (!props.disableCategoryFilter) {
    filters.categoryId = Number(query.categoryId) || null;
  }
};

watch(
  () => route.query,
  () => {
    syncFromURL();
    auctionsStore.load(pagination.page, pagination.pageSize, filters);
  },
  { immediate: true }
);

onBeforeUnmount(auctionsStore.unload);
</script>

<template>
  <section>
    <div class="d-flex align-center ga-2 mb-3">
      <!-- Title slot for customizable header -->
      <slot name="title" />
      <VSpacer />
      <AuctionFiltersDialog
        :initial-filters="filters"
        :disable-category-filter="disableCategoryFilter"
        @apply-filters="changeFilters"
      />
    </div>

    <AuctionsGrid
      :auctions="auctionsStore.auctions.data"
      :loading="auctionsStore.loading"
      :current-page="pagination.page"
      :page-size="pagination.pageSize"
      :total-pages="totalPages"
      @page-change="changePage"
    />
  </section>
</template>
