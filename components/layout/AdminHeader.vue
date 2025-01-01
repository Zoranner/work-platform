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
        <button class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        <!-- 用户头像和下拉菜单 -->
        <div class="relative" @click="toggleUserMenu" v-click-outside="closeUserMenu">
          <button class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
            <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
              {{ authStore.currentUser?.name?.[0] || 'U' }}
            </div>
            <span class="text-sm font-medium text-gray-700">{{ authStore.currentUser?.name || '用户' }}</span>
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- 用户菜单 -->
          <div v-show="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">个人设置</a>
            <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// 用户菜单控制
const showUserMenu = ref(false)
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}
const closeUserMenu = () => {
  showUserMenu.value = false
}

// 退出登录
const handleLogout = async () => {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}
</script> 