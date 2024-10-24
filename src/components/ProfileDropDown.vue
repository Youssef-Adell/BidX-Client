<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { computed, ref } from "vue";
import { useDisplay, useTheme } from "vuetify";
import defaultProfilePicture from "@/assets/default-profile-sm.png";

const authStore = useAuthStore();
const { xs } = useDisplay();
const theme = useTheme();

const isDarkThemeEnabled = ref(theme.global.current.value.dark);

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  isDarkThemeEnabled.value = theme.global.current.value.dark;
  localStorage.setItem("selectedTheme", theme.global.name.value);
};

const profilePicture = computed(() => {
  return authStore.user.profilePictureUrl ?? defaultProfilePicture;
});
</script>

<template>
  <VMenu width="300">
    <template #activator="{ props }">
      <VBtn icon v-bind="props" :density="xs ? 'comfortable' : 'default'">
        <VAvatar
          :image="profilePicture"
          :density="xs ? 'comfortable' : 'default'"
        />
      </VBtn>
    </template>

    <!--List of Options-->
    <VList>
      <VListItem
        @click=""
        :prepend-avatar="profilePicture"
        :title="`${authStore.user.firstName} ${authStore.user.lastName}`"
        :subtitle="authStore.user.email"
        append-icon="mdi-open-in-new"
        class="py-3"
      />
      <VDivider class="mb-2" />

      <VListItem @click="toggleTheme">
        <v-switch
          true-icon="mdi-weather-night"
          false-icon="mdi-white-balance-sunny"
          v-model="isDarkThemeEnabled"
          color="primary"
          label="Dark Mode"
          hide-spin-buttons
          hide-details
        />
      </VListItem>
      <VListItem @click="" prepend-icon="mdi-cog" title="Settings" />
      <VListItem
        @click="authStore.logout"
        prepend-icon="mdi-logout"
        title="Logout"
      />
    </VList>
  </VMenu>
</template>
