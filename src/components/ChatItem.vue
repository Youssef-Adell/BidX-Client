<script setup>
import defaultProfilePicture from "@/assets/default-profile-sm.png";
import { useChatStore } from "@/stores/ChatStore";
import { computed } from "vue";

const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
});

const chatStore = useChatStore();

const senderProfilePicture = computed(() => {
  return props.chat?.participantProfilePictureUrl ?? defaultProfilePicture;
});

const lastMessage = computed(() => {
  return props.chat.lastMessage.length > 20
    ? `${props.chat.lastMessage.substring(0, 20)}...`
    : props.chat.lastMessage;
});

const openChat = async () => {
  try {
    await chatStore.load(props.chat);
    props.chat.hasUnseenMessages = false;
  } catch {
    // Supress the error
  }
};
</script>

<template>
  <VListItem
    @click="openChat"
    class="pa-2 mx-1 mb-1"
    :active="chat.hasUnseenMessages"
    rounded
  >
    <template #prepend>
      <VAvatar :image="senderProfilePicture" size="x-large" />
    </template>

    <template #title>
      <span class="text-high-emphasis">
        {{ chat.participantName }}
      </span>
    </template>

    <template #subtitle>
      {{ lastMessage }}
    </template>

    <template #append v-if="chat.hasUnseenMessages">
      <VIcon icon="mdi-circle-medium" color="error" size="large" />
    </template>
  </VListItem>
</template>
