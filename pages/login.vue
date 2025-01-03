<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100"
  >
    <div class="max-w-md w-full mx-4 transform transition-all duration-300 hover:scale-[1.01]">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- 顶部装饰条 -->
        <div class="h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>

        <!-- 主要内容 -->
        <div class="px-8 py-12">
          <!-- Logo 区域 -->
          <div class="flex justify-center mb-8">
            <div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
              <svg
                class="w-10 h-10 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          <!-- 标题 -->
          <h2 class="text-center text-3xl font-extrabold text-gray-900 mb-8">登录系统</h2>

          <!-- 登录按钮 -->
          <div class="space-y-4">
            <UiButton @click="handleOIDCLogin" type="primary" size="lg" block>
              <IconsLoginIcon class="w-5 h-5 mr-2" />
              OIDC 登录
            </UiButton>

            <!-- 测试按钮 -->
            <UiButton @click="handleTestLogin" type="success" size="lg" block>
              <IconsCheckCircleIcon class="w-5 h-5 mr-2" />
              测试登录
            </UiButton>
          </div>

          <!-- 底部提示 -->
          <p class="mt-8 text-center text-sm text-gray-500">
            通过登录，即表示您同意我们的
            <a href="#" class="font-medium text-primary-600 hover:text-primary-500"> 服务条款 </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '~/stores/auth';

  const config = useRuntimeConfig();
  const router = useRouter();
  const authStore = useAuthStore();

  const handleTestLogin = () => {
    // 模拟用户信息
    const mockUser = {
      sub: 'test-user-id',
      name: '测试管理员',
      email: 'admin@example.com',
      role: 'admin', // 添加管理员角色
    };

    // 设置用户信息到 store
    authStore.setUser(mockUser);

    // 模拟存储 token
    localStorage.setItem('access_token', 'mock-access-token');
    localStorage.setItem('refresh_token', 'mock-refresh-token');

    // 重定向到仪表盘
    router.push('/dashboard');
  };

  const handleOIDCLogin = async () => {
    try {
      const client = await import('openid-client');
      const code_verifier = client.randomPKCECodeVerifier();
      const code_challenge = await client.calculatePKCECodeChallenge(code_verifier);
      const state = client.randomState();

      const oidcConfig = await client.discovery(
        new URL(config.public.oidc.authority),
        config.public.oidc.clientId,
        config.public.oidc.clientSecret
      );

      const parameters = {
        redirect_uri: config.public.oidc.redirectUri,
        scope: config.public.oidc.scope,
        code_challenge,
        code_challenge_method: 'S256',
        state,
      };

      const redirectTo = client.buildAuthorizationUrl(oidcConfig, parameters);

      // 存储 state 和 code_verifier 用于回调验证
      sessionStorage.setItem('auth_state', state);
      sessionStorage.setItem('code_verifier', code_verifier);

      window.location.href = redirectTo.href;
    } catch (error) {
      console.error('OIDC login error:', error);
    }
  };
</script>
