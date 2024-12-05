<script setup>
import CreateAuctionForm from "@/components/CreateAuctionForm.vue";
import UploadProgressOverlay from "@/components/UploadProgressOverlay.vue";
import { useAuctionStore } from "@/stores/AuctionStore";

const auctionStore = useAuctionStore();
</script>

<template>
  <VContainer class="d-flex flex-column justify-center align-center h-100">
    <UploadProgressOverlay
      v-if="auctionStore.loading"
      :percentage="auctionStore.uploadProgress"
    />

    <CreateAuctionForm />
  </VContainer>
</template>
