<script setup>
import AuctionItem from "./AuctionItem.vue";

const props = defineProps({
  auctions: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["page-change"]);

const changePage = (newPage) => {
  emit("page-change", newPage);
};
</script>

<template>
  <!--Loading State-->
  <VRow v-if="loading" justify="center">
    <VCol v-for="i in pageSize" :key="i" cols="12" sm="6" md="4" lg="3">
      <VSkeletonLoader type="image@2, heading, text" boilerplate />
    </VCol>
  </VRow>

  <!--Auctions Grid-->
  <div v-else-if="auctions.length">
    <VRow justify="center">
      <VCol
        v-for="auction in auctions"
        :key="auction.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <AuctionItem :auction="auction" />
      </VCol>
    </VRow>

    <!--Pagination-->
    <VPagination
      :model-value="currentPage"
      :length="totalPages"
      @update:model-value="changePage"
      class="mt-4"
      size="small"
      total-visible="1"
      rounded
    />
  </div>

  <!--No Auctions-->
  <div v-else class="d-flex flex-column justify-center align-center h-75">
    <VIcon icon="mdi-robot-dead-outline" size="40" />
    <span class="text-caption mt-1">No Auctions Found</span>
  </div>
</template>
