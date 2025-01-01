<script setup lang="ts">
interface Props {
  title: string
  showBack?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showBack: false,
  loading: false
})

const router = useRouter()

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题和操作按钮 -->
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <button
          v-if="showBack"
          @click="handleBack"
          class="text-gray-600 hover:text-gray-900"
        >
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <h2 class="text-xl font-semibold text-gray-800">{{ title }}</h2>
      </div>
      <div class="flex items-center space-x-2">
        <slot name="actions" />
      </div>
    </div>

    <!-- 加载状态 -->
    <template v-if="loading">
      <div class="flex items-center justify-center py-12">
        <svg
          class="animate-spin h-8 w-8 text-primary-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template> 