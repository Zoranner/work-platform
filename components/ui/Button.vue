<script setup lang="ts">
  interface Props {
    type?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    block: false,
  });

  const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
  }>();

  const handleClick = (event: MouseEvent) => {
    if (!props.disabled && !props.loading) {
      emit('click', event);
    }
  };

  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';

  const typeClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const computedClasses = computed(() => {
    return [
      baseClasses,
      typeClasses[props.type],
      sizeClasses[props.size],
      props.block ? 'w-full' : '',
      props.disabled ? 'opacity-50 cursor-not-allowed' : '',
      props.loading ? 'cursor-wait' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
</script>

<template>
  <button :class="computedClasses" :disabled="disabled || loading" @click="handleClick">
    <template v-if="loading">
      <IconsLoadingIcon class="-ml-1 mr-2 h-4 w-4" />
    </template>
    <slot />
  </button>
</template>
