<script setup>
import { ref, useTemplateRef } from "vue";

const emit = defineEmits(["pickedImagesChanged"]);

const fileInput = useTemplateRef("fileInput");
const imagesInBase64 = ref([]);
const images = ref([]);

const openFilePicker = () => {
  fileInput.value.click();
};

const loadPickedImages = (event) => {
  const files = Array.from(event.target.files);

  // Load and encode files into base64 format to use it as a value for src attribute in <img/>
  files.forEach((file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      imagesInBase64.value.push(event.target.result);
      images.value.push(file);
    };

    reader.readAsDataURL(file);
  });

  emit("pickedImagesChanged", images.value);
};

const removeImage = (index) => {
  imagesInBase64.value.splice(index, 1);
  images.value.splice(index, 1);
  emit("pickedImagesChanged", images.value);
};
</script>

<template>
  <div>
    <div class="d-flex align-center w-100 overflow-auto">
      <!--Upload button-->
      <VBtn width="110" height="100" variant="tonal" @click="openFilePicker">
        <VIcon icon="mdi-image-plus" size="50" />
      </VBtn>

      <!--Picked Images Preview-->
      <VImg
        v-for="(image, index) in imagesInBase64"
        :src="image"
        :key="index"
        width="110"
        height="100"
        class="ml-2 position-relative"
        rounded
        inline
        cover
      >
        <!--Remove Image Button-->
        <VBtn
          size="xs"
          class="position-absolute top-0 right-0"
          @click="removeImage(index)"
          tile
        >
          <VIcon icon="mdi-close" />
        </VBtn>
      </VImg>
    </div>

    <!--hidden file input used to open file picker by clicking on the Upload button above-->
    <input
      type="file"
      accept="image/*"
      class="d-none"
      ref="fileInput"
      multiple
      @change="loadPickedImages"
    />
  </div>
</template>
