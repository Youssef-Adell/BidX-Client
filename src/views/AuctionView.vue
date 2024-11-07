<script setup>
import AuctionDetailsCard from "@/components/AuctionDetailsCard.vue";
import BidsCard from "@/components/BidsCard.vue";
import WinningBidCard from "@/components/WinningBidCard.vue";
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

    <template v-else>
      <AuctionDetailsCard :auction="auctionStore.auction" />

      <BidsCard
        v-if="auctionStore.isActive"
        :auction-id="auctionStore.auction.id"
        :current-price="auctionStore.auction.currentPrice"
        :min-bid-increment="auctionStore.auction.minBidIncrement"
        :am-i-auctioneer="auctionStore.amIAuctioneer"
      />

      <WinningBidCard
        v-else
        :auction-id="auctionStore.auction.id"
        :am-i-auctioneer="auctionStore.amIAuctioneer"
        :am-i-winner="auctionStore.amIWinner"
        :auctioneer-id="auctionStore.auction.auctioneer.id"
        :accepted-bid="auctionStore.acceptedBid"
      />
    </template>
  </VContainer>
</template>
