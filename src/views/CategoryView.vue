<script setup>
import categoriesService from "@/api/services/categoriesService";
import AuctionFiltersDialog from "@/components/AuctionFiltersDialog.vue";
import AuctionsGrid from "@/components/AuctionsGrid.vue";
import { useAuctionsStore } from "@/stores/AuctionsStore";
import { computed, onBeforeMount, onBeforeUnmount, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const { xs } = useDisplay();
const route = useRoute();
const router = useRouter();
const auctionsStore = useAuctionsStore();

const category = reactive({
  id: Number(route.params.id),
  name: null,
  iconUrl: null,
});

const pagination = reactive({
  page: 1,
  pageSize: 12,
});

const filters = reactive({
  activeOnly: true,
  productCondition: null,
  categoryId: category.id,
  cityId: null,
});

const totalPages = computed(() => {
  return auctionsStore.auctions.metadata?.totalPages ?? 1;
});

const changePage = (page) => {
  pagination.page = page;
  updateURL();
};

const changeFilters = (newFilters) => {
  pagination.page = 1; // Reset to first page
  Object.assign(filters, newFilters);
  updateURL();
};

const updateURL = () => {
  const query = {
    ...pagination,
    ...Object.fromEntries(
      Object.entries(filters).filter(
        ([key, value]) => value !== null && value !== "" && key !== "categoryId"
      )
    ),
  };

  router.push({ query });
};

const syncFromURL = () => {
  const query = route.query;

  pagination.page = Number(query.page) || 1;
  pagination.pageSize = Number(query.pageSize) || 12;
  filters.activeOnly = query.activeOnly === "true" || query.activeOnly == null;
  filters.productCondition = query.productCondition || null;
  filters.cityId = Number(query.cityId) || null;
};

watch(
  () => route.query,
  () => {
    syncFromURL();
    auctionsStore.load(pagination.page, pagination.pageSize, filters);
  },
  { immediate: true }
);

onBeforeMount(async () => {
  const { name, iconUrl } = await categoriesService.fetchCategory(category.id);
  category.name = name;
  category.iconUrl = iconUrl;
});

onBeforeUnmount(auctionsStore.unload);
</script>

<template>
  <VContainer>
    <VSkeletonLoader
      :loading="auctionsStore.loading"
      type="subtitle"
      class="bg-background"
      width="250px"
    >
      <div class="d-flex align-center ga-2 mb-3 w-100">
        <RouterLink to="/" class="text-text" replace>
          <VIcon icon="mdi-chevron-left" size="large" />
        </RouterLink>
        <img
          :src="category.iconUrl"
          width="40px"
          height="40px"
          class="bg-surface pa-1 rounded"
        />
        <h2 :class="xs ? 'text-h6' : 'text-h5'">
          {{ category.name }}
        </h2>
        <VSpacer />
        <AuctionFiltersDialog
          :initial-filters="filters"
          @apply-filters="changeFilters"
          disable-category-filter
        />
      </div>
    </VSkeletonLoader>

    <AuctionsGrid
      :auctions="auctionsStore.auctions.data"
      :loading="auctionsStore.loading"
      :current-page="pagination.page"
      :page-size="pagination.pageSize"
      :total-pages="totalPages"
      @page-change="changePage"
    />
  </VContainer>
</template>
