<script setup>
import { useDisplay } from "vuetify";

const { xs } = useDisplay();

const loadMoreNotifications = async ({ done }) => {
  done("empty");
};
</script>

<template>
  <VMenu width="300">
    <!--Activator-->
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        icon="mdi-bell-outline"
        :density="xs ? 'comfortable' : 'default'"
        class="mx-1"
      ></VBtn>
    </template>

    <!--Content-->
    <VSheet height="">
      <p class="mx-4 my-2" style="font-weight: bold">Notifications</p>
      <VDivider />

      <VInfiniteScroll height="300" @load="loadMoreNotifications" empty-text="">
      </VInfiniteScroll>
    </VSheet>
  </VMenu>
</template>
