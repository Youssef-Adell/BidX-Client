<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { useDisplay, useTheme } from "vuetify";
import { computed } from "vue";
import NotificationsDropdown from "./NotificationsDropDown.vue";
import ChatsDropdown from "./ChatsDropDown.vue";
import ProfileDropdown from "./ProfileDropDown.vue";
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
  <VAppBar class="pl-4 pl-sm-8 pr-3 pr-sm-6 pt-1" flat>
    <RouterLink to="/">
      <img :src="logo" :width="xs ? 90 : 100" height="40" />
    </RouterLink>

    <template #append>
      <VBtn
        icon="mdi-magnify"
        to="/search"
        density="comfortable"
        :class="authStore.isLoggedIn ? 'mr-2' : 'mr-4'"
        :active="false"
      />

      <template v-if="authStore.loading">
        <VSkeletonLoader :type="smAndUp ? 'avatar,avatar,avatar' : ''" />
      </template>

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
