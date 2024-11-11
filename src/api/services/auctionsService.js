import { objectToFormData } from "@/utils/apiUtils";
import apiClient from "../apiClient";

export async function addAuction(auction) {
  try {
    const formData = objectToFormData(auction);

    const response = await apiClient.post("/auctions", formData, {
      requiresAuth: true,
    });

    return response.data;
  } catch (errorResponse) {
    throw errorResponse;
  }
}

export async function fetchAuction(auctionId) {
  try {
    const response = await apiClient.get(`/auctions/${auctionId}`);

    return response.data;
  } catch (errorResponse) {
    throw errorResponse;
  }
}
