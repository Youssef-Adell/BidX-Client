<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import ChatsDropDown from "./ChatsDropDown.vue";
import NotificationsDropDown from "./NotificationsDropDown.vue";
import ProfileDropDown from "./ProfileDropDown.vue";
import { useDisplay, useTheme } from "vuetify";
import whiteLogo from "@/assets/bidx-logo-fill-white.svg";
import blackLogo from "@/assets/bidx-logo-fill-black.svg";

const authStore = useAuthStore();
const theme = useTheme();
const { xs, smAndUp } = useDisplay();
</script>

<template>
  <VAppBar class="px-4 px-sm-8 pt-1" flat>
    <RouterLink to="/">
      <img
        :src="theme.global.current.value.dark ? whiteLogo : blackLogo"
        :width="xs ? 90 : 100"
        height="40"
      />
    </RouterLink>

    <template #append>
      <VSkeletonLoader
        v-if="authStore.loading"
        :type="smAndUp ? 'avatar,avatar,avatar' : ''"
        class="custom-avatar"
      />

      <template v-else-if="authStore.isLoggedIn">
        <NotificationsDropDown />
        <ChatsDropDown />
        <ProfileDropDown />
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

<style scoped>
.custom-avatar .v-skeleton-loader__avatar {
  width: 10px; /* Set your desired size */
  height: 10px;
}
</style>
