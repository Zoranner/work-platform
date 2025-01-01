<template>
  <div>
    <!-- 这里可以放一个加载动画 -->
    <div class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 在组件挂载时检查登录状态并重定向
onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
})
</script> 