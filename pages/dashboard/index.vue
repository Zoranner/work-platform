<template>
  <!-- 主内容区 -->
  <div>
    <!-- 欢迎卡片 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">
        欢迎回来，{{ authStore.currentUser?.name || '用户' }}
      </h2>
      <p class="mt-1 text-sm text-gray-500">这里是您的工作台，可以快速了解项目进展和待办事项。</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-primary-100 rounded-md p-3">
            <IconsDocumentIcon class="h-6 w-6 text-primary-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">进行中的项目</dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">12</div>
                <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  <IconsChevronUpIcon class="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                  <span class="sr-only">增长</span>
                  3.2%
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
            <IconsClockIcon class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">待办任务</dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">23</div>
                <div class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                  <IconsChevronDownIcon class="self-center flex-shrink-0 h-5 w-5 text-red-500" />
                  <span class="sr-only">下降</span>
                  5.6%
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-yellow-100 rounded-md p-3">
            <IconsChartIcon class="h-6 w-6 text-yellow-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">项目进度</dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">68%</div>
                <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  <IconsChevronUpIcon class="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                  <span class="sr-only">增长</span>
                  2.5%
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
            <IconsUserGroupIcon class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">团队成员</dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">36</div>
                <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  <IconsChevronUpIcon class="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                  <span class="sr-only">增长</span>
                  4.1%
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- 时间线 -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">最近动态</h3>
      </div>
      <div class="p-6">
        <ul class="-mb-8">
          <li>
            <div class="relative pb-8">
              <span
                class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                aria-hidden="true"
              ></span>
              <div class="relative flex space-x-3">
                <div>
                  <span
                    class="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white"
                  >
                    <IconsWarningIcon class="w-4 h-4 text-white" />
                  </span>
                </div>
                <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p class="text-sm text-gray-500">
                      标记任务
                      <span class="font-medium text-gray-900">"后端API开发"</span>
                      为高优先级
                    </p>
                  </div>
                  <div class="text-right text-sm whitespace-nowrap text-gray-500">
                    <time datetime="2023-01-13">3小时前</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '~/stores/auth';

  definePageMeta({
    middleware: ['auth'],
    layout: 'admin',
  });

  const authStore = useAuthStore();
</script>
