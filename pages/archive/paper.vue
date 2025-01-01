<template>
  <div>
    <!-- 搜索表单 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">关键词</label>
          <input
            type="text"
            v-model="searchForm.keyword"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="请输入档案名称"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
          <select
            v-model="searchForm.status"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">全部</option>
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">创建时间</label>
          <input
            type="date"
            v-model="searchForm.dateRange[0]"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
        </div>
        <div class="flex items-end space-x-4">
          <Button type="primary" @click="handleSearch">搜索</Button>
          <Button @click="handleReset">重置</Button>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">纸质档案列表</h3>
          <Button type="primary" @click="openDialog()">新增档案</Button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <Table :columns="columns" :data="tableData" />
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <TransitionRoot appear :show="dialogVisible" as="template">
      <Dialog as="div" @close="closeDialog" class="relative z-10">
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
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {{ dialogTitle }}
                </DialogTitle>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">档案名称</label>
                    <input
                      type="text"
                      v-model="formData.title"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="请输入档案名称"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">档案类型</label>
                    <input
                      type="text"
                      v-model="formData.type"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="请输入档案类型"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">存放位置</label>
                    <input
                      type="text"
                      v-model="formData.location"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="请输入存放位置"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">备注</label>
                    <textarea
                      v-model="formData.remark"
                      rows="3"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="请输入备注信息"
                    ></textarea>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <Button @click="closeDialog">取消</Button>
                  <Button type="primary" @click="handleSubmit">确定</Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useAuthStore } from '~/stores/auth'
import Button from '~/components/ui/Button.vue'
import StatusTag from '~/components/ui/StatusTag.vue'
import Table from '~/components/table/Table.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'admin'
})

interface PaperArchive {
  id: number
  title: string
  type: string
  status: 'normal' | 'borrowed' | 'damaged'
  createTime: string
  location: string
  remark?: string
}

interface StatusOption {
  label: string
  value: 'normal' | 'borrowed' | 'damaged'
}

const authStore = useAuthStore()

// 搜索表单数据
const searchForm = ref({
  keyword: '',
  status: '',
  dateRange: [] as string[]
})

// 表格数据
const tableData = ref<PaperArchive[]>([
  {
    id: 1,
    title: '2023年度工作总结',
    type: '工作报告',
    status: 'normal',
    createTime: '2023-12-28',
    location: 'A区-01-01'
  },
  {
    id: 2,
    title: '项目立项申请书',
    type: '申请文件',
    status: 'borrowed',
    createTime: '2023-12-25',
    location: 'A区-01-02'
  }
])

// 状态选项
const statusOptions: StatusOption[] = [
  { label: '正常', value: 'normal' },
  { label: '借出', value: 'borrowed' },
  { label: '损坏', value: 'damaged' }
]

// 新增/编辑对话框
const dialogVisible = ref(false)
const editingRecord = ref<PaperArchive | null>(null)
const dialogTitle = computed(() => editingRecord.value ? '编辑档案' : '新增档案')

const formData = ref<Omit<PaperArchive, 'id' | 'createTime'>>({
  title: '',
  type: '',
  status: 'normal',
  location: '',
  remark: ''
})

// 打开对话框
const openDialog = (record: PaperArchive | null = null) => {
  editingRecord.value = record
  if (record) {
    const { id, createTime, ...rest } = record
    formData.value = { ...rest }
  } else {
    formData.value = {
      title: '',
      type: '',
      status: 'normal',
      location: '',
      remark: ''
    }
  }
  dialogVisible.value = true
}

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false
  editingRecord.value = null
  formData.value = {
    title: '',
    type: '',
    status: 'normal',
    location: '',
    remark: ''
  }
}

// 提交表单
const handleSubmit = () => {
  // TODO: 实现表单提交逻辑
  console.log('提交表单', formData.value)
  closeDialog()
}

// 删除记录
const handleDelete = (record: PaperArchive) => {
  // TODO: 实现删除逻辑
  console.log('删除记录', record)
}

// 搜索
const handleSearch = () => {
  // TODO: 实现搜索逻辑
  console.log('搜索', searchForm.value)
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    keyword: '',
    status: '',
    dateRange: []
  }
}

// 表格列定义
const columns = [
  { title: '档案名称', key: 'title' },
  { title: '档案类型', key: 'type' },
  { 
    title: '状态', 
    key: 'status',
    render: (record: PaperArchive) => h(StatusTag, { status: record.status })
  },
  { title: '创建时间', key: 'createTime' },
  { title: '存放位置', key: 'location' },
  { 
    title: '操作', 
    key: 'action', 
    width: 200,
    render: (record: PaperArchive) => h('div', { class: 'space-x-2' }, [
      h(Button, { 
        size: 'sm', 
        onClick: () => openDialog(record) 
      }, () => '编辑'),
      h(Button, { 
        size: 'sm', 
        type: 'danger', 
        onClick: () => handleDelete(record) 
      }, () => '删除')
    ])
  }
]
</script> 