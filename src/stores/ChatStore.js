import chatsService from "@/api/services/chatsService";
import signalrClient from "@/api/signalrClient";
import { defineStore } from "pinia";
import { useAuthStore } from "./AuthStore";

export const useChatStore = defineStore("chat", {
  state: () => ({
    chat: null,
    messages: { data: [], metadata: null },
    loading: false,
  }),

  getters: {
    chatOpened() {
      return this.chat !== null;
    },
  },

  actions: {
    async create(receiverId) {
      this.chat = await chatsService.intiateChat(receiverId);
      await this.load(this.chat);
    },

    async load(chat) {
      try {
        this.loading = true;
        await this.unload(); // Unload the currently opened chat if exist to stop receiving messages from it

        this.chat = chat;
        [this.messages] = await Promise.all([
          chatsService.fetchChatMessages(this.chat.id, 1, 20),
          signalrClient.joinChatRoom(this.chat.id),
        ]);

        this.messages.data.reverse(); // to make the latest message at the end
      } finally {
        this.loading = false;
      }
    },

    async reload() {
      try {
        if (this.chat) {
          this.load(this.chat);
        }
      } catch {
        // Supress the error
      }
    },

    async unload() {
      try {
        if (this.chat?.id) {
          const chatId = this.chat.id;
          this.$reset();
          await signalrClient.leaveChatRoom(chatId);
        }
      } catch {
        // Supress the error
      }
    },

    async loadMoreMessages() {
      if (this.messages.metadata.hasNext) {
        const response = await chatsService.fetchChatMessages(
          this.chat.id,
          ++this.messages.metadata.page, // Next page
          this.messages.metadata.pageSize
        );

        response.data.reverse(); // to make the newer messages at the end
        this.messages.data.unshift(...response.data);
        this.messages.metadata = response.metadata;
        return true;
      }

      return false;
    },

    messageReceivedHandler(message) {
      if (message.chatId === this.chat?.id) {
        this.messages.data.push(message);
        ++this.messages.metadata.pageSize; // To avoid refetching it when fetching more messages in loadMoreMessages()
      }
    },

    messagesSeenHandler() {
      const myId = useAuthStore().user?.id;

      this.messages.data?.forEach((message) => {
        if (message.senderId === myId) {
          message.seen = true;
        }
      });
    },

    UserStatusChangedHandler(status) {
      if (status.userId === this.chat?.participantId) {
        this.chat.isParticipantOnline = status.isOnline;
      }
    },
  },
});
