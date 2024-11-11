import { defineStore } from "pinia";
import { useAuthStore } from "./AuthStore";
import { fetchAuction } from "@/api/services/auctionsService";
import { fetchAcceptedBid, fetchAuctionBids } from "@/api/services/bidsService";
import { deleteMyReview, fetchMyReview } from "@/api/services/reviewsService";

export const useAuctionStore = defineStore("auction", {
  state: () => ({
    auction: null,
    bids: {
      data: [],
      metadata: null,
    },
    acceptedBid: null,
    myReview: {
      rating: 1,
      comment: "",
    },
  }),

  getters: {
    isActive() {
      const timeRemaning = Date.parse(this.auction?.endTime) - Date.now();
      return timeRemaning > 0;
    },

    hasWinner() {
      return this.auction?.winnerId !== null;
    },

    amIWinner() {
      const authStore = useAuthStore();

      if (authStore.isLoggedIn) {
        const myId = authStore.user?.id;
        return this.auction?.winnerId === myId;
      }
      return false;
    },

    amIAuctioneer() {
      const authStore = useAuthStore();

      if (authStore.isLoggedIn) {
        const myId = authStore.user?.id;
        return this.auction?.auctioneer?.id === myId;
      }
      return false;
    },

    didIReview() {
      return this.myReview?.id !== undefined;
    },
  },
  actions: {
    async loadAuction(auctionId) {
      try {
        this.auction = await fetchAuction(auctionId);
      } catch (errorResponse) {
        throw errorResponse;
      }
    },

    async loadBids() {
      try {
        this.bids = await fetchAuctionBids(this.auction.id);
      } catch (errorResponse) {
        throw errorResponse;
      }
    },

    async loadAcceptedBid() {
      try {
        if (this.hasWinner)
          this.acceptedBid = await fetchAcceptedBid(this.auction.id);
      } catch (errorResponse) {
        throw errorResponse;
      }
    },

    async loadMyReview() {
      try {
        if (this.amIWinner) {
          const revieweeId = this.auction.auctioneer.id;
          this.myReview = await fetchMyReview(revieweeId);
        } else if (this.amIAuctioneer && this.hasWinner) {
          const revieweeId = this.auction.winnerId;
          this.myReview = await fetchMyReview(revieweeId);
        }
      } catch (errorResponse) {
        throw errorResponse;
      }
    },

    async deleteMyReview() {
      try {
        if (this.amIWinner) {
          const revieweeId = this.auction.auctioneer.id;
          this.myReview = await deleteMyReview(revieweeId);
        } else if (this.amIAuctioneer && this.hasWinner) {
          const revieweeId = this.auction.winnerId;
          this.myReview = await deleteMyReview(revieweeId);
        }

        this.myReview.rating = "1";
        this.myReview.comment = "";
      } catch (errorResponse) {
        throw errorResponse;
      }
    },
  },
});
