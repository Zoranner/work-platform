<template>
  <div>
    <!-- 搜索表单 -->
    <SearchForm @search="handleSearch" @reset="handleReset">
      <FormInput
        v-model="searchForm.categoryNo"
        label="类目编号"
        placeholder="请输入类目编号"
      />
      <FormInput
        v-model="searchForm.name"
        label="类目名称"
        placeholder="请输入类目名称"
      />
      <FormSelect
        v-model="searchForm.status"
        label="状态"
        :options="statusOptions"
        placeholder="全部"
      />
    </SearchForm>

    <!-- 表格 -->
    <Card class="mt-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">类目列表</h3>
          <Button type="primary" @click="openDialog()">新增类目</Button>
        </div>
      </template>
      <div class="overflow-x-auto">
        <Table :columns="columns" :data="categoryStore.categories" :loading="categoryStore.loading" />
      </div>
    </Card>

    <!-- 新增/编辑对话框 -->
    <Modal v-model:visible="dialogVisible" :title="dialogTitle">
      <div class="space-y-4">
        <FormInput
          v-model="formData.categoryNo"
          label="类目编号"
          placeholder="请输入类目编号"
          :disabled="!!editingRecord"
        />
        <FormInput
          v-model="formData.name"
          label="类目名称"
          placeholder="请输入类目名称"
        />
        <FormTextarea
          v-model="formData.description"
          label="描述"
          placeholder="请输入类目描述"
          :rows="3"
        />
        <FormSelect
          v-model="formData.status"
          label="状态"
          :options="statusOptions"
        />
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
import { ref, computed, h, onMounted } from 'vue'
import type { Category, CategoryForm, CategorySearchForm } from '~/types/asset'
import { useCategoryStore } from '~/stores/category'
import Button from '~/components/ui/Button.vue'
import Table from '~/components/table/Table.vue'
import StatusTag from '~/components/ui/StatusTag.vue'
import Modal from '~/components/ui/Modal.vue'
import Card from '~/components/ui/Card.vue'
import FormInput from '~/components/ui/FormInput.vue'
import FormSelect from '~/components/ui/FormSelect.vue'
import FormTextarea from '~/components/ui/FormTextarea.vue'
import SearchForm from '~/components/search/SearchForm.vue'
import TableActions from '~/components/table/TableActions.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'admin'
})

const categoryStore = useCategoryStore()

// 搜索表单数据
const searchForm = ref<CategorySearchForm>({
  categoryNo: '',
  name: '',
  status: ''
})

// 状态选项
const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' }
]

// 获取状态文本
const getStatusText = (status: string) => {
  return statusOptions.find(option => option.value === status)?.label || status
}

// 表格列定义
const columns = [
  { title: '类目编号', key: 'categoryNo' },
  { title: '类目名称', key: 'name' },
  { title: '描述', key: 'description' },
  { title: '创建时间', key: 'createdAt' },
  { 
    title: '状态', 
    key: 'status',
    render: (record: Category) => h(StatusTag, { 
      status: record.status === 'active' ? 'normal' : 'damaged',
      text: getStatusText(record.status)
    })
  },
  { 
    title: '操作', 
    key: 'action', 
    width: 200,
    render: (record: Category) => h(TableActions, { 
      size: 'sm',
      actions: [
        {
          key: 'edit',
          text: '编辑',
          type: 'primary',
          onClick: () => openDialog(record)
        },
        {
          key: 'delete',
          text: '删除',
          type: 'danger',
          onClick: () => handleDelete(record)
        }
      ]
    })
  }
]

// 新增/编辑对话框
const dialogVisible = ref(false)
const editingRecord = ref<Category | null>(null)
const dialogTitle = computed(() => editingRecord.value ? '编辑类目' : '新增类目')

const formData = ref<CategoryForm>({
  categoryNo: '',
  name: '',
  description: '',
  status: 'active'
})

// 打开对话框
const openDialog = (record: Category | null = null) => {
  editingRecord.value = record
  if (record) {
    const { id, createdAt, updatedAt, ...rest } = record
    formData.value = { ...rest }
  } else {
    formData.value = {
      categoryNo: '',
      name: '',
      description: '',
      status: 'active'
    }
  }
  dialogVisible.value = true
}

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false
  editingRecord.value = null
  formData.value = {
    categoryNo: '',
    name: '',
    description: '',
    status: 'active'
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    if (editingRecord.value) {
      await categoryStore.updateCategory(editingRecord.value.id, formData.value)
    } else {
      await categoryStore.createCategory(formData.value)
    }
    closeDialog()
  } catch (error) {
    console.error('提交表单失败:', error)
  }
}

// 删除记录
const handleDelete = async (record: Category) => {
  try {
    await categoryStore.deleteCategory(record.id)
  } catch (error) {
    console.error('删除记录失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  categoryStore.setSearchForm(searchForm.value)
  categoryStore.fetchCategories()
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    categoryNo: '',
    name: '',
    status: ''
  }
  categoryStore.setSearchForm(searchForm.value)
  categoryStore.fetchCategories()
}

// 初始化
onMounted(() => {
  categoryStore.fetchCategories()
})
</script> 