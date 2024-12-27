<script setup>
import { onBeforeMount, ref } from "vue";
import defaultProfilePicture from "@/assets/default-profile-sm.png";
import usersService from "@/api/services/usersService";

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});

const loading = ref(false);
const user = ref({
  firstName: null,
  lastName: null,
  profilePictureUrl: null,
  rating: null,
});

onBeforeMount(async () => {
  try {
    loading.value = true;
    user.value = await usersService.fetchUserProfile(props.userId);

    if (!user.value.profilePictureUrl)
      user.value.profilePictureUrl = defaultProfilePicture;
  } catch {
    // Supress the error
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="d-flex flex-column align-center">
    <VImg
      :src="user.profilePictureUrl"
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
