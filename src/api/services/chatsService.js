import httpClient from "../httpClient";

export default {
  async intiateChat(receiverId) {
    const response = await httpClient.post(
      `/chats/initiate/${receiverId}`,
      null,
      {
        requiresAuth: true,
      }
    );

    return response.data;
  },
};
