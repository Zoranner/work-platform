<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    label?: string;
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
    rows?: number;
  }>();

  defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();
</script>
