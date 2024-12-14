<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { useDisplay, useTheme } from "vuetify";
import { computed } from "vue";
import ChatsDropdown from "./ChatsDropdown.vue";
import NotificationsDropdown from "./NotificationsDropdown.vue";
import ProfileDropdown from "./ProfileDropdown.vue";
import whiteLogo from "@/assets/bidx-logo-fill-white.svg";
import blackLogo from "@/assets/bidx-logo-fill-black.svg";

const authStore = useAuthStore();
const theme = useTheme();
const { xs, smAndUp } = useDisplay();

const logo = computed(() => {
  return theme.global.current.value.dark ? whiteLogo : blackLogo;
});
</script>

<template>
  <VAppBar class="px-4 px-sm-8 pt-1" flat>
    <RouterLink to="/">
      <img :src="logo" :width="xs ? 90 : 100" height="40" />
    </RouterLink>

    <template #append>
      <VSkeletonLoader
        v-if="authStore.loading"
        :type="smAndUp ? 'avatar,avatar,avatar' : ''"
      />

      <template v-else-if="authStore.isLoggedIn">
        <NotificationsDropdown />
        <ChatsDropdown />
        <ProfileDropdown />
      </template>

      <template v-else>
        <VBtn
          color="primary"
          variant="flat"
          :size="xs ? 'small' : 'default'"
          append-icon="mdi-login"
          text="Login"
          to="/login"
        />
      </template>
    </template>
  </VAppBar>
</template>
