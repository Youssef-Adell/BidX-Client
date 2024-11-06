<script setup>
import AuctionDetailsCard from "@/components/AuctionDetailsCard.vue";
import { useAuctionStore } from "@/stores/AuctionStore";
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const auctionStore = useAuctionStore();

onBeforeMount(async () => {
  await auctionStore.loadAuction(route.params.id);
});
</script>

<template>
  <VContainer class="d-flex justify-center flex-column h-100">
    <VProgressCircular
      v-if="auctionStore.loading"
      class="align-self-center"
      color="primary"
      size="40"
      indeterminate
    />

    <AuctionDetailsCard v-else :auction="auctionStore.auction" />
  </VContainer>
</template>
