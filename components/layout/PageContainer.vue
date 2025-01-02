<template>
  <div class="space-y-6">
    <!-- 页面标题和操作按钮 -->
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <UiButton v-if="showBack" @click="handleBack" type="secondary" size="sm">
          <ArrowLeftIcon class="h-5 w-5" />
        </UiButton>
        <h2 class="text-xl font-semibold text-gray-800">{{ title }}</h2>
      </div>
      <div class="flex items-center space-x-2">
        <slot name="actions" />
      </div>
    </div>

    <!-- 加载状态 -->
    <template v-if="loading">
      <div class="flex items-center justify-center py-12">
        <LoadingIcon class="h-8 w-8 text-primary-600" />
      </div>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script setup lang="ts">
import LoadingIcon from '~/components/icons/LoadingIcon.vue';
import ArrowLeftIcon from '~/components/icons/ArrowLeftIcon.vue';

interface Props {
  title: string;
  showBack?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showBack: false,
  loading: false,
});

const router = useRouter();

const handleBack = () => {
  router.back();
};
</script>
