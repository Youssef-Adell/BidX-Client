import httpClient from "../httpClient";

export async function intiateChat(receiverId) {
  const response = await httpClient.post(
    `/chats/initiate/${receiverId}`,
    null,
    {
      requiresAuth: true,
    }
  );

  return response.data;
}
