<script setup>
import UserProfileSummary from "./UserProfileSummary.vue";

defineProps({
  bid: {
    type: Object,
    required: true,
  },
  amIAuctioneer: {
    type: Boolean,
    default: false,
  },
});

const acceptTheBid = () => {};
</script>

<template>
  <div class="d-flex flex-column border rounded mb-2">
    <!--Bid Info-->
    <div class="d-flex justify-space-between align-center px-3">
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
