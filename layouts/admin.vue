<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 顶部导航栏 -->
    <AdminHeader />

    <!-- 主要内容区域 -->
    <div class="flex pt-[61px]">
      <!-- 左侧菜单 -->
      <AdminSidebar />

      <!-- 主内容区 -->
      <main class="flex-1 ml-64">
        <div class="py-6 px-4 sm:px-6 lg:px-8">
          <div class="max-w-7xl mx-auto">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AdminHeader from '~/components/layout/AdminHeader.vue';
  import AdminSidebar from '~/components/layout/AdminSidebar.vue';
</script>
