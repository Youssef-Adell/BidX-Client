import chatsService from "@/api/services/chatsService";
import { defineStore } from "pinia";

export const useChatsStore = defineStore("chats", {
  state: () => ({
    chats: { data: [], metadata: null },
    unreadChatsCount: 0,
    loading: false,
  }),

  getters:{
    hasUnreadChats(){
      return this.unreadChatsCount > 0;
    },
    hasMoreChats(){
      return this.chats.metadata?.hasNext;
    }
  },

  actions: {
    async load() {
      try {
        this.loading = true;
        this.chats = await chatsService.fetchMyChats(1, 10);
      } finally {
        this.loading = false;
      }
    },

    async loadMoreChats() {
      if (this.chats.metadata?.hasNext) {
        const response = await chatsService.fetchMyChats(
          ++this.chats.metadata.page // Next page
        );

        this.chats.data.push(...response.data);
        this.chats.metadata = response.metadata;
        return true;
      }

      return false;
    },

    unreadChatsCountUpdatedHandler(response) {
      this.unreadChatsCount = response.unreadChatsCount;
    },
  },
});
