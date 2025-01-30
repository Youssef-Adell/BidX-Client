<script setup>
import AuctionDetailsCard from "@/components/AuctionView/AuctionDetailsCard.vue";
import ReviewCard from "@/components/AuctionView/ReviewCard.vue";
import WinningBidCard from "@/components/AuctionView/WinningBidCard.vue";
import { ErrorCode } from "@/api/errorCodes";
import { useAuctionStore } from "@/stores/AuctionStore";
import { onBeforeMount, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import BidsCard from "@/components/AuctionView/BidsCard.vue";

const route = useRoute();
const auctionStore = useAuctionStore();

onBeforeMount(async () => {
  try {
    await auctionStore.load(route.params.id);
  } catch (errorResponse) {
    if (errorResponse.errorCode === ErrorCode.RESOURCE_NOT_FOUND)
      console.log(errorResponse); // TODO: redirect to 404 not found page
  }
});

onBeforeUnmount(() => {
  auctionStore.unload();
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

      <VScrollYTransition hide-on-leave leave-absolute>
        <BidsCard v-if="auctionStore.isActive" />
        <template v-else>
          <div>
            <WinningBidCard />
            <ReviewCard
              v-if="
                auctionStore.amIWinner ||
                (auctionStore.amIAuctioneer && auctionStore.hasWinner)
              "
            />
          </div>
        </template>
      </VScrollYTransition>
    </template>
  </VContainer>
</template>
