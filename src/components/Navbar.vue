<script setup>
import ChatsDropDown from "./ChatsDropDown.vue";
import NotificationsDropDown from "./NotificationsDropDown.vue";
import ProfileDropDown from "./ProfileDropDown.vue";

import { useDisplay, useTheme } from "vuetify";

const theme = useTheme();
const { xs } = useDisplay();
</script>

<template>
  <VAppBar class="px-4 px-sm-8" density="comfortable" flat>
    <a href="/">
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
    </a>

    <template #append>
      <template v-if="true">
        <NotificationsDropDown />
        <ChatsDropDown />
        <ProfileDropDown />
      </template>

      <template v-else>
        <VBtn
          color="primary"
          variant="flat"
          size="small"
          append-icon="mdi-login"
          text="Login"
        />
      </template>
    </template>
  </VAppBar>
</template>
