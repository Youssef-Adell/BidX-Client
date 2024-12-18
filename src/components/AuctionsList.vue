<script setup>
import AuctionItem from "./AuctionItem.vue";
import { useAuctionsStore } from "@/stores/AuctionsStore";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const { xs } = useDisplay();
const router = useRouter();
const route = useRoute();
const auctionsStore = useAuctionsStore();

const page = ref(1);
const pageSize = 12;

const totalPages = computed(() => {
  return auctionsStore.auctions.metadata?.totalPages;
});

// Watch route query changes and trigger fetch
watch(
  () => route.query.page,
  async () => {
    try {
      const currentPage = Number(route.query.page) || 1;
      page.value = currentPage;
      await auctionsStore.load(currentPage, pageSize, null, true); // Fetch data for the new page
    } catch {
      // Supress the error
    }
  },
  { immediate: true } // Run the watcher immediately on mount
);

// Update query params on page change
const updatePage = (currentPage) => {
  router.push({ query: { ...route.query, page: currentPage } });
};
</script>

<template>
  <section>
    <VDataIterator
      :items="auctionsStore.auctions.data"
      :loading="auctionsStore.loading"
      :page="page"
      :items-per-page="pageSize"
    >
      <!-- Header -->
      <template #header>
        <div class="d-flex align-center ga-2 my-4">
          <VIcon icon="mdi-star-four-points" :size="xs ? 'small' : 'default'" />
          <h2 :class="xs ? 'text-h6' : 'text-h5'">
            <span class="font-weight-light">Recent</span>
            <span class="font-weight-medium"> Auctions</span>
          </h2>
        </div>
      </template>

      <!-- Auction Items -->
      <template #default="{ items }">
        <VRow justify="center">
          <VCol
            v-for="item in items"
            :key="item.raw.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <AuctionItem :auction="item.raw" />
          </VCol>
        </VRow>
      </template>

      <!-- Loading State -->
      <template #loader>
        <VRow justify="center">
          <VCol v-for="i in 12" :key="i" cols="12" sm="6" md="4" lg="3">
            <VSkeletonLoader
              type="image@2, heading, text"
              elevation="2"
              boilerplate
            />
          </VCol>
        </VRow>
      </template>

      <!-- Footer Pagination -->
      <template #footer="{ items }">
        <VPagination
          v-if="items.length > 0"
          v-model="page"
          :length="totalPages"
          @update:model-value="updatePage"
          class="mt-3"
          size="small"
          total-visible="1"
          rounded
        />
      </template>

      <!--No Data-->
      <template #no-data>
        <div class="d-flex flex-column align-center pt-15">
          <VIcon icon="mdi-robot-dead-outline" class="mb-1" size="40" />
          <span class="text-caption">No Auctions Found</span>
        </div>
      </template>
    </VDataIterator>
  </section>
</template>
