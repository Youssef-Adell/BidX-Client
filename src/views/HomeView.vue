<script setup>
import AuctionsCatalog from "@/components/AuctionsCatalog.vue";
import CategoriesGrid from "@/components/CategoriesGrid.vue";
import CreateAuctionButton from "@/components/CreateAuctionButton.vue";
import { useDisplay } from "vuetify";

const { xs } = useDisplay();
</script>

<template>
  <VContainer class="h-100">
    <CategoriesGrid />

    <AuctionsCatalog class="mt-6">
      <template #title>
        <VIcon icon="mdi-star-four-points" :size="xs ? 'small' : 'default'" />
        <h2 :class="xs ? 'text-h6' : 'text-h5'">
          <span class="font-weight-light">Latest</span> Auctions
        </h2>
      </template>
    </AuctionsCatalog>

    <CreateAuctionButton />
  </VContainer>
</template>
