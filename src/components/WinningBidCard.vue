<script setup>
import Bid from "./Bid.vue";
import { intiateChat } from "@/api/services/chatsService";
import { useAuctionStore } from "@/stores/AuctionStore";

const auctionStore = useAuctionStore();

const contactButtonText = auctionStore.amIAuctioneer
  ? "Contact the winner"
  : "Contact the auctioneer";

const contact = async () => {
  const receiverId = auctionStore.amIAuctioneer
    ? auctionStore.auction.winnerId
    : auctionStore.auction.auctioneer.id;

  const chat = await intiateChat(receiverId);
  console.log(chat);
};
</script>

<template>
  <div class="d-flex mt-4 justify-md-end">
    <VSheet class="w-100 w-md-50 pa-5" elevation="4" rounded>
      <section>
        <h2 class="text-subtitle-2 text-high-emphasis mb-2">Winning Bid</h2>

        <!--There is no Winner-->
        <div
          v-if="!auctionStore.acceptedBid"
          class="d-flex flex-column align-center"
        >
          <VIcon icon="mdi-emoticon-cry-outline" />
          <div class="text-body-2 text-center">
            Unfortunately<br />There’s No Winning Bid!
          </div>
        </div>

        <!--There is a winner-->
        <template v-else>
          <div
            v-if="auctionStore.amIWinner"
            class="d-flex flex-column align-center"
          >
            <VIcon icon="mdi-charity" color="primary" />
            <div class="text-body-2 text-center">
              Congratulations!<br />You Won the Auction!
            </div>
          </div>

          <Bid v-else :bid="auctionStore.acceptedBid" winning />

          <!--Contact Button for the auctioner or the Winner-->
          <VBtn
            v-if="auctionStore.amIAuctioneer || auctionStore.amIWinner"
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
