import { defineStore } from "pinia";

export const useAuctionStore = defineStore("auction", {
  state: () => ({
    auction: null,
    loading: false,
  }),

  getters: {
    isActive() {
      const timeRemaning = Date.parse(this.auction.endTime) - Date.now();
      console.log(timeRemaning);
      return timeRemaning > 0;
    },
    amIWinner() {
      return true;
    },
    amIAuctioneer() {
      return false;
    },
  },
  actions: {
    async loadAuction(auctionId) {
      this.loading = true;

      setTimeout(() => {
        this.auction = {
          id: auctionId,
          productName: "Iphone 14 Pro Max open box",
          productDescription:
            "Iphone 14 Pro max open box like new with charger and accessories and the warranty will be valid till 2025.",
          productCondition: "New",
          currentPrice: 1600,
          minBidIncrement: 100,
          startTime: "2024-11-04T09:32:23.794Z",
          endTime: "2024-11-07T20:48:00.000Z",
          category: "Mobiles",
          city: "Cairo",
          auctioneer: {
            id: 12,
            name: "Youssef Wahba",
            profilePictureUrl: "https://picsum.photos/250",
            rating: 3,
          },
          images: [
            "https://picsum.photos/600",
            "https://picsum.photos/500",
            "https://picsum.photos/400",
          ],
          winnerId: 0,
        };

        this.loading = false;
      }, 2000);
    },

    createAuction(auction) {},
  },
});
