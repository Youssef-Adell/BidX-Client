<script setup>
import AuctionList from "@/components/AuctionList.vue";
import CreateAuctionButton from "@/components/CreateAuctionButton.vue";
import { useAuctionsStore } from "@/stores/AuctionsStore";
import { computed, reactive, watch } from "vue";
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

const totalPages = computed(() => {
  return auctionsStore.auctions.metadata?.totalPages ?? 1;
});

const changePage = (page) => {
  pagination.page = page;
  updateURL();
};

const updateURL = () => {
  const query = {
    ...pagination,
  };

  router.push({ query });
};

const syncFromURL = () => {
  const query = route.query;

  pagination.page = Number(query.page) || 1;
  pagination.pageSize = Number(query.pageSize) || 12;
};

watch(
  () => route.query,
  () => {
    syncFromURL();
    auctionsStore.load(pagination.page, pagination.pageSize);
  },
  { immediate: true }
);
</script>

<template>
  <VContainer class="h-100">
    <!--Auction List Title-->
    <div class="d-flex align-center ga-2 my-4">
      <VIcon icon="mdi-star-four-points" :size="xs ? 'small' : 'default'" />
      <h2 :class="xs ? 'text-h6' : 'text-h5'">
        <span class="font-weight-light">Recent</span>
        <span class="font-weight-medium"> Auctions</span>
      </h2>
    </div>

    <AuctionList
      :auctions="auctionsStore.auctions.data"
      :loading="auctionsStore.loading"
      :current-page="pagination.page"
      :page-size="pagination.pageSize"
      :total-pages="totalPages"
      @page-change="changePage"
    />

    <CreateAuctionButton />
  </VContainer>
</template>
