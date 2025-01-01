<template>
  <div class="p-6 border-b border-gray-200">
    <div class="grid grid-cols-4 gap-4">
      <slot></slot>
    </div>
    <div class="mt-4 flex justify-end space-x-3">
      <button
        @click="$emit('search')"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        搜索
      </button>
      <button
        @click="$emit('reset')"
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        重置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SearchSection'
})

defineEmits<{
  (e: 'search'): void
  (e: 'reset'): void
}>()
</script> 