import { defineStore } from 'pinia'

interface UserInfo {
  sub: string
  email?: string
  name?: string
  [key: string]: any
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserInfo | null,
    isAuthenticated: false,
  }),
  
  actions: {
    setUser(userInfo: UserInfo) {
      this.user = userInfo
      this.isAuthenticated = true
    },
    
    clearUser() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    },
    
    async logout() {
      const config = useRuntimeConfig()
      this.clearUser()
      
      // 重定向到 OIDC 登出端点
      if (config.public.oidc.postLogoutRedirectUri) {
        window.location.href = `${config.public.oidc.authority}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(config.public.oidc.postLogoutRedirectUri)}`
      }
    }
  },
  
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
  }
}) 