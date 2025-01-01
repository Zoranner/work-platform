<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)

// 不需要登录就能访问的路由
const publicRoutes = ['/login', '/auth/callback']

// 初始化认证状态
onMounted(() => {
  authStore.initAuth()
})

// 监听路由变化，检查登录状态
watchEffect(() => {
  const currentPath = route.path
  
  // 如果当前路由不是公开路由，且用户未登录，则跳转到登录页
  if (!publicRoutes.includes(currentPath) && !isLoggedIn.value) {
    router.push('/login')
  }
  
  // 如果用户已登录且在登录页，则跳转到仪表盘
  if (isLoggedIn.value && currentPath === '/login') {
    router.push('/dashboard')
  }
})
</script>
