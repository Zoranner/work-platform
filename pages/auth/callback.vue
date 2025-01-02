<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <p class="text-lg">正在处理登录...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  const config = useRuntimeConfig();
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();

  onMounted(async () => {
    try {
      const client = await import('openid-client');
      const oidcConfig = await client.discovery(
        new URL(config.public.oidc.authority),
        config.public.oidc.clientId,
        config.public.oidc.clientSecret
      );

      const code_verifier = sessionStorage.getItem('code_verifier');
      const expected_state = sessionStorage.getItem('auth_state');

      if (!code_verifier || !expected_state) {
        throw new Error('Missing PKCE or state parameters');
      }

      const tokens = await client.authorizationCodeGrant(
        oidcConfig,
        new URL(window.location.href),
        {
          pkceCodeVerifier: code_verifier,
          expectedState: expected_state,
        }
      );

      // 清除会话存储的验证参数
      sessionStorage.removeItem('code_verifier');
      sessionStorage.removeItem('auth_state');

      // 存储 token
      localStorage.setItem('access_token', tokens.access_token);
      if (tokens.refresh_token) {
        localStorage.setItem('refresh_token', tokens.refresh_token);
      }

      // 获取用户信息
      const userInfoResponse = await client.fetchProtectedResource(
        oidcConfig,
        tokens.access_token,
        new URL(`${config.public.oidc.authority}/userinfo`),
        'GET'
      );

      const userInfo = await userInfoResponse.json();

      // 存储用户信息到 store
      authStore.setUser(userInfo);

      // 重定向到首页或者之前的页面
      router.push('/');
    } catch (error) {
      console.error('Authentication error:', error);
      router.push('/login');
    }
  });
</script>
