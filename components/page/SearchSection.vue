<template>
  <div class="p-6 border-b border-gray-200">
    <div class="grid grid-cols-4 gap-4">
      <slot></slot>
    </div>
    <div class="mt-4 flex justify-end space-x-3">
      <UiButton @click="$emit('search')" type="primary">
        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        搜索
      </UiButton>
      <UiButton @click="$emit('reset')" type="secondary">
        重置
      </UiButton>
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