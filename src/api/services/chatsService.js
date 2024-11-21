export async function intiateChat(receiverId) {
  try {
    const response = await apiClient.post("/auctions", null, {
      requiresAuth: true,
    });

    return response.data;
  } catch (errorResponse) {
    throw errorResponse;
  }
}
