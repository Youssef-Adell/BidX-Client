<script setup>
import Bid from "./Bid.vue";
import { fetchAuctionBids } from "@/api/services/bidsService";
import { computed, onBeforeMount, ref } from "vue";

const props = defineProps({
  auctionId: {
    type: String,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  minBidIncrement: {
    type: Number,
    required: true,
  },
  amIAuctioneer: {
    type: Boolean,
    required: true,
  },
});

const bids = ref([]);
const form = ref({
  bidAmount: props.currentPrice + props.minBidIncrement,
  loading: false,
});

const minBidAmountAllowed = computed(() => {
  return props.currentPrice + props.minBidIncrement;
});

const loadMoreBids = ({ done }) => {
  done("empty");
};

const placeBid = async (event) => {
  // ensure that the input satisfies the rules
  const { valid } = await event;
  if (!valid) return;

  form.value.loading = true;
  console.log(form.value.bidAmount);

  setTimeout(() => {
    form.value.loading = false;
    form.value.bidAmount = minBidAmountAllowed.value;
  }, 1000);
};

onBeforeMount(() => {
  bids.value = fetchAuctionBids(props.auctionId);
});
</script>

<template>
  <div class="d-flex mt-4 justify-md-end">
    <VSheet class="w-100 w-md-50 pa-5" elevation="4" rounded>
      <section>
        <h2 class="text-subtitle-2 text-high-emphasis mb-2">Bids</h2>

        <!--Bids List-->
        <VInfiniteScroll
          :height="amIAuctioneer ? 210 : 215"
          empty-text="No Bids Found"
          side="start"
          @load="loadMoreBids"
        >
          <template v-for="bid in bids" :key="bid.id">
            <Bid :bid="bid" :am-i-auctioneer="amIAuctioneer" />
          </template>
        </VInfiniteScroll>

        <!--Place Bid Form-->
        <VForm v-if="!amIAuctioneer" @submit.prevent="placeBid">
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
            :step="minBidIncrement"
            :rules="[(value) => (value >= minBidAmountAllowed ? true : false)]"
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
