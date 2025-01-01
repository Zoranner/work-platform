<template>
  <PageContainer>
      <!-- 页面标题和操作按钮 -->
    <PageHeader
      title="项目管理"
      :show-add-button="true"
      add-button-text="新建项目"
      @add="showAddDialog = true"
    />

      <!-- 搜索和筛选区域 -->
    <SearchSection @search="handleSearch" @reset="handleReset">
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
    </SearchSection>

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
              <StatusTag :status="getStatusType(project.status)" :text="getStatusText(project.status)" />
              </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <TableActions
                size="sm"
                :actions="[
                  {
                    key: 'edit',
                    text: '编辑',
                    type: 'primary',
                    onClick: () => handleEdit(project)
                  },
                  {
                    key: 'delete',
                    text: '删除',
                    type: 'danger',
                    onClick: () => handleDelete(project)
                  }
                ]"
              />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <Pagination
        :current-page="currentPage"
        :total="total"
        :page-size="pageSize"
        @update:current-page="handlePageChange"
      />
    </div>
  </PageContainer>

  <!-- 新增/编辑对话框 -->
  <Modal v-model:visible="showAddDialog" :title="editingProject ? '编辑项目' : '新建项目'">
                  <div class="space-y-4">
      <FormInput
                        v-model="projectForm.projectNumber"
        label="项目编号"
        placeholder="请输入项目编号"
        :disabled="!!editingProject"
      />
      <FormInput
                        v-model="projectForm.name"
        label="项目名称"
        placeholder="请输入项目名称"
      />
      <FormInput
                        v-model="projectForm.manager"
        label="负责人"
        placeholder="请输入负责人"
                      />
      <FormInput
                        type="date"
                        v-model="projectForm.startDate"
        label="开始日期"
      />
      <FormSelect
        v-model="projectForm.status"
        label="状态"
        :options="[
          { label: '规划中', value: 'planning' },
          { label: '进行中', value: 'in_progress' },
          { label: '已完成', value: 'completed' },
          { label: '已暂停', value: 'suspended' }
        ]"
                      />
                    </div>
    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button @click="closeDialog">取消</Button>
        <Button type="primary" @click="handleSave">确定</Button>
                    </div>
    </template>
  </Modal>

    <!-- 删除确认对话框 -->
  <Modal v-model:visible="showDeleteDialog" title="确认删除">
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    确定要删除该项目吗？此操作无法撤销。
                  </p>
                </div>
    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button @click="showDeleteDialog = false">取消</Button>
        <Button type="danger" @click="handleConfirmDelete">删除</Button>
                </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '~/components/ui/Button.vue'
import Table from '~/components/table/Table.vue'
import StatusTag from '~/components/ui/StatusTag.vue'
import Modal from '~/components/ui/Modal.vue'
import FormInput from '~/components/ui/FormInput.vue'
import FormSelect from '~/components/ui/FormSelect.vue'
import Pagination from '~/components/ui/Pagination.vue'
import TableActions from '~/components/table/TableActions.vue'
import PageContainer from '~/components/page/PageContainer.vue'
import PageHeader from '~/components/page/PageHeader.vue'
import SearchSection from '~/components/page/SearchSection.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'admin'
})

// 搜索表单
const searchForm = ref({
  projectNumber: '',
  name: '',
  manager: '',
  status: ''
})

// 项目表单
const projectForm = ref({
  projectNumber: '',
  name: '',
  manager: '',
  startDate: '',
  status: 'planning'
})

// 列表数据
const projectList = ref([
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

// 对话框控制
const showAddDialog = ref(false)
const showDeleteDialog = ref(false)
const editingProject = ref<any>(null)
const deletingProject = ref<any>(null)

// 获取状态类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, 'normal' | 'warning' | 'success' | 'error'> = {
    planning: 'warning',
    in_progress: 'normal',
    completed: 'success',
    suspended: 'error'
  }
  return statusMap[status] || 'normal'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    planning: '规划中',
    in_progress: '进行中',
    completed: '已完成',
    suspended: '已暂停'
  }
  return statusMap[status] || status
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

// 编辑项目
const handleEdit = (project: any) => {
  editingProject.value = project
  projectForm.value = { ...project }
  showAddDialog.value = true
}

// 删除项目
const handleDelete = (project: any) => {
  deletingProject.value = project
  showDeleteDialog.value = true
}

// 确认删除
const handleConfirmDelete = () => {
  if (deletingProject.value) {
    // TODO: 实现删除逻辑
    console.log('删除项目:', deletingProject.value)
    projectList.value = projectList.value.filter(item => item.id !== deletingProject.value.id)
    showDeleteDialog.value = false
    deletingProject.value = null
  }
}

// 保存项目
const handleSave = () => {
  // TODO: 实现保存逻辑
  if (editingProject.value) {
    // 编辑模式
    const index = projectList.value.findIndex(item => item.id === editingProject.value.id)
    if (index !== -1) {
      projectList.value[index] = {
        ...projectList.value[index],
        ...projectForm.value
      }
    }
  } else {
    // 新增模式
    const newProject = {
      id: Date.now(),
      ...projectForm.value
    }
    projectList.value.unshift(newProject)
  }
  closeDialog()
}

// 关闭对话框
const closeDialog = () => {
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

// 分页操作
const handlePageChange = (page: number) => {
  currentPage.value = page
  // TODO: 实现分页加载逻辑
}
</script> 