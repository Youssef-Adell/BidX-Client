<script setup>
import Message from "./Message.vue";
import { computed, nextTick, ref, watch } from "vue";
import { useDisplay, useGoTo } from "vuetify";
import { useChatStore } from "@/stores/ChatStore";
import signalrClient from "@/api/signalrClient";
import defaultProfilePicture from "@/assets/default-profile-sm.png";

const goTo = useGoTo();
const { smAndDown } = useDisplay();
const chatStore = useChatStore();
const inputMessage = ref("");

const receiverProfilePicture = computed(() => {
  return chatStore.chat?.participantProfilePictureUrl ?? defaultProfilePicture;
});

const isReceiverOnline = computed(() => {
  return chatStore.chat?.isParticipantOnline;
});

// Scroll to the bottom of the chat when a new message added
watch(
  () => chatStore.messages.data,
  async (newValue, oldValue) => {
    await nextTick(); // Ensure DOM updates first
    goTo("#last-message", { container: "#messages-container" });
  },
  { deep: 1 }
);

const loadMoreMessages = async ({ done }) => {
  try {
    const isLoaded = await chatStore.loadMoreMessages();
    done(isLoaded ? "ok" : "empty");
  } catch {
    done("error");
  }
};

const send = async () => {
  if (inputMessage.value.trim().length > 0) {
    try {
      await signalrClient.sendMessage(chatStore.chat?.id, inputMessage.value);
      inputMessage.value = "";
    } catch {
      // Supress the error
    }
  }
};
</script>

<template>
  <VSheet
    :class="['chatbox', { 'chatbox-mobile': smAndDown }]"
    elevation="4"
    rounded
    border
  >
    <!--Chat Header-->
    <div class="chatbox-header">
      <!--Receiver Data-->
      <div class="d-flex ga-2 align-center">
        <VAvatar :image="receiverProfilePicture" />

        <div class="d-flex flex-column justify-start">
          <RouterLink
            class="ma-0 text-body-2 text-text"
            :to="`profile/${chatStore.chat?.participantId}`"
          >
            {{ chatStore.chat?.participantName }}
          </RouterLink>
          <div
            :class="[
              'd-flex align-center ga-1 text-caption',
              isReceiverOnline ? 'text-success' : 'text-secondary',
            ]"
          >
            <VIcon icon="mdi-circle" size="8" />
            {{ isReceiverOnline ? "online" : "offline" }}
          </div>
        </div>
      </div>

      <!--Close Button-->
      <VBtn
        icon="mdi-close"
        size="sm"
        variant="plain"
        :ripple="false"
        @click="chatStore.unload"
      />
    </div>

    <!--Chat Body-->
    <div class="chatbox-body border-t border-b">
      <VInfiniteScroll
        id="messages-container"
        side="start"
        class="px-2"
        empty-text=""
        @load="loadMoreMessages"
      >
        <template
          v-for="(message, idx) in chatStore.messages.data"
          :key="message.id"
        >
          <Message
            :id="
              idx === chatStore.messages.data.length - 1 ? 'last-message' : ''
            "
            :message="message"
          />
        </template>
      </VInfiniteScroll>
    </div>

    <!--Chat footer-->
    <VForm class="chatbox-footer" @submit.prevent="send">
      <input
        v-model="inputMessage"
        type="text"
        placeholder="Type your message here.."
        class="w-100 h-100 outline-none"
      />
      <VBtn
        icon="mdi-send"
        type="submit"
        variant="plain"
        density="comfortable"
        :ripple="false"
      />
    </VForm>
  </VSheet>
</template>

<style scoped>
.chatbox {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  right: 20px;
  height: 400px;
  width: 330px;
  z-index: 99999;
}

.chatbox-mobile {
  height: 100dvh;
  width: auto;
  left: 0;
  right: 0;
}

.chatbox-header {
  justify-self: start;
  display: flex;
  justify-content: space-between;
  padding: 8px;
}

.chatbox-header a {
  margin-left: 5px;
  margin-right: 2px;
  font-weight: 500;
  text-decoration: none;
}

.chatbox-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.chatbox-footer {
  justify-self: end;
  display: flex;
  justify-content: space-between;
  align-items: end;
  padding: 4px 8px 8px 8px;
}

.outline-none {
  outline: none;
}
</style>
