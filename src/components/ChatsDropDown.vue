<script setup>
import ChatItem from "./ChatItem.vue";
import { onBeforeMount } from "vue";
import { useChatsStore } from "@/stores/ChatsStore";
import { useDisplay } from "vuetify";

const { xs } = useDisplay();
const chatsStore = useChatsStore();

const loadMoreChats = async ({ done }) => {
  try {
    const isLoaded = await chatsStore.loadMoreChats();
    done(isLoaded ? "ok" : "empty");
  } catch {
    done("error");
  }
};

const handleMenuUpdate = (isMenuOpen) => {
  if (isMenuOpen) {
    chatsStore.gotNewMessage = false; // To hide the badge
    chatsStore.load();
  }
};

onBeforeMount(async () => {
  try {
    await chatsStore.load();
  } catch {
    // Supress the error
  }
});
</script>

<template>
  <VMenu
    min-width="300"
    :width="xs ? '100%' : '350'"
    min-height="300"
    @update:model-value="handleMenuUpdate"
  >
    <!--Activator-->
    <template #activator="{ props }">
      <VBadge
        :model-value="chatsStore.gotNewMessage"
        class="mr-4"
        color="error"
        offset-x="5"
        offset-y="6"
        dot
      >
        <VBtn v-bind="props" icon="mdi-forum-outline" density="comfortable" />
      </VBadge>
    </template>

    <!--Content-->
    <VSheet>
      <div class="pl-4 py-2 text-subtitle-2 border-b">Chats</div>

      <VInfiniteScroll height="320" @load="loadMoreChats" empty-text="">
        <div v-if="chatsStore.loading">
          <VSkeletonLoader v-for="i in 4" type="list-item-avatar-two-line" />
        </div>

        <ChatItem
          v-else
          v-for="chat in chatsStore.chats.data"
          :key="chat.id"
          :chat="chat"
        />
      </VInfiniteScroll>
    </VSheet>
  </VMenu>
</template>
