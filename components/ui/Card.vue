<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div v-if="$slots.header" class="p-6 border-b border-gray-200">
      <slot name="header" />
    </div>
    <div :class="[padding ? 'p-6' : '', $slots.header ? '' : 'rounded-t-lg']">
      <slot />
    </div>
    <div v-if="$slots.footer" class="p-6 border-t border-gray-200">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    padding?: boolean;
  }>();
</script>
