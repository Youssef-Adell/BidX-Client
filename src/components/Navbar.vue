<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import ChatsDropDown from "./ChatsDropDown.vue";
import NotificationsDropDown from "./NotificationsDropDown.vue";
import ProfileDropDown from "./ProfileDropDown.vue";
import { useDisplay, useTheme } from "vuetify";

const authStore = useAuthStore();
const theme = useTheme();
const { xs } = useDisplay();
</script>

<template>
  <VAppBar class="px-4 px-sm-8 pt-1" flat>
    <RouterLink to="/">
      <img
        v-if="theme.global.current.value.dark"
        src="@/assets/bidx-logo-fill-white.svg"
        :width="xs ? 90 : 100"
        height="40"
      />
      <img
        v-else
        src="@/assets/bidx-logo-fill-black.svg"
        :width="xs ? 90 : 100"
        height="40"
      />
    </RouterLink>

    <template #append>
      <template v-if="authStore.isLoggedIn">
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
