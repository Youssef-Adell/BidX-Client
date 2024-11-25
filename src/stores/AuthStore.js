import authService from "@/api/services/authService";
import signalrClient from "@/api/signalrClient";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: null,
    loading: false,
  }),

  getters: {
    isLoggedIn() {
      return this.user !== null;
    },
  },

  actions: {
    async login(email, password) {
      const { user, accessToken } = await authService.login(email, password);

      this.user = user;
      this.accessToken = accessToken;
      localStorage.setItem("hasLoggedIn", true); // Needed to decicde whether to refresh or not in refreshToken()

      signalrClient.restartConnection();
    },

    async register(user) {
      await authService.register(user);
    },

    async resendConfirmationEmail(email) {
      await authService.resendConfirmationEmail(email);
    },

    async forgotPassword(email) {
      await authService.forgotPassword(email);
    },

    async refreshToken() {
      if (!localStorage.getItem("hasLoggedIn")) return false;

      try {
        this.loading = true;

        const { user, accessToken } = await authService.refreshToken();
        this.user = user;
        this.accessToken = accessToken;

        return true; // Needed for deciding to retry faild requests or not in axios response interceptor
      } catch {
        this.user = null;
        this.accessToken = null;
        localStorage.removeItem("hasLoggedIn");
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        this.loading = true;
        await authService.logout();
      } catch {
        // Supress the error
      } finally {
        this.user = null;
        this.accessToken = null;
        localStorage.removeItem("hasLoggedIn");

        signalrClient.restartConnection();
        this.loading = false;
      }
    },
  },
});
