<script setup>
import UserProfileSummary from "./UserProfileSummary.vue";
import { useSignalRStore } from "@/stores/SignalRStore";
import { ref } from "vue";

const props = defineProps({
  bid: {
    type: Object,
    required: true,
  },
  amIAuctioneer: {
    type: Boolean,
    default: false,
  },
  winning: {
    type: Boolean,
    default: false,
  },
});

const loading = ref(false);

const signalRStore = useSignalRStore();

const acceptTheBid = async () => {
  try {
    loading.value = true;
    await signalRStore.acceptBid(props.bid.id);
  } catch {
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    :class="['d-flex flex-column border rounded', { 'border-s-xl': winning }]"
  >
    <!--Bid Info-->
    <div class="d-flex justify-space-between align-center px-2 px-sm-3">
      <UserProfileSummary :profile="bid.bidder" />

      <div class="text-subtitle-2">
        {{ `${bid.amount} EGP` }}
      </div>
    </div>

    <!--Accept button-->
    <VBtn
      v-if="amIAuctioneer"
      text="Accept"
      color="primary"
      variant="flat"
      class="rounded-b"
      density="comfortable"
      @click="acceptTheBid"
      tile
    />
  </div>
</template>
