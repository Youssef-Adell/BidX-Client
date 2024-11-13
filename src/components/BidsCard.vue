<script setup>
import Bid from "./Bid.vue";
import { useAuctionStore } from "@/stores/AuctionStore";
import { useAuthStore } from "@/stores/AuthStore";
import { useSignalRStore } from "@/stores/SignalRStore";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const { smAndDown } = useDisplay();
const router = useRouter();
const authStore = useAuthStore();
const auctionStore = useAuctionStore();
const signalRStore = useSignalRStore();

const form = ref({
  bidAmount:
    auctionStore.auction?.currentPrice + auctionStore.auction?.minBidIncrement,
  loading: false,
});

const minBidAmountAllowed = computed(() => {
  return (
    auctionStore.auction?.currentPrice + auctionStore.auction?.minBidIncrement
  );
});

const loadMoreBids = ({ done }) => {
  done("empty");
};

const placeBid = async (event) => {
  if (!authStore.isLoggedIn) {
    router.push("/login");
    return;
  }

  // ensure that the input satisfies the rules
  const { valid } = await event;
  if (!valid) return;

  try {
    form.value.loading = true;
    await signalRStore.placeBid(auctionStore.auction.id, form.value.bidAmount);
    form.value.bidAmount = minBidAmountAllowed.value;
  } catch {
  } finally {
    form.value.loading = false;
  }
};
</script>

<template>
  <div
    :class="[
      'd-flex mt-4 justify-md-end',
      { 'mb-12 mb-md-0': !auctionStore.amIAuctioneer },
    ]"
  >
    <VSheet class="w-100 w-md-50 pa-5" elevation="4" rounded>
      <section>
        <h2 class="text-subtitle-2 text-high-emphasis mb-2">Bids</h2>

        <!--Bids List-->
        <VInfiniteScroll
          :height="auctionStore.amIAuctioneer ? 210 : 215"
          empty-text="No Bids Found"
          side="start"
          @load="loadMoreBids"
        >
          <template v-for="bid in auctionStore.bids.data" :key="bid.id">
            <Bid
              :bid="bid"
              :am-i-auctioneer="auctionStore.amIAuctioneer"
              class="mb-2"
            />
          </template>
        </VInfiniteScroll>

        <!--Place Bid Form-->
        <VForm
          v-if="!auctionStore.amIAuctioneer"
          @submit.prevent="placeBid"
          :class="{
            'position-fixed bottom-0 right-0 left-0 elevation-4': smAndDown,
          }"
          style="z-index: 9999"
        >
          <VNumberInput
            v-model="form.bidAmount"
            control-variant="split"
            density="comfortable"
            variant="outlined"
            suffix="EGP"
            base-color="secondary"
            color="secondary"
            bg-color="surface"
            style="margin-bottom: -3px"
            :min="minBidAmountAllowed"
            :step="auctionStore.auction?.minBidIncrement"
            :rules="[(value) => (value >= minBidAmountAllowed ? true : false)]"
            :tile="smAndDown"
            hide-details
            inset
          />

          <VBtn
            text="Place a Bid"
            color="primary"
            size="large"
            variant="flat"
            type="submit"
            class="rounded-b"
            :loading="form.loading"
            block
            tile
          />
        </VForm>
      </section>
    </VSheet>
  </div>
</template>
