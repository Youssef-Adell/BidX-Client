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

  async fetchChatMessages(chatId, page, pageSize) {
    const response = await httpClient.get(`/chats/${chatId}/messages`, {
      requiresAuth: true,
      params: {
        page,
        pageSize,
      },
    });

    return response.data;
  },
};
