<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
        >
          <!-- 背景遮罩 -->
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            @click="handleClose"
          />

          <!-- 对话框 -->
          <div
            class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
          >
            <!-- 标题栏 -->
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">
                    {{ title }}
                  </h3>
                  <div class="mt-4">
                    <slot />
                  </div>
                </div>
              </div>
            </div>

            <!-- 底部按钮 -->
            <div
              v-if="$slots.footer"
              class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
            >
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  defineProps<{
    visible: boolean;
    title: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
  }>();

  const handleClose = () => {
    emit('update:visible', false);
  };
</script>

<style scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
</style>
