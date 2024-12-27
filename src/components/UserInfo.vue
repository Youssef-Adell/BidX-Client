<script setup>
import defaultProfilePicture from "@/assets/default-profile-sm.png";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <section class="d-flex flex-column align-center">
    <VImg
      :src="user.profilePictureUrl ?? defaultProfilePicture"
      class="border-md rounded-circle"
      width="130px"
      height="130px"
      alt="Profile Picture"
    />

    <h1 class="text-h5 font-weight-medium text-high-emphasis mt-2">
      {{ user.firstName }} {{ user.lastName }}
    </h1>
    <VRating
      :model-value="user.rating"
      density="compact"
      size="small"
      color="yellow-darken-3"
      readonly
    />
  </section>
</template>
