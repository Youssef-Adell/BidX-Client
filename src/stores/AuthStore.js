import httpClient from "@/api/httpClient";
import signalrClient from "@/api/signalrClient";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: null,
    loading: true,
  }),

  getters: {
    isLoggedIn() {
      return this.user !== null;
    },
  },
  actions: {
    async login(email, password) {
      try {
        const response = await httpClient.post(
          "/auth/login",
          { email: email, password: password },
          { withCredentials: true }
        );

        this.user = response.data.user;
        this.accessToken = response.data.accessToken;
        signalrClient.restartConnection();
      } catch (errorResponse) {
        throw errorResponse;
      }
    },

    async register(user) {
      try {
        await httpClient.post("/auth/register", user);
      } catch (errorResponse) {
        throw errorResponse;
      }
    },

    async resendConfirmationEmail(email) {
      try {
        await httpClient.post("/auth/resend-confirmation-email", {
          email: email,
        });
      } catch (errorResponse) {
        throw errorResponse;
      }
    },

    async forgotPassword(email) {
      try {
        await httpClient.post("/auth/forgot-password", {
          email: email,
        });
      } catch (errorResponse) {
        throw errorResponse;
      }
    },

    async refreshToken() {
      try {
        const response = await httpClient.post("/auth/refresh", null, {
          withCredentials: true,
        });

        this.user = response.data.user;
        this.accessToken = response.data.accessToken;

        return true; // Needed for deciding to retry faild requests or not in axios response interceptor
      } catch (errorResponse) {
        this.user = null;
        this.accessToken = null;

        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        this.loading = true;
        await httpClient.post("/auth/logout", null, {
          withCredentials: true,
          requiresAuth: true,
        });
      } catch (errorResponse) {
      } finally {
        this.loading = false;
        this.user = null;
        this.accessToken = null;
        signalrClient.restartConnection();
      }
    },
  },
});
