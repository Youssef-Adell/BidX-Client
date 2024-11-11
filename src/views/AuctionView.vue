<script setup>
import AuctionDetailsCard from "@/components/AuctionDetailsCard.vue";
import BidsCard from "@/components/BidsCard.vue";
import ReviewCard from "@/components/ReviewCard.vue";
import WinningBidCard from "@/components/WinningBidCard.vue";
import { useAuctionStore } from "@/stores/AuctionStore";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const auctionStore = useAuctionStore();
const loading = ref(true);

onBeforeMount(async () => {
  try {
    await auctionStore.loadAuction(route.params.id);

    if (auctionStore.isActive) {
      await auctionStore.loadBids();
    } else {
      await Promise.all([
        auctionStore.loadAcceptedBid(),
        auctionStore.loadMyReview(),
      ]);
    }
  } catch (errorResponse) {
    console.log(errorResponse);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <VContainer class="d-flex justify-center flex-column h-100">
    <VProgressCircular
      v-if="loading"
      class="align-self-center"
      color="primary"
      size="40"
      indeterminate
    />

    <template v-else>
      <AuctionDetailsCard />

      <BidsCard v-if="auctionStore.isActive" />
      <template v-else>
        <WinningBidCard />
        <ReviewCard
          v-if="
            auctionStore.amIWinner ||
            (auctionStore.amIAuctioneer && auctionStore.hasWinner)
          "
        />
      </template>
    </template>
  </VContainer>
</template>
