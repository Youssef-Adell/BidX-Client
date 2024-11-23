import apiClient from "../apiClient";

export async function fetchAuctionBids(auctionId, page, pageSize) {
  try {
    const response = await apiClient.get(`auctions/${auctionId}/bids`, {
      params: {
        page,
        pageSize,
      },
    });
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
