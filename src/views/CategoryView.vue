<script setup>
import { reactive, onBeforeMount, ref } from "vue";
import { useDisplay } from "vuetify";
import { useRoute } from "vue-router";
import categoriesService from "@/api/services/categoriesService";
import AuctionsCatalog from "@/components/AuctionsCatalog.vue";

const { xs } = useDisplay();
const route = useRoute();

const category = reactive({
  id: Number(route.params.id),
  name: null,
  iconUrl: null,
});

const loading = ref(true);

const initialFilters = {
  categoryId: category.id,
};

onBeforeMount(async () => {
  try {
    const { name, iconUrl } = await categoriesService.fetchCategory(
      category.id
    );
    category.name = name;
    category.iconUrl = iconUrl;
  } catch {
    // Supress the error
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <VContainer>
    <AuctionsCatalog :initial-filters="initialFilters" disable-category-filter>
      <template #title>
        <VSkeletonLoader
          :loading="loading"
          type="subtitle"
          class="bg-background d-flex align-center ga-2"
          width="250px"
        >
          <RouterLink to="/" class="text-text" replace>
            <VIcon icon="mdi-chevron-left" />
          </RouterLink>
          <img
            :src="category.iconUrl"
            width="40px"
            height="40px"
            class="bg-surface pa-1 rounded"
          />
          <h2 :class="xs ? 'text-h6' : 'text-h5'">
            {{ category.name }}
          </h2>
        </VSkeletonLoader>
      </template>
    </AuctionsCatalog>
  </VContainer>
</template>
