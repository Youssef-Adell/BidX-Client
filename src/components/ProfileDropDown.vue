<script setup>
import defaultProfilePicture from "@/assets/default-profile-sm.png";
import { useAuthStore } from "@/stores/AuthStore";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useDisplay, useTheme } from "vuetify";

const authStore = useAuthStore();
const router = useRouter();
const { xs } = useDisplay();
const theme = useTheme();

const profilePicture = computed(() => {
  return authStore.user.profilePictureUrl ?? defaultProfilePicture;
});

const isDarkThemeEnabled = computed(() => {
  return theme.global.current.value.dark;
});

const toggleTheme = () => {
  theme.global.name.value = isDarkThemeEnabled.value ? "light" : "dark";
  localStorage.setItem("selectedTheme", theme.global.name.value);
};

const logout = async () => {
  await authStore.logout();
  router.push("/");
};
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
      <VListItem @click="logout" prepend-icon="mdi-logout" title="Logout" />
    </VList>
  </VMenu>
</template>
