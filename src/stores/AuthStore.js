import apiClient from "@/api/apiClient";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: null,
  }),

  getters: {
    isLoggedIn() {
      return this.user !== null;
    },
  },
  actions: {
    async login(email, password) {
      try {
        const response = await apiClient.post(
          "/auth/login",
          { email: email, password: password },
          { withCredentials: true }
        );

        this.user = response.data.user;
        this.accessToken = response.data.accessToken;
      } catch (errorResponse) {
        throw errorResponse;
      }
    },

    async register(user) {
      try {
        await apiClient.post("/auth/register", user);
      } catch (errorResponse) {
        throw errorResponse;
      }
    },

    async resendConfirmationEmail(email) {
      try {
        await apiClient.post("/auth/resend-confirmation-email", {
          email: email,
        });
      } catch (errorResponse) {
        throw errorResponse;
      }
    },
  },
});
