<script setup>
import UserInfo from "@/components/UserInfo.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const userId = Number(route.params.id);
const tab = ref("auctions");
</script>

<template>
  <VContainer class="pt-10">
    <!-- Header Section -->
    <VSheet
      class="d-flex flex-column align-center mt-16 mb-4"
      elevation="1"
      rounded
    >
      <UserInfo :user-id="userId" class="mt-n16 mb-4" />

      <VTabs
        v-model="tab"
        class="w-100"
        align-tabs="center"
        color="primary"
        fixed-tabs
      >
        <VTab value="auctions">Auctions</VTab>
        <VTab value="biddings">Biddings</VTab>
        <VTab value="reviews">Reviews</VTab>
      </VTabs>
    </VSheet>

    <!-- Content Section -->
    <VTabsWindow v-model="tab">
      <VTabsWindowItem value="auctions"> </VTabsWindowItem>
      <VTabsWindowItem value="biddings"> </VTabsWindowItem>
      <VTabsWindowItem value="reviews"> </VTabsWindowItem>
    </VTabsWindow>
  </VContainer>
</template>
