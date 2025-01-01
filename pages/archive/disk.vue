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
          <label class="block text-sm font-medium text-gray-700 mb-1">入库日期</label>
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
          <h3 class="text-lg font-medium text-gray-900">光盘档案列表</h3>
          <Button type="primary" @click="openDialog()">新增档案</Button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <Table :columns="columns" :data="tableData" />
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <Modal v-model:visible="dialogVisible" :title="dialogTitle">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">档案编号</label>
          <input
            type="text"
            v-model="formData.archiveNo"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="请输入档案编号"
            :disabled="!!editingRecord"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">档案名称</label>
          <input
            type="text"
            v-model="formData.name"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="请输入档案名称"
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
          <label class="block text-sm font-medium text-gray-700 mb-1">光盘类型</label>
          <select
            v-model="formData.diskType"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option v-for="type in diskTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">容量</label>
          <input
            type="text"
            v-model="formData.capacity"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="请输入容量"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">入库日期</label>
          <input
            type="date"
            v-model="formData.entryDate"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
          <select
            v-model="formData.status"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <Button @click="closeDialog">取消</Button>
          <Button type="primary" @click="handleSubmit">确定</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import type { DiskArchive } from '~/types'
import Button from '~/components/ui/Button.vue'
import Table from '~/components/table/Table.vue'
import StatusTag from '~/components/ui/StatusTag.vue'
import Modal from '~/components/ui/Modal.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'admin'
})

// 搜索表单数据
const searchForm = ref({
  keyword: '',
  status: '',
  dateRange: [] as string[]
})

// 表格数据
const tableData = ref<DiskArchive[]>([
  {
    id: 1,
    archiveNo: 'DISK20230001',
    name: '项目文档备份',
    location: 'A区-01-01',
    diskType: 'CD',
    capacity: '700MB',
    entryDate: '2023-01-01',
    status: 'normal',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 2,
    archiveNo: 'DISK20230002',
    name: '系统安装包',
    location: 'A区-01-02',
    diskType: 'DVD',
    capacity: '4.7GB',
    entryDate: '2023-01-02',
    status: 'normal',
    createdAt: '2023-01-02',
    updatedAt: '2023-01-02'
  }
])

// 状态选项
const statusOptions = [
  { label: '正常', value: 'normal' },
  { label: '借出', value: 'borrowed' },
  { label: '损坏', value: 'damaged' }
]

// 光盘类型选项
const diskTypes = [
  { label: 'CD', value: 'CD' },
  { label: 'DVD', value: 'DVD' },
  { label: 'BD', value: 'BD' }
]

// 表格列定义
const columns = [
  { title: '档案编号', key: 'archiveNo' },
  { title: '档案名称', key: 'name' },
  { title: '存放位置', key: 'location' },
  { title: '光盘类型', key: 'diskType' },
  { title: '容量', key: 'capacity' },
  { title: '入库日期', key: 'entryDate' },
  { 
    title: '状态', 
    key: 'status',
    render: (record: DiskArchive) => h(StatusTag, { status: record.status })
  },
  { 
    title: '操作', 
    key: 'action', 
    width: 200,
    render: (record: DiskArchive) => h('div', { class: 'space-x-2' }, [
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

// 新增/编辑对话框
const dialogVisible = ref(false)
const editingRecord = ref<DiskArchive | null>(null)
const dialogTitle = computed(() => editingRecord.value ? '编辑档案' : '新增档案')

const formData = ref({
  archiveNo: '',
  name: '',
  location: '',
  diskType: 'CD' as 'CD' | 'DVD' | 'BD',
  capacity: '',
  entryDate: '',
  status: 'normal' as 'normal' | 'borrowed' | 'damaged'
})

// 打开对话框
const openDialog = (record: DiskArchive | null = null) => {
  editingRecord.value = record
  if (record) {
    const { id, createdAt, updatedAt, ...rest } = record
    formData.value = { ...rest }
  } else {
    formData.value = {
      archiveNo: '',
      name: '',
      location: '',
      diskType: 'CD',
      capacity: '',
      entryDate: '',
      status: 'normal'
    }
  }
  dialogVisible.value = true
}

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false
  editingRecord.value = null
  formData.value = {
    archiveNo: '',
    name: '',
    location: '',
    diskType: 'CD',
    capacity: '',
    entryDate: '',
    status: 'normal'
  }
}

// 提交表单
const handleSubmit = () => {
  // TODO: 实现表单提交逻辑
  console.log('提交表单', formData.value)
  closeDialog()
}

// 删除记录
const handleDelete = (record: DiskArchive) => {
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
</script> 