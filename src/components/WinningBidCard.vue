<script setup>
import Bid from "./Bid.vue";
import { computed, onBeforeMount, ref } from "vue";

const props = defineProps({
  auctionId: {
    type: String,
    required: true,
  },
  amIAuctioneer: {
    type: Boolean,
    default: false,
  },
  amIWinner: {
    type: Boolean,
    default: false,
  },
  auctioneerId: {
    type: Number,
  },
  acceptedBid: {
    type: Object,
  },
});

const winningBid = ref();

const contactButtonText = computed(() => {
  return props.amIAuctioneer ? "Contact the winner" : "Contact the auctioneer";
});

const contact = async () => {
  if (props.amIAuctioneer) {
    console.log(`Contact ${winningBid.value.bidder.id}`);
  } else {
    console.log(`Contact ${props.auctioneerId}`);
  }
};

onBeforeMount(() => {
  if (!props.acceptedBid) {
    //   winningBid.value = fetchAcceptedBid(props.auctionId);
  } else {
    winningBid.value = props.acceptedBid;
  }
});
</script>

<template>
  <div class="d-flex mt-4 justify-md-end">
    <VSheet class="w-100 w-md-50 pa-5" elevation="4" rounded>
      <section>
        <h2 class="text-subtitle-2 text-high-emphasis mb-2">Winning Bid</h2>

        <!--There is no Winner-->
        <div v-if="!winningBid" class="d-flex flex-column align-center">
          <VIcon icon="mdi-emoticon-cry-outline" />
          <div class="text-body-2 text-center">
            Unfortunately<br />There’s No Winning Bid!
          </div>
        </div>

        <!--There is a winner-->
        <template v-else>
          <div v-if="amIWinner" class="d-flex flex-column align-center">
            <VIcon icon="mdi-charity" color="primary" />
            <div class="text-body-2 text-center">
              Congratulations!<br />You Won the Auction!
            </div>
          </div>

          <Bid v-else :bid="winningBid" winning />

          <!--Contact Button for the auctioner or the Winner-->
          <VBtn
            v-if="amIAuctioneer || amIWinner"
            :text="contactButtonText"
            @click="contact"
            color="primary"
            variant="flat"
            size="small"
            class="mt-4"
            block
          />
        </template>
      </section>
    </VSheet>
  </div>
</template>
