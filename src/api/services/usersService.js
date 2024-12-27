import httpClient from "../httpClient";

export default {
  async fetchUserProfile(userId) {
    const response = await httpClient.get(`/users/${userId}/profile`);
    return response.data;
  },

  async fetchUserAuctions(userId, page, pageSize, filters) {
    const response = await httpClient.get(`users/${userId}/created-auctions`, {
      params: { page, pageSize, ...filters },
    });

    return response.data;
  },

  async fetchUserBiddings(userId, page, pageSize, filters) {
    const response = await httpClient.get(`users/${userId}/bidded-auctions`, {
      params: { page, pageSize, ...filters },
    });

    return response.data;
  },

  async updateMyProfilePicture(profilePicture) {
    await httpClient.put(
      `/users/${current}/profile/picture`,
      {
        newProfilePicture: profilePicture,
      },
      {
        requiresAuth: true,
      }
    );
  },
};
