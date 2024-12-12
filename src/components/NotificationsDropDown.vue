<script setup>
import ChatItem from "./ChatItem.vue";

const loadMoreNotifications = async ({ done }) => {
  done("empty");
};
</script>

<template>
  <VMenu min-width="300" width="350" min-height="300">
    <!--Activator-->
    <template #activator="{ props }">
      <VBadge
        :model-value="false"
        class="mr-2"
        color="error"
        offset-x="8"
        offset-y="6"
        dot
      >
        <VBtn v-bind="props" icon="mdi-bell-outline" density="comfortable" />
      </VBadge>
    </template>

    <!--Content-->
    <VSheet>
      <div class="pl-4 py-2 text-subtitle-2 border-b">Notifications</div>

      <VInfiniteScroll height="320" @load="loadMoreNotifications" empty-text="">
      </VInfiniteScroll>
    </VSheet>
  </VMenu>
</template>
