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
    @update:model-value="(isMenuOpen) => isMenuOpen && chatsStore.load()"
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
        <div v-if="chatsStore.loading" class="d-flex justify-center">
          <VProgressCircular color="primary" indeterminate />
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
