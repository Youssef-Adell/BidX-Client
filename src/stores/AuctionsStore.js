import { defineStore } from "pinia";
import auctionsService from "@/api/services/auctionsService";

export const useAuctionsStore = defineStore("auctions", {
  state: () => ({
    auctions: { data: [], metadata: null },
    loading: false,
  }),

  actions: {
    async load(page, pageSize) {
      try {
        this.loading = true;
        this.auctions = await auctionsService.fetchAuctions(page, pageSize);
      } finally {
        this.loading = false;
      }
    },
  },
});
