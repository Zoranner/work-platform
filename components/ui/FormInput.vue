<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
      :placeholder="placeholder"
      :disabled="disabled"
    />
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    label?: string;
    modelValue: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
  }>();

  defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();
</script>
