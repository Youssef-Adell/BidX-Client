import { defineStore } from "pinia";
import { useAuthStore } from "./AuthStore";

export const useAuctionStore = defineStore("auction", {
  state: () => ({
    auction: null,
    acceptedBid: {
      id: 0,
      amount: 1200,
      bidTime: "2024-11-03T22:36:43.003Z",
      auctionId: 0,
      bidder: {
        id: 0,
        name: "Abdelrhman Adel",
        profilePictureUrl: "https://picsum.photos/250",
      },
    },
    loading: false,
  }),

  getters: {
    isActive() {
      const timeRemaning = Date.parse(this.auction.endTime) - Date.now();
      return timeRemaning > 0;
    },
    amIWinner() {
      return false;
    },
    amIAuctioneer() {
      return true;
    },
    hasWinner() {
      return this.auction.winnerId !== null;
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
          endTime: "2024-11-04T20:48:00.000Z",
          category: "Mobiles",
          city: "Cairo",
          auctioneer: {
            id: 1,
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
