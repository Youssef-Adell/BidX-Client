<script setup>
import VueCountdown from "@chenfengyuan/vue-countdown";
import { computed } from "vue";

const props = defineProps({
  auction: {
    type: Object,
    required: true,
  },
});

const remainingTimeInMs = computed(() => {
  return Date.parse(props.auction?.endTime) - Date.now();
});

const isAuctionActive = computed(() => {
  return remainingTimeInMs.value > 0;
});

const endAuction = () => {
  props.auction.endTime = Date.now();
};

const formatProps = (props) => {
  const formattedProps = {};
  // Add 0 prefix for all numbers less than 10
  Object.entries(props).forEach(([key, value]) => {
    formattedProps[key] = value < 10 ? `0${value}` : `${value}`;
  });
  return formattedProps;
};
</script>

<template>
  <RouterLink :to="`/auctions/${auction.id}`" class="text-decoration-none">
    <VSheet
      class="d-flex flex-column justify-space-between overflow-hidden"
      border
      rounded
    >
      <!--Thumbnail-->
      <VImg
        :src="auction.thumbnailUrl"
        :draggable="false"
        alt="Product Image"
        aspect-ratio="1"
        color="#f0f0f0"
        cover
      />

      <!--Details-->
      <div class="pa-3 pt-2">
        <!--Product Name-->
        <div
          class="text-subtitle-1 text-high-emphasis font-weight-bold text-capitalize text-truncate"
        >
          {{ auction.productName }}
        </div>

        <div class="d-flex justify-space-between align-center mt-1">
          <!--Remaning Time-->
          <div v-if="isAuctionActive" class="d-flex flex-column">
            <VueCountdown
              class="text-caption text-high-emphasis font-weight-medium"
              :time="remainingTimeInMs"
              :transform="formatProps"
              @end="endAuction"
              #default="{ days, hours, minutes, seconds }"
            >
              {{ days }}d : {{ hours }}h : {{ minutes }}m : {{ seconds }}s
            </VueCountdown>
            <span class="text-caption">Remaining Time</span>
          </div>

          <div v-else class="text-error text-body-2 font-weight-medium">
            <span class="letter-spacing-2">ENDED</span>
          </div>

          <!--Current Price-->
          <div class="d-flex flex-column align-end">
            <span class="text-body-2 text-high-emphasis font-weight-bold">
              {{ auction.currentPrice }} EGP
            </span>
            <span class="text-caption">{{
              isAuctionActive ? "Current Price" : "Final Price"
            }}</span>
          </div>
        </div>
      </div>
    </VSheet>
  </RouterLink>
</template>

<style scoped>
.letter-spacing-2 {
  letter-spacing: 2px;
}
</style>
