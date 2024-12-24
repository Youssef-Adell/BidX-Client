import { defineStore } from "pinia";
import auctionsService from "@/api/services/auctionsService";
import signalrClient from "@/api/signalrClient";

export const useAuctionsStore = defineStore("auctions", {
  state: () => ({
    auctions: { data: [], metadata: null },
    currentParams: { page: 1, pageSize: 12, filters: null }, // Needed in reload()
    userInFeedPage: false,
    loading: true,
  }),

  actions: {
    async load(page, pageSize, filters) {
      try {
        this.loading = true;

        this.auctions = await auctionsService.fetchAuctions(
          page,
          pageSize,
          filters
        );

        // Join only at the first load
        if (!this.userInFeedPage) {
          await signalrClient.joinFeedRoom();
        }

        this.currentParams.page = page;
        this.currentParams.pageSize = pageSize;
        this.currentParams.filters = filters;
        this.userInFeedPage = true;
      } finally {
        this.loading = false;
      }
    },

    async reload() {
      if (this.userInFeedPage) {
        try {
          this.loading = true;

          [this.auctions] = await Promise.all([
            auctionsService.fetchAuctions(
              this.currentParams.page,
              this.currentParams.pageSize,
              this.currentParams.filters
            ),
            signalrClient.joinFeedRoom(),
          ]);
        } catch {
          // Supress the error
        } finally {
          this.loading = false;
        }
      }
    },

    async unload() {
      try {
        await signalrClient.leaveFeedRoom();
      } catch {
        // Supress the error
      } finally {
        this.$reset();
      }
    },

    async auctionCreatedHandler(createdAuction) {
      this.auctions.data.unshift(createdAuction);
    },

    async auctionDeletedHandler(deletedAuction) {
      this.auctions.data = this.auctions.data.filter(
        (auction) => auction.id !== deletedAuction.auctionId
      );
    },

    async auctionEndedHandler(endedAuction) {
      const auctionToEnd = this.auctions.data.find(
        (auction) => auction.id === endedAuction.auctionId
      );

      if (auctionToEnd) {
        auctionToEnd.endTime = new Date().toISOString(); // Convert it to ISO to be able to parse it in the countdown
        auctionToEnd.currentPrice = endedAuction.finalPrice;
      }
    },

    async auctionPriceUpdatedHandler(updatedAuction) {
      const auctionToUpdate = this.auctions.data.find(
        (auction) => auction.id === updatedAuction.auctionId
      );

      if (auctionToUpdate) {
        auctionToUpdate.currentPrice = updatedAuction.newPrice;
      }
    },
  },
});
