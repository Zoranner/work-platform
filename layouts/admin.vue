<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <AdminHeader />

    <!-- 主要内容区域 -->
    <div class="flex pt-[61px]">
      <!-- 左侧菜单 -->
      <AdminSidebar />

      <!-- 主内容区 -->
      <main class="flex-1 ml-64 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from '~/components/layout/AdminHeader.vue'
import AdminSidebar from '~/components/layout/AdminSidebar.vue'
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style> 