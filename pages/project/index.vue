<template>
  <NuxtLayout name="admin">
    <div class="bg-white shadow rounded-lg">
      <!-- 页面标题和操作按钮 -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-xl font-medium text-gray-900">项目管理</h2>
        <button
          @click="showAddDialog = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          新建项目
        </button>
      </div>

      <!-- 搜索和筛选区域 -->
      <div class="p-6 border-b border-gray-200">
        <div class="grid grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">项目编号</label>
            <input
              type="text"
              v-model="searchForm.projectNumber"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">项目名称</label>
            <input
              type="text"
              v-model="searchForm.name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">负责人</label>
            <input
              type="text"
              v-model="searchForm.manager"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">状态</label>
            <select
              v-model="searchForm.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">全部</option>
              <option value="planning">规划中</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
              <option value="suspended">已暂停</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button
            @click="handleSearch"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            搜索
          </button>
          <button
            @click="handleReset"
            class="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            重置
          </button>
        </div>
      </div>

      <!-- 项目列表 -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">项目编号</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">项目名称</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">负责人</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">开始日期</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="project in projectList" :key="project.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ project.projectNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ project.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ project.manager }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ project.startDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': project.status === 'completed',
                    'bg-yellow-100 text-yellow-800': project.status === 'in_progress',
                    'bg-gray-100 text-gray-800': project.status === 'planning',
                    'bg-red-100 text-red-800': project.status === 'suspended'
                  }"
                >
                  {{ getStatusText(project.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  @click="handleEdit(project)"
                  class="text-primary-600 hover:text-primary-900 mr-4"
                >
                  编辑
                </button>
                <button
                  @click="handleDelete(project)"
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
            @click="handlePrevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            上一页
          </button>
          <button
            @click="handleNextPage"
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
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="handlePrevPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">上一页</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                v-for="page in displayedPages"
                :key="page"
                @click="handlePageChange(page)"
                :class="[
                  page === currentPage
                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="handleNextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">下一页</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建/编辑项目对话框 -->
    <TransitionRoot appear :show="showAddDialog" as="template">
      <Dialog as="div" @close="showAddDialog = false" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  {{ editingProject ? '编辑项目' : '新建项目' }}
                </DialogTitle>

                <div class="mt-4">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">项目编号</label>
                      <input
                        type="text"
                        v-model="projectForm.projectNumber"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">项目名称</label>
                      <input
                        type="text"
                        v-model="projectForm.name"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">负责人</label>
                      <input
                        type="text"
                        v-model="projectForm.manager"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">开始日期</label>
                      <input
                        type="date"
                        v-model="projectForm.startDate"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">状态</label>
                      <select
                        v-model="projectForm.status"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="planning">规划中</option>
                        <option value="in_progress">进行中</option>
                        <option value="completed">已完成</option>
                        <option value="suspended">已暂停</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="showAddDialog = false"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    @click="handleSave"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    保存
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- 删除确认对话框 -->
    <TransitionRoot appear :show="showDeleteDialog" as="template">
      <Dialog as="div" @close="showDeleteDialog = false" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  确认删除
                </DialogTitle>

                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    确定要删除该项目吗？此操作无法撤销。
                  </p>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="showDeleteDialog = false"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    @click="handleConfirmDelete"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    删除
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

// 项目类型定义
interface Project {
  id: number
  projectNumber: string
  name: string
  manager: string
  startDate: string
  status: 'planning' | 'in_progress' | 'completed' | 'suspended'
}

// 搜索表单
const searchForm = ref({
  projectNumber: '',
  name: '',
  manager: '',
  status: '' as string
})

// 项目表单类型
interface ProjectForm {
  projectNumber: string
  name: string
  manager: string
  startDate: string
  status: 'planning' | 'in_progress' | 'completed' | 'suspended'
}

// 项目表单
const projectForm = ref<ProjectForm>({
  projectNumber: '',
  name: '',
  manager: '',
  startDate: '',
  status: 'planning'
})

// 列表数据
const projectList = ref<Project[]>([
  {
    id: 1,
    projectNumber: 'PRJ001',
    name: '示例项目1',
    manager: '张三',
    startDate: '2024-01-01',
    status: 'in_progress'
  },
  {
    id: 2,
    projectNumber: 'PRJ002',
    name: '示例项目2',
    manager: '李四',
    startDate: '2024-01-15',
    status: 'planning'
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(20)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  let end = Math.min(totalPages.value, start + maxPages - 1)

  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// 对话框控制
const showAddDialog = ref(false)
const showDeleteDialog = ref(false)
const editingProject = ref<Project | null>(null)
const deletingProject = ref<Project | null>(null)

// 状态文本映射
const getStatusText = (status: 'planning' | 'in_progress' | 'completed' | 'suspended'): string => {
  const statusMap = {
    planning: '规划中',
    in_progress: '进行中',
    completed: '已完成',
    suspended: '已暂停'
  } as const
  return statusMap[status]
}

// 搜索
const handleSearch = () => {
  // TODO: 实现搜索逻辑
  console.log('搜索条件:', searchForm.value)
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    projectNumber: '',
    name: '',
    manager: '',
    status: ''
  }
}

// 分页操作
const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

// 编辑项目
const handleEdit = (project: Project) => {
  editingProject.value = project
  projectForm.value = {
    projectNumber: project.projectNumber,
    name: project.name,
    manager: project.manager,
    startDate: project.startDate,
    status: project.status
  }
  showAddDialog.value = true
}

// 删除项目
const handleDelete = (project: Project) => {
  deletingProject.value = project
  showDeleteDialog.value = true
}

// 确认删除
const handleConfirmDelete = () => {
  if (deletingProject.value) {
    // TODO: 实现删除逻辑
    console.log('删除项目:', deletingProject.value)
    showDeleteDialog.value = false
    deletingProject.value = null
  }
}

// 保存项目
const handleSave = () => {
  // TODO: 实现保存逻辑
  console.log('保存项目:', projectForm.value)
  showAddDialog.value = false
  editingProject.value = null
  projectForm.value = {
    projectNumber: '',
    name: '',
    manager: '',
    startDate: '',
    status: 'planning'
  }
}
</script> 