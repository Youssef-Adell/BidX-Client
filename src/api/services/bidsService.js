import apiClient from "../apiClient";

export async function fetchAuctionBids(auctionId) {
  try {
    const response = await apiClient.get(`auctions/${auctionId}/bids`);
    return response.data;
  } catch (errorResponse) {
    throw errorResponse;
  }
}

export async function fetchAcceptedBid(auctionId) {
  try {
    const response = await apiClient.get(
      `auctions/${auctionId}/bids/accepted-bid`
    );
    return response.data;
  } catch (errorResponse) {
    throw errorResponse;
  }
}
