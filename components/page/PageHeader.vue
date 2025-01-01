<template>
  <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
    <h2 class="text-xl font-medium text-gray-900">{{ title }}</h2>
    <UiButton
      v-if="showAddButton"
      @click="$emit('add')"
      type="primary"
    >
      <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      {{ addButtonText }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'PageHeader'
})

defineProps<{
  title: string
  showAddButton?: boolean
  addButtonText?: string
}>()

defineEmits<{
  (e: 'add'): void
}>()
</script> 