import { defineStore } from 'pinia';

interface UserInfo {
  sub: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserInfo | null,
    isAuthenticated: false,
  }),

  actions: {
    setUser(userInfo: UserInfo) {
      this.user = userInfo;
      this.isAuthenticated = true;
      // 将用户信息保存到 localStorage
      localStorage.setItem('user', JSON.stringify(userInfo));
    },

    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
      // 清除所有认证相关的存储
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },

    // 初始化认证状态
    initAuth() {
      const userStr = localStorage.getItem('user');
      const accessToken = localStorage.getItem('access_token');

      if (userStr && accessToken) {
        try {
          const user = JSON.parse(userStr);
          this.setUser(user);
        } catch (error) {
          console.error('Failed to parse user info:', error);
          this.clearUser();
        }
      }
    },

    async logout() {
      const config = useRuntimeConfig();
      this.clearUser();

      // 重定向到 OIDC 登出端点
      if (config.public.oidc.postLogoutRedirectUri) {
        window.location.href = `${config.public.oidc.authority}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(config.public.oidc.postLogoutRedirectUri)}`;
      } else {
        // 如果没有配置登出端点，直接跳转到登录页
        navigateTo('/login');
      }
    },
  },

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.role || 'user',
  },
});
