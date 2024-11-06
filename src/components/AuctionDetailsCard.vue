<script setup>
import AuctionCountdown from "@/components/AuctionCountdown.vue";
import UserProfileSummary from "@/components/UserProfileSummary.vue";
import { formatDate } from "@/utils/dateTimeUtils";
import { useDisplay } from "vuetify";

defineProps({
  auction: {
    type: Object,
    required: true,
  },
});

const { smAndDown } = useDisplay();
</script>

<template>
  <VSheet class="w-100" elevation="4" rounded>
    <VRow no-gutters>
      <!--Auction Images-->
      <VCol cols="12" md="6">
        <VCarousel
          show-arrows="hover"
          height="auto"
          :class="['rounded', smAndDown ? 'rounded-b-0' : 'rounded-e-0']"
          hide-delimiter-background
        >
          <VCarouselItem
            v-for="(image, i) in auction?.images"
            :key="i"
            :src="image"
          />
        </VCarousel>
      </VCol>

      <!--Auction Details-->
      <VCol cols="12" md="6" class="pa-5">
        <section>
          <h1 class="text-h6 text-sm-h5 text-high-emphasis">
            {{ auction?.productName }}
          </h1>

          <!--Creator & CurrentPrice-->
          <section class="d-flex justify-space-between align-center mt-2">
            <UserProfileSummary :profile="auction?.auctioneer" />
            <div
              class="px-2 py-1 rounded border bg-primary text-caption font-weight-bold"
            >
              {{ `${auction?.currentPrice} EGP` }}
            </div>
          </section>

          <!--Details-->
          <section class="mt-4">
            <h2 class="text-subtitle-2 text-high-emphasis">Details</h2>
            <VTable density="compact" class="text-body-2">
              <tbody>
                <tr>
                  <td class="pl-0">Condition</td>
                  <td>{{ auction?.productCondition }}</td>
                </tr>
                <tr>
                  <td class="pl-0">Category</td>
                  <td>{{ auction?.category }}</td>
                </tr>
                <tr>
                  <td class="pl-0">City</td>
                  <td>{{ auction?.city }}</td>
                </tr>
                <tr>
                  <td class="pl-0">Posted at</td>
                  <td>
                    {{ formatDate(auction?.startTime) }}
                  </td>
                </tr>
              </tbody>
            </VTable>
          </section>

          <!--Description-->
          <section class="mt-4">
            <h2 class="text-subtitle-2 text-high-emphasis">Description</h2>
            <p class="text-body-2">
              {{ auction?.productDescription }}
            </p>
          </section>

          <!--Auction Ending-->
          <section class="mt-4">
            <h2 class="text-subtitle-2 text-high-emphasis">Auction Ends in</h2>
            <AuctionCountdown class="mt-2" :endtime="auction?.endTime" />
          </section>
        </section>
      </VCol>
    </VRow>
  </VSheet>
</template>
