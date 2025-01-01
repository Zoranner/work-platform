<template>
  <div class="space-y-6">
    <!-- 页面标题和操作按钮 -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-800">用户管理</h2>
      <button
        @click="showAddModal = true"
        class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        新增用户
      </button>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
          <input
            v-model="searchForm.username"
            type="text"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="请输入用户名"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
          <input
            v-model="searchForm.name"
            type="text"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="请输入姓名"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">角色</label>
          <select
            v-model="searchForm.role"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">全部</option>
            <option value="admin">管理员</option>
            <option value="user">普通用户</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
          <select
            v-model="searchForm.status"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">全部</option>
            <option value="active">启用</option>
            <option value="inactive">禁用</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          @click="handleSearch"
          class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          搜索
        </button>
        <button
          @click="handleReset"
          class="ml-2 bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          重置
        </button>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="bg-white rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">手机号</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in userList" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.username }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getRoleText(user.role) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.phone }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ getStatusText(user.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  @click="handleEdit(user)"
                  class="text-primary-600 hover:text-primary-900 mr-2"
                >
                  编辑
                </button>
                <button
                  @click="handleDelete(user)"
                  class="text-red-600 hover:text-red-900"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 分页 -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="currentPage > 1 && (currentPage--)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            上一页
          </button>
          <button
            @click="currentPage < totalPages && (currentPage++)"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            下一页
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              显示第
              <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
              至
              <span class="font-medium">{{ Math.min(currentPage * pageSize, total) }}</span>
              条，共
              <span class="font-medium">{{ total }}</span>
              条记录
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="currentPage > 1 && (currentPage--)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">上一页</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                v-for="page in displayedPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === currentPage
                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="currentPage < totalPages && (currentPage++)"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">下一页</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <Modal
      v-model:visible="showAddModal"
      :title="editingUser ? '编辑用户' : '新增用户'"
      @confirm="handleSave"
      @cancel="handleCancel"
    >
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
          <input
            v-model="form.username"
            type="text"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="请输入用户名"
            :disabled="!!editingUser"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="请输入姓名"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">角色</label>
          <select
            v-model="form.role"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="admin">管理员</option>
            <option value="user">普通用户</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="请输入邮箱"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
          <input
            v-model="form.phone"
            type="tel"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="请输入手机号"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
          <select
            v-model="form.status"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="active">启用</option>
            <option value="inactive">禁用</option>
          </select>
        </div>
      </div>
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal
      v-model:visible="showDeleteModal"
      title="删除确认"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    >
      <p class="text-gray-500">确定要删除该用户吗？此操作不可恢复。</p>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Modal from '~/components/ui/Modal.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'admin'
})

// 搜索表单
const searchForm = ref({
  username: '',
  name: '',
  role: '',
  status: ''
})

// 新增/编辑表单
const form = ref({
  username: '',
  name: '',
  role: 'user',
  email: '',
  phone: '',
  status: 'active'
})

// 列表数据
const userList = ref([
  {
    id: 1,
    username: 'admin',
    name: '管理员',
    role: 'admin',
    email: 'admin@example.com',
    phone: '13800138000',
    status: 'active'
  },
  // 更多示例数据...
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 显示的页码范围
const displayedPages = computed(() => {
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// 模态框控制
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const editingUser = ref<any>(null)
const deletingUser = ref<any>(null)

// 角色文本映射
const getRoleText = (role: string) => {
  const roleMap: Record<string, string> = {
    admin: '管理员',
    user: '普通用户'
  }
  return roleMap[role] || role
}

// 状态文本映射
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: '启用',
    inactive: '禁用'
  }
  return statusMap[status] || status
}

// 搜索
const handleSearch = () => {
  // TODO: 实现搜索逻辑
  console.log('搜索条件：', searchForm.value)
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    username: '',
    name: '',
    role: '',
    status: ''
  }
  handleSearch()
}

// 编辑用户
const handleEdit = (user: any) => {
  editingUser.value = user
  form.value = { ...user }
  showAddModal.value = true
}

// 删除用户
const handleDelete = (user: any) => {
  deletingUser.value = user
  showDeleteModal.value = true
}

// 确认删除
const confirmDelete = () => {
  if (deletingUser.value) {
    // TODO: 实现删除逻辑
    console.log('删除用户：', deletingUser.value)
    userList.value = userList.value.filter(item => item.id !== deletingUser.value.id)
    showDeleteModal.value = false
    deletingUser.value = null
  }
}

// 保存用户
const handleSave = () => {
  // TODO: 实现保存逻辑
  if (editingUser.value) {
    // 编辑模式
    const index = userList.value.findIndex(item => item.id === editingUser.value.id)
    if (index !== -1) {
      userList.value[index] = {
        ...userList.value[index],
        ...form.value
      }
    }
  } else {
    // 新增模式
    const newUser = {
      id: Date.now(),
      ...form.value
    }
    userList.value.unshift(newUser)
  }
  handleCancel()
}

// 取消编辑/新增
const handleCancel = () => {
  showAddModal.value = false
  editingUser.value = null
  form.value = {
    username: '',
    name: '',
    role: 'user',
    email: '',
    phone: '',
    status: 'active'
  }
}
</script> 