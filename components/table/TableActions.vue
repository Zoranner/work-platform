<template>
  <div class="space-x-2">
    <Button
      v-for="action in actions"
      :key="action.key"
      :type="action.type"
      :size="size"
      @click="action.onClick"
    >
      {{ action.text }}
    </Button>
  </div>
</template>

<script setup lang="ts">
  import Button from '~/components/ui/Button.vue';

  interface Action {
    key: string;
    text: string;
    type?: 'primary' | 'danger' | 'secondary' | 'warning' | 'success';
    onClick: () => void;
  }

  defineProps<{
    actions: Action[];
    size?: 'sm' | 'md' | 'lg';
  }>();
</script>
