<script setup>
import AuctionsFeed from "@/components/AuctionsFeed.vue";
import CategoriesGrid from "@/components/CategoriesGrid.vue";
import CreateAuctionButton from "@/components/CreateAuctionButton.vue";
</script>

<template>
  <VContainer class="h-100">
    <CategoriesGrid class="mt-6" />
    <AuctionsFeed class="mt-6" />

    <CreateAuctionButton />
  </VContainer>
</template>
