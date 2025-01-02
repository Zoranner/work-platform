import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // 如果用户未登录且不是访问登录页或回调页，则重定向到登录页
  if (!authStore.isLoggedIn && !['/login', '/auth/callback'].includes(to.path)) {
    return navigateTo('/login');
  }

  // 如果用户已登录且访问登录页，则重定向到首页
  if (authStore.isLoggedIn && to.path === '/login') {
    return navigateTo('/dashboard');
  }
});
