<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登录系统
        </h2>
      </div>
      <div class="mt-8 space-y-6">
        <button
          @click="handleOIDCLogin"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          OIDC 登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const router = useRouter()

const handleOIDCLogin = async () => {
  try {
    const client = await import('openid-client')
    const code_verifier = client.randomPKCECodeVerifier()
    const code_challenge = await client.calculatePKCECodeChallenge(code_verifier)
    const state = client.randomState()

    const oidcConfig = await client.discovery(
      new URL(config.public.oidc.authority),
      config.public.oidc.clientId,
      config.public.oidc.clientSecret
    )

    const parameters = {
      redirect_uri: config.public.oidc.redirectUri,
      scope: config.public.oidc.scope,
      code_challenge,
      code_challenge_method: 'S256',
      state
    }

    const redirectTo = client.buildAuthorizationUrl(oidcConfig, parameters)
    
    // 存储 state 和 code_verifier 用于回调验证
    sessionStorage.setItem('auth_state', state)
    sessionStorage.setItem('code_verifier', code_verifier)

    window.location.href = redirectTo.href
  } catch (error) {
    console.error('OIDC login error:', error)
  }
}
</script> 