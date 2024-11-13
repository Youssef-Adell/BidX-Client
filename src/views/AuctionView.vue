<script setup>
import { ErrorCode } from "@/api/errorCodes";
import AuctionDetailsCard from "@/components/AuctionDetailsCard.vue";
import BidsCard from "@/components/BidsCard.vue";
import ReviewCard from "@/components/ReviewCard.vue";
import WinningBidCard from "@/components/WinningBidCard.vue";
import { useAuctionStore } from "@/stores/AuctionStore";
import { onBeforeMount, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const auctionStore = useAuctionStore();

onBeforeMount(async () => {
  try {
    await auctionStore.load(route.params.id);
  } catch (errorResponse) {
    if (errorResponse.errorCode === ErrorCode.RESOURCE_NOT_FOUND)
      console.log(errorResponse); // redirect to 404 not found page
  }
});

onBeforeUnmount(async () => {
  await auctionStore.unload();
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
