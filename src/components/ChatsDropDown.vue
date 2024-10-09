<script setup>
import { useDisplay } from "vuetify";

const { xs } = useDisplay();

const loadMoreChats = async ({ done }) => {
  done("empty");
};
</script>

<template>
  <VMenu width="300">
    <!--Activator-->
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        icon="mdi-forum-outline"
        :density="xs ? 'comfortable' : 'default'"
        class="ml-1 mr-4"
      ></VBtn>
    </template>

    <!--Content-->
    <VSheet>
      <p class="mx-4 my-2" style="font-weight: bold">Chats</p>
      <VDivider />

      <VInfiniteScroll height="300" @load="loadMoreChats" empty-text="">
      </VInfiniteScroll>
    </VSheet>
  </VMenu>
</template>
