<template>
  <Card padding>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <slot />
    </div>
    <div class="mt-4 flex justify-end space-x-2">
      <Button type="primary" @click="$emit('search')">搜索</Button>
      <Button @click="$emit('reset')">重置</Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
  import Card from '~/components/ui/Card.vue';
  import Button from '~/components/ui/Button.vue';

  defineEmits<{
    (e: 'search'): void;
    (e: 'reset'): void;
  }>();
</script>
