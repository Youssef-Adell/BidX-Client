import { defineStore } from "pinia";
import { useAuthStore } from "./AuthStore";
import auctionsService from "@/api/services/auctionsService";
import bidsService from "@/api/services/bidsService";
import signalrClient from "@/api/signalrClient";

export const useAuctionsStore = defineStore("auctions", {
  state: () => ({
    auctions: { data: [], metadata: null },
    loading: false,
  }),

  actions: {
    async load(
      page,
      pageSize = 12,
      search,
      activeOnly,
      categoryId,
      cityId,
      productCondition
    ) {
      try {
        this.loading = true;
        this.auctions = await auctionsService.fetchAuctions(
          page,
          pageSize,
          search,
          activeOnly,
          categoryId,
          cityId,
          productCondition
        );
      } finally {
        this.loading = false;
      }
    },
  },
});
