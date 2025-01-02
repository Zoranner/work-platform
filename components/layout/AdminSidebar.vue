<template>
  <aside
    class="w-64 fixed left-0 bottom-0 top-[61px] bg-white border-r border-gray-200 overflow-y-auto"
  >
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
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            ]"
          >
            <IconsHomeIcon class="mr-3 h-6 w-6" />
            工作台
          </NuxtLink>
        </div>

        <!-- 项目管理 -->
        <div class="space-y-1">
          <div class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            项目管理
          </div>
          <NuxtLink
            to="/dashboard/project"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[
              isRouteActive('/project')
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            ]"
          >
            <IconsDocumentIcon class="mr-3 h-6 w-6" />
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
              to="/dashboard/archive/paper"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              :class="[
                isRouteActive('/archive/paper')
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              ]"
            >
              <IconsDocumentIcon class="mr-3 h-6 w-6" />
              <span class="truncate">纸质档案</span>
            </NuxtLink>
            <NuxtLink
              to="/dashboard/archive/disk"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              :class="[
                isRouteActive('/archive/disk')
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              ]"
            >
              <IconsDeviceIcon class="mr-3 h-6 w-6" />
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
            to="/dashboard/asset/device"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[
              isRouteActive('/asset/device')
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            ]"
          >
            <IconsDeviceIcon class="mr-3 h-6 w-6" />
            设备管理
          </NuxtLink>
          <NuxtLink
            to="/dashboard/asset/category"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[
              isRouteActive('/asset/category')
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            ]"
          >
            <IconsTagIcon class="mr-3 h-6 w-6" />
            类目管理
          </NuxtLink>
        </div>

        <!-- 系统管理（仅管理员可见） -->
        <div v-if="authStore.currentUser?.role === 'admin'" class="space-y-1">
          <div class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            系统管理
          </div>
          <NuxtLink
            to="/dashboard/system/user"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[
              isRouteActive('/system/user')
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            ]"
          >
            <IconsUserGroupIcon class="mr-3 h-6 w-6" />
            用户管理
          </NuxtLink>
          <NuxtLink
            to="/dashboard/system/organization"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[
              isRouteActive('/system/organization')
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            ]"
          >
            <IconsBuildingIcon class="mr-3 h-6 w-6" />
            组织管理
          </NuxtLink>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import { useAuthStore } from '~/stores/auth';

  const route = useRoute();
  const authStore = useAuthStore();

  // 判断路由是否激活
  const isRouteActive = (path: string) => {
    return route.path.startsWith(path);
  };
</script>
