<script setup>
import defaultProfilePicture from "@/assets/default-profile-sm.png";

defineProps({
  profile: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="my-2 d-flex align-center">
    <!--Profile Picture-->
    <div class="mr-2">
      <RouterLink :to="`profile/${profile?.id}`">
        <VAvatar :image="profile?.profilePictureUrl ?? defaultProfilePicture" />
      </RouterLink>
    </div>

    <!--Username & Rating-->
    <div class="d-flex flex-column">
      <RouterLink
        class="text-caption text-high-emphasis font-weight-bold text-decoration-none"
        :to="`profile/${profile?.id}`"
      >
        {{ profile?.name }}
      </RouterLink>
      <div class="d-flex">
        <VIcon
          v-for="star in 5"
          :icon="star <= profile?.rating ? 'mdi-star' : 'mdi-star-outline'"
          color="yellow-darken-3"
          size="12"
        />
      </div>
    </div>
  </div>
</template>
