import { objectToFormData } from "@/utils/apiUtils";
import httpClient from "../httpClient";

export default {
  async addAuction(auction) {
    const formData = objectToFormData(auction);

    const response = await httpClient.post("/auctions", formData, {
      requiresAuth: true,
    });

    return response.data;
  },

  async fetchAuction(auctionId) {
    const response = await httpClient.get(`/auctions/${auctionId}`);

    return response.data;
  },
};
