<template>
  <header class="bg-white shadow-sm fixed w-full top-0 z-10">
    <div class="flex items-center justify-between px-4 py-3">
      <!-- 左侧 Logo 和标题 -->
      <div class="flex items-center space-x-3">
        <div class="text-2xl font-bold text-primary-600">WorkPlatform</div>
      </div>

      <!-- 右侧用户信息和操作 -->
      <div class="flex items-center space-x-4">
        <!-- 通知铃铛 -->
        <UiButton type="secondary" size="sm" class="!p-2">
          <IconsBellIcon class="w-6 h-6" />
        </UiButton>

        <!-- 用户头像和下拉菜单 -->
        <div class="relative" @click="toggleUserMenu" v-click-outside="closeUserMenu">
          <button class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
            <div
              class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold"
            >
              {{ authStore.currentUser?.name?.[0] || 'U' }}
            </div>
            <span class="text-sm font-medium text-gray-700">{{
              authStore.currentUser?.name || '用户'
            }}</span>
            <IconsChevronDownIcon class="w-4 h-4 text-gray-500" />
          </button>

          <!-- 用户菜单 -->
          <div
            v-show="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
          >
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">个人设置</a>
            <UiButton
              @click="handleLogout"
              type="danger"
              size="sm"
              class="w-full !justify-start !rounded-none !shadow-none"
            >
              退出登录
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useAuthStore } from '~/stores/auth';

  const authStore = useAuthStore();

  // 用户菜单控制
  const showUserMenu = ref(false);
  const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value;
  };
  const closeUserMenu = () => {
    showUserMenu.value = false;
  };

  // 退出登录
  const handleLogout = async () => {
    try {
      await authStore.logout();
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };
</script>
