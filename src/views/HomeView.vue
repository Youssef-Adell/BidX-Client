<script setup>
import AuctionFiltersDialog from "@/components/AuctionFiltersDialog.vue";
import AuctionList from "@/components/AuctionList.vue";
import CreateAuctionButton from "@/components/CreateAuctionButton.vue";
import { useAuctionsStore } from "@/stores/AuctionsStore";
import { computed, onBeforeUnmount, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const { xs } = useDisplay();
const route = useRoute();
const router = useRouter();
const auctionsStore = useAuctionsStore();

const pagination = reactive({
  page: 1,
  pageSize: 12,
});

const filters = reactive({
  activeOnly: true,
  productCondition: null,
  categoryId: null,
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
        ([_, value]) => value !== null && value !== ""
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
  filters.categoryId = Number(query.categoryId) || null;
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

onBeforeUnmount(auctionsStore.unload);
</script>

<template>
  <VContainer class="h-100">
    <section class="h-100">
      <!--Auction List Header-->
      <div class="d-flex align-center ga-2 my-4">
        <!--Title-->
        <VIcon icon="mdi-star-four-points" :size="xs ? 'small' : 'default'" />
        <h2 :class="xs ? 'text-h6' : 'text-h5'">
          <span class="font-weight-light">Recent</span>
          <span class="font-weight-medium"> Auctions</span>
        </h2>
        <!--Filters-->
        <VSpacer />
        <AuctionFiltersDialog
          :initial-filters="filters"
          @apply-filters="changeFilters"
        />
      </div>

      <AuctionList
        :auctions="auctionsStore.auctions.data"
        :loading="auctionsStore.loading"
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :total-pages="totalPages"
        @page-change="changePage"
      />
    </section>

    <CreateAuctionButton />
  </VContainer>
</template>
