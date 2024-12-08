<script setup>
import ChatItem from "./ChatItem.vue";
import { onBeforeMount } from "vue";
import { useDisplay } from "vuetify";
import { useChatsStore } from "@/stores/ChatsStore";

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
    width="350"
    min-height="300"
    @update:model-value="(isMenuOpen) => isMenuOpen && chatsStore.reload()"
  >
    <!--Activator-->
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        icon="mdi-forum-outline"
        class="ml-1 mr-4"
        :density="xs ? 'comfortable' : 'default'"
      />
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
