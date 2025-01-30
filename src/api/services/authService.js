import httpClient from "../httpClient";

export default {
  async login(email, password) {
    const response = await httpClient.post(
      "/auth/login",
      { email: email, password: password },
      { withCredentials: true }
    );

    return response.data;
  },

  async register(user) {
    await httpClient.post("/auth/register", user);
  },

  async resendConfirmationEmail(email) {
    await httpClient.post("/auth/resend-confirmation-email", {
      email: email,
    });
  },

  async forgotPassword(email) {
    await httpClient.post("/auth/forgot-password", {
      email: email,
    });
  },

  async updateMyPassword(currentPassword, newPassword) {
    await httpClient.post(
      "/auth/change-password",
      {
        currentPassword,
        newPassword,
      },
      { requiresAuth: true }
    );
  },

  async refreshToken() {
    const response = await httpClient.post("/auth/refresh", null, {
      withCredentials: true,
    });

    return response.data;
  },

  async logout() {
    await httpClient.post("/auth/logout", null, {
      withCredentials: true,
      requiresAuth: true,
    });
  },
};
