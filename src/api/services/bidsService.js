import httpClient from "../httpClient";

export async function fetchAuctionBids(auctionId, page, pageSize) {
  const response = await httpClient.get(`auctions/${auctionId}/bids`, {
    params: {
      page,
      pageSize,
    },
  });
  return response.data;
}

export async function fetchAcceptedBid(auctionId) {
  const response = await httpClient.get(
    `auctions/${auctionId}/bids/accepted-bid`
  );
  return response.data;
}
