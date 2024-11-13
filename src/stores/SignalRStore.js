// signalrStore.js
import { defineStore } from "pinia";
import signalRConnection from "@/api/signalRConnection";

export const useSignalRStore = defineStore("signalR", {
  state: () => ({
    connectionStatus: "connecting", // 'connecting', 'connected', 'reconnecting', 'disconnected'
  }),

  getters: {
    isConnected() {
      return this.connectionStatus === "connected";
    },
  },

  actions: {
    async startConnection() {
      // Handle reconnection events
      signalRConnection.onreconnecting(() => {
        this.connectionStatus = "reconnecting";
      });

      signalRConnection.onreconnected(() => {
        this.connectionStatus = "connected";
      });

      signalRConnection.onclose(() => {
        this.connectionStatus = "disconnected";
      });

      // Start the connection
      try {
        await signalRConnection.start();
        this.connectionStatus = "connected";
      } catch {
        setTimeout(() => this.startConnection(), 3000);
      }
    },

    async stopConnection() {
      try {
        await signalRConnection.stop();
        this.connectionStatus = "disconnected";
      } catch {}
    },

    // Commands
    async joinAuctionRoom(auctionId) {
      await signalRConnection.invoke("JoinAuctionRoom", { auctionId });
      console.log("joinAuctionRoom");
    },

    async leaveAuctionRoom(auctionId) {
      await signalRConnection.invoke("LeaveAuctionRoom", { auctionId });
      console.log("leaveAuctionRoom");
    },

    async placeBid(auctionId, amount) {
      await signalRConnection.invoke("BidUp", { auctionId, amount });
    },

    async acceptBid(bidId) {
      await signalRConnection.invoke("AcceptBid", { bidId });
    },

    // Events
    onBidPlaced(callback) {
      // Remove all previously added callbacks to avoid adding the same callback multiple times, although the library already prevent that
      // but if you passed the same anonymous function multiple times each time it will be considerd a new function with a new reference
      // so the library will add it normally which will cause a memmory leak (and we don't want that)
      signalRConnection.off("BidCreated");
      signalRConnection?.on("BidCreated", callback);
    },

    onBidAccepted(callback) {
      signalRConnection.off("BidAccepted");
      signalRConnection?.on("BidAccepted", callback);
    },
  },
});
