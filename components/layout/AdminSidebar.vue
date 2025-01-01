<template>
  <aside class="w-64 fixed left-0 bottom-0 top-[61px] bg-white border-r border-gray-200 overflow-y-auto">
    <nav class="mt-4 px-4">
      <div class="space-y-8">
        <!-- 工作台 -->
        <div>
          <NuxtLink
            to="/dashboard"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[
              isRouteActive('/dashboard')
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            工作台
          </NuxtLink>
        </div>

        <!-- 项目管理 -->
        <div class="space-y-1">
          <div class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            项目管理
          </div>
          <NuxtLink
            to="/project"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[
              isRouteActive('/project')
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8h10M7 15h10" />
            </svg>
            项目管理
          </NuxtLink>
        </div>

        <!-- 档案管理 -->
        <div class="space-y-1">
          <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            档案管理
          </h3>
          <div class="space-y-1">
            <NuxtLink
              to="/archive/paper"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              :class="[
                isRouteActive('/archive/paper')
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              <span class="truncate">纸质档案</span>
            </NuxtLink>
            <NuxtLink
              to="/archive/disk"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              :class="[
                isRouteActive('/archive/disk')
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span class="truncate">光盘档案</span>
            </NuxtLink>
          </div>
        </div>

        <!-- 资产管理 -->
        <div class="space-y-1">
          <div class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            资产管理
          </div>
          <NuxtLink
            to="/asset/device"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[
              isRouteActive('/asset/device')
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            设备管理
          </NuxtLink>
          <NuxtLink
            to="/asset/category"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[
              isRouteActive('/asset/category')
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            类目管理
          </NuxtLink>
        </div>

        <!-- 系统管理（仅管理员可见） -->
        <div v-if="authStore.currentUser?.role === 'admin'" class="space-y-1">
          <div class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            系统管理
          </div>
          <NuxtLink
            to="/system/user"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[
              isRouteActive('/system/user')
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            用户管理
          </NuxtLink>
          <NuxtLink
            to="/system/organization"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[
              isRouteActive('/system/organization')
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            组织管理
          </NuxtLink>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

// 判断路由是否激活
const isRouteActive = (path: string) => {
  return route.path.startsWith(path)
}
</script> 