import { defineStore } from "pinia";
import { useAuthStore } from "./AuthStore";
import { fetchAuction } from "@/api/services/auctionsService";
import { fetchAcceptedBid, fetchAuctionBids } from "@/api/services/bidsService";
import { deleteMyReview, fetchMyReview } from "@/api/services/reviewsService";
import signalrClient from "@/api/signalrClient";

export const useAuctionStore = defineStore("auction", {
  state: () => ({
    auction: null,
    bids: { data: [], metadata: null },
    acceptedBid: null,
    myReview: { rating: 1, comment: "" },
    loading: false,
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
    async load(auctionId) {
      this.loading = true;

      try {
        this.auction = await fetchAuction(auctionId);

        if (this.isActive) {
          this.bids = await fetchAuctionBids(this.auction.id);
          this.bids.data.reverse(); //to make the latest bid at the end
          await signalrClient.joinAuctionRoom(this.auction.id);
        } else {
          const loadAcceptedBid = async () => {
            if (this.hasWinner)
              this.acceptedBid = await fetchAcceptedBid(this.auction.id);
          };

          const loadMyReview = async () => {
            if (this.amIWinner) {
              const revieweeId = this.auction.auctioneer.id;
              this.myReview = await fetchMyReview(revieweeId);
            } else if (this.amIAuctioneer && this.hasWinner) {
              const revieweeId = this.auction.winnerId;
              this.myReview = await fetchMyReview(revieweeId);
            }
          };

          await Promise.all([loadAcceptedBid(), loadMyReview()]);
        }
      } finally {
        this.loading = false;
      }
    },

    async reload() {
      if (this.auction?.id) {
        try {
          await this.load(this.auction?.id);
        } catch {
          // Supress the error
        }
      }
    },

    async unload() {
      try {
        await signalrClient.leaveAuctionRoom(this.auction.id);
      } catch {
        // Supress the error
      } finally {
        this.$reset();
      }
    },

    endAuction() {
      if (this.isActive) {
        this.auction.endTime = new Date().toISOString(); // Convert it to ISO to be able to parse it in the countdown
      }
    },

    bidPlacedHandler(bid) {
      this.bids.data.push(bid);
      this.auction.currentPrice = bid.amount;
    },

    bidAcceptedHandler(bid) {
      this.auction.winnerId = bid.bidder.id;
      this.auction.currentPrice = bid.amount;
      this.acceptedBid = bid;
      this.endAuction();
    },

    async deleteMyReview() {
      if (this.amIWinner) {
        const revieweeId = this.auction.auctioneer.id;
        await deleteMyReview(revieweeId);
      } else if (this.amIAuctioneer && this.hasWinner) {
        const revieweeId = this.auction.winnerId;
        await deleteMyReview(revieweeId);
      }

      this.myReview.rating = 1;
      this.myReview.comment = "";
    },
  },
});
