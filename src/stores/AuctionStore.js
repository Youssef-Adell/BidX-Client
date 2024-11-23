import { defineStore } from "pinia";
import { useAuthStore } from "./AuthStore";
import { fetchAuction } from "@/api/services/auctionsService";
import { fetchAcceptedBid, fetchAuctionBids } from "@/api/services/bidsService";
import signalrClient from "@/api/signalrClient";

export const useAuctionStore = defineStore("auction", {
  state: () => ({
    auction: null,
    bids: { data: [], metadata: null },
    acceptedBid: null,
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
  },

  actions: {
    async load(auctionId) {
      try {
        this.loading = true;
        this.auction = await fetchAuction(auctionId);

        if (this.isActive) {
          this.bids = await fetchAuctionBids(this.auction.id);
          this.bids.data.reverse(); //to make the latest bid at the end
          await signalrClient.joinAuctionRoom(this.auction.id);
        } else if (!this.isActive && this.hasWinner) {
          this.acceptedBid = await fetchAcceptedBid(this.auction.id);
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

    async loadMoreBids() {
      if (this.bids.metadata.hasNext) {
        const response = await fetchAuctionBids(
          this.auction.id,
          ++this.bids.metadata.page, // Next page
          this.bids.metadata.pageSize
        );

        response.data.reverse(); // to make the newer bid at the end
        this.bids.data.unshift(...response.data);
        this.bids.metadata = response.metadata;
        return true;
      }

      return false;
    },

    endAuction() {
      if (this.isActive) {
        this.auction.endTime = new Date().toISOString(); // Convert it to ISO to be able to parse it in the countdown
      }
    },

    bidPlacedHandler(bid) {
      this.bids.data.push(bid);
      ++this.bids.metadata.pageSize; //to avoid refetching it when fetching more bids in loadMoreBids()
      this.auction.currentPrice = bid.amount;
    },

    bidAcceptedHandler(bid) {
      this.acceptedBid = bid;
      this.auction.winnerId = bid.bidder.id;
      this.auction.currentPrice = bid.amount;
      this.endAuction();
    },
  },
});
