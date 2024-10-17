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
  },
});
