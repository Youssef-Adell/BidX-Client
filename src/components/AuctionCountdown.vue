<script setup>
import { ref } from "vue";
import VueCountdown from "@chenfengyuan/vue-countdown";

const props = defineProps({
  endtime: {
    type: String,
    required: true,
  },
});

const remainingInMilliseconds = Date.parse(props.endtime) - Date.now();

const auctionEnded = ref(remainingInMilliseconds <= 0);

const onAuctionEnded = () => {
  auctionEnded.value = true;
};

const formatProps = (props) => {
  const formattedProps = {};

  Object.entries(props).forEach(([key, value]) => {
    formattedProps[key] = value < 10 ? `0${value}` : `${value}`;
  });

  return formattedProps;
};
</script>

<template>
  <div>
    <!--Auction Has Ended-->
    <div
      v-if="auctionEnded"
      class="d-flex flex-column justify-center align-center text-caption font-weight-bold text-error"
    >
      <VIcon icon="mdi-timer-alert" size="20" />
      <span>The Auction Has Ended</span>
    </div>

    <!--Auction Countdown-->
    <VueCountdown
      v-else
      :time="remainingInMilliseconds"
      :transform="formatProps"
      @end="onAuctionEnded"
      #default="{ days, hours, minutes, seconds }"
    >
      <div
        class="d-flex justify-center align-center ga-1 text-caption font-weight-bold"
      >
        <div
          class="d-flex justify-center align-center rounded-circle bg-primary"
          style="width: 40px; height: 40px"
        >
          {{ days }}d
        </div>

        <span class="font-weight-bold">:</span>

        <div
          class="d-flex justify-center align-center rounded-circle bg-primary"
          style="width: 40px; height: 40px"
        >
          {{ hours }}h
        </div>

        <span class="font-weight-bold">:</span>

        <div
          class="d-flex justify-center align-center rounded-circle bg-primary"
          style="width: 40px; height: 40px"
        >
          {{ minutes }}m
        </div>

        <span class="font-weight-bold">:</span>

        <div
          class="d-flex justify-center align-center rounded-circle bg-primary"
          style="width: 40px; height: 40px"
        >
          {{ seconds }}s
        </div>
      </div>
    </VueCountdown>
  </div>
</template>
