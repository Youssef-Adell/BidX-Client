<script setup>
import NotificationItem from "./NotificationItem.vue";
import { onBeforeMount } from "vue";
import { useNotificationsStore } from "@/stores/NotificationsStore";
import { useDisplay } from "vuetify";

const { xs } = useDisplay();
const notificationsStore = useNotificationsStore();

const loadMoreNotifications = async ({ done }) => {
  try {
    const isLoaded = await notificationsStore.loadMoreNotifications();
    done(isLoaded ? "ok" : "empty");
  } catch {
    done("error");
  }
};

const handleMenuUpdate = (isMenuOpen) => {
  if (isMenuOpen) {
    notificationsStore.gotNewMessage = false; // To hide the badge
    notificationsStore.load();
  }
};

onBeforeMount(async () => {
  try {
    await notificationsStore.load();
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
        :model-value="notificationsStore.hasUnreadNotifications"
        :content="notificationsStore.unreadNotificationsCount"
        class="mr-2"
        color="error"
        offset-x="5"
        offset-y="6"
      >
        <VBtn v-bind="props" icon="mdi-bell-outline" density="comfortable" />
      </VBadge>
    </template>

    <!--Content-->
    <VSheet>
      <div class="pl-4 py-2 text-subtitle-2 border-b">Notifications</div>

      <VInfiniteScroll height="320" @load="loadMoreNotifications" empty-text="">
        <div v-if="notificationsStore.loading">
          <VSkeletonLoader v-for="i in 4" type="list-item-avatar-two-line" />
        </div>

        <NotificationItem
          v-else
          v-for="notification in notificationsStore.notifications.data"
          :key="notification.id"
          :notification="notification"
        />
      </VInfiniteScroll>
    </VSheet>
  </VMenu>
</template>
