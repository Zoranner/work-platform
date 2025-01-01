<template>
  <div>
    <!-- 搜索表单 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">设备编号</label>
          <input
            type="text"
            v-model="searchForm.deviceNo"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="请输入设备编号"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">设备名称</label>
          <input
            type="text"
            v-model="searchForm.name"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="请输入设备名称"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">设备类型</label>
          <select
            v-model="searchForm.type"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">全部</option>
            <option v-for="option in typeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">设备状态</label>
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
      </div>
      <div class="mt-4 flex justify-end space-x-2">
        <Button type="primary" @click="handleSearch">搜索</Button>
        <Button @click="handleReset">重置</Button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">设备列表</h3>
          <Button type="primary" @click="openDialog()">新增设备</Button>
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
          <label class="block text-sm font-medium text-gray-700 mb-1">设备编号</label>
          <input
            type="text"
            v-model="formData.deviceNo"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="请输入设备编号"
            :disabled="!!editingRecord"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">设备名称</label>
          <input
            type="text"
            v-model="formData.name"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="请输入设备名称"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">设备类型</label>
          <select
            v-model="formData.type"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option v-for="option in typeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">型号</label>
          <input
            type="text"
            v-model="formData.model"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="请输入型号"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">购入日期</label>
          <input
            type="date"
            v-model="formData.purchaseDate"
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
import type { DeviceAsset } from '~/types'
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
  deviceNo: '',
  name: '',
  type: '',
  status: ''
})

// 表格数据
const tableData = ref<DeviceAsset[]>([
  {
    id: 1,
    deviceNo: 'DEV20230001',
    name: '开发用笔记本',
    type: 'computer',
    model: 'ThinkPad X1 Carbon',
    purchaseDate: '2023-01-01',
    status: 'in_use',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 2,
    deviceNo: 'DEV20230002',
    name: '办公室打印机',
    type: 'printer',
    model: 'HP LaserJet Pro',
    purchaseDate: '2023-01-02',
    status: 'in_use',
    createdAt: '2023-01-02',
    updatedAt: '2023-01-02'
  }
])

// 设备类型选项
const typeOptions = [
  { label: '计算机', value: 'computer' },
  { label: '打印机', value: 'printer' },
  { label: '扫描仪', value: 'scanner' },
  { label: '服务器', value: 'server' },
  { label: '网络设备', value: 'network' },
  { label: '其他', value: 'other' }
]

// 状态选项
const statusOptions = [
  { label: '使用中', value: 'in_use' },
  { label: '闲置', value: 'idle' },
  { label: '维修中', value: 'maintenance' },
  { label: '已报废', value: 'scrapped' }
]

// 获取类型文本
const getTypeText = (type: string) => {
  return typeOptions.find(option => option.value === type)?.label || type
}

// 表格列定义
const columns = [
  { title: '设备编号', key: 'deviceNo' },
  { title: '设备名称', key: 'name' },
  { 
    title: '设备类型', 
    key: 'type',
    render: (record: DeviceAsset) => getTypeText(record.type)
  },
  { title: '型号', key: 'model' },
  { title: '购入日期', key: 'purchaseDate' },
  { 
    title: '状态', 
    key: 'status',
    render: (record: DeviceAsset) => h(StatusTag, { status: record.status })
  },
  { 
    title: '操作', 
    key: 'action', 
    width: 200,
    render: (record: DeviceAsset) => h('div', { class: 'space-x-2' }, [
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
const editingRecord = ref<DeviceAsset | null>(null)
const dialogTitle = computed(() => editingRecord.value ? '编辑设备' : '新增设备')

const formData = ref({
  deviceNo: '',
  name: '',
  type: 'computer',
  model: '',
  purchaseDate: '',
  status: 'in_use'
})

// 打开对话框
const openDialog = (record: DeviceAsset | null = null) => {
  editingRecord.value = record
  if (record) {
    const { id, createdAt, updatedAt, ...rest } = record
    formData.value = { ...rest }
  } else {
    formData.value = {
      deviceNo: '',
      name: '',
      type: 'computer',
      model: '',
      purchaseDate: '',
      status: 'in_use'
    }
  }
  dialogVisible.value = true
}

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false
  editingRecord.value = null
  formData.value = {
    deviceNo: '',
    name: '',
    type: 'computer',
    model: '',
    purchaseDate: '',
    status: 'in_use'
  }
}

// 提交表单
const handleSubmit = () => {
  // TODO: 实现表单提交逻辑
  console.log('提交表单', formData.value)
  closeDialog()
}

// 删除记录
const handleDelete = (record: DeviceAsset) => {
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
    deviceNo: '',
    name: '',
    type: '',
    status: ''
  }
}
</script> 