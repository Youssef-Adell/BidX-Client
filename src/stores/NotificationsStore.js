import notificationsService from "@/api/services/notificationsService";
import { defineStore } from "pinia";

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    notifications: { data: [], metadata: null },
    unreadNotificationsCount: 0,
    loading: false,
  }),

  getters:{
    hasUnreadNotifications(){
      return this.unreadNotificationsCount > 0;
    }
  },

  actions: {
    async load() {
      try {
        this.loading = true;
        this.notifications = await notificationsService.fetchMyNotifications(1, 10);
      } finally {
        this.loading = false;
      }
    },

    async loadMoreNotifications() {
      if (this.notifications.metadata?.hasNext) {
        const response = await notificationsService.fetchMyNotifications(
          ++this.notifications.metadata.page // Next page
        );

        this.notifications.data.push(...response.data);
        this.notifications.metadata = response.metadata;
        return true;
      }

      return false;
    },

    unreadNotificationsCountUpdatedHandler(response) {
      this.unreadNotificationsCount = response.unreadNotificationsCount;
    },
  },
});
