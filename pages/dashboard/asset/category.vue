<template>
  <PageContainer>
    <!-- 页面标题和操作按钮 -->
    <PageHeader
      title="类目管理"
      :show-add-button="true"
      add-button-text="新建类目"
      @add="showAddDialog = true"
    />

    <!-- 搜索和筛选区域 -->
    <SearchSection @search="handleSearch" @reset="handleReset">
      <div>
        <label class="block text-sm font-medium text-gray-700">类目编号</label>
        <input
          type="text"
          v-model="searchForm.categoryNumber"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">类目名称</label>
        <input
          type="text"
          v-model="searchForm.name"
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
          <option value="active">启用</option>
          <option value="disabled">禁用</option>
        </select>
      </div>
    </SearchSection>

    <!-- 类目列表 -->
    <div class="overflow-x-auto">
      <Table
        :columns="columns"
        :data="categoryList"
        :loading="loading"
        :selection="true"
        :selected-keys="selectedCategoryKeys"
        :toolbar="true"
        :toolbar-actions="[
          {
            key: 'export',
            text: '导出',
            type: 'default',
            onClick: handleExport
          },
          {
            key: 'batchDelete',
            text: '批量删除',
            type: 'danger',
            onClick: handleBatchDelete
          }
        ]"
        hover
        striped
        @update:selected-keys="handleSelectionChange"
        @sort="handleSort"
      />
    </div>

    <!-- 分页 -->
    <div class="mt-4 flex justify-end">
      <Pagination
        :current-page="currentPage"
        :total="total"
        :page-size="pageSize"
        @update:current-page="handlePageChange"
      />
    </div>
  </PageContainer>

  <!-- 新增/编辑对话框 -->
  <Modal v-model:visible="showAddDialog" :title="editingCategory ? '编辑类目' : '新建类目'">
    <div class="space-y-4">
      <FormInput
        v-model="categoryForm.categoryNumber"
        label="类目编号"
        placeholder="请输入类目编号"
        :disabled="!!editingCategory"
      />
      <FormInput v-model="categoryForm.name" label="类目名称" placeholder="请输入类目名称" />
      <FormInput
        type="textarea"
        v-model="categoryForm.description"
        label="描述"
        placeholder="请输入类目描述"
      />
      <FormSelect
        v-model="categoryForm.status"
        label="状态"
        :options="[
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'disabled' },
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
      <p class="text-sm text-gray-500">确定要删除该类目吗？此操作无法撤销。</p>
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
  import { ref } from 'vue';
  import Button from '~/components/ui/Button.vue';
  import Table from '~/components/table/Table.vue';
  import StatusTag from '~/components/ui/StatusTag.vue';
  import Modal from '~/components/ui/Modal.vue';
  import FormInput from '~/components/ui/FormInput.vue';
  import FormSelect from '~/components/ui/FormSelect.vue';
  import Pagination from '~/components/ui/Pagination.vue';
  import TableActions from '~/components/table/TableActions.vue';
  import PageContainer from '~/components/page/PageContainer.vue';
  import PageHeader from '~/components/page/PageHeader.vue';
  import SearchSection from '~/components/page/SearchSection.vue';

  definePageMeta({
    middleware: ['auth'],
    layout: 'admin',
  });

  // 搜索表单
  const searchForm = ref({
    categoryNumber: '',
    name: '',
    status: '',
  });

  // 类目表单
  const categoryForm = ref({
    categoryNumber: '',
    name: '',
    description: '',
    status: 'active',
  });

  // 列表数据
  const categoryList = ref([
    {
      id: 1,
      categoryNumber: 'CAT001',
      name: '办公设备',
      description: '办公室常用设备',
      createdAt: '2024-01-01',
      status: 'active',
    },
    {
      id: 2,
      categoryNumber: 'CAT002',
      name: '网络设备',
      description: '网络相关设备',
      createdAt: '2024-01-15',
      status: 'disabled',
    },
  ]);

  // 分页相关
  const currentPage = ref(1);
  const pageSize = ref(10);
  const total = ref(20);

  // 对话框控制
  const showAddDialog = ref(false);
  const showDeleteDialog = ref(false);
  const editingCategory = ref<any>(null);
  const deletingCategory = ref<any>(null);

  // 新增选择行数据
  const selectedRows = ref<any[]>([]);

  // 获取状态类型
  const getStatusType = (status: string) => {
    const statusMap: Record<string, 'normal' | 'warning' | 'success' | 'error'> = {
      active: 'success',
      disabled: 'error',
    };
    return statusMap[status] || 'normal';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      active: '启用',
      disabled: '禁用',
    };
    return statusMap[status] || status;
  };

  // 搜索
  const handleSearch = () => {
    // TODO: 实现搜索逻辑
    console.log('搜索条件:', searchForm.value);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.value = {
      categoryNumber: '',
      name: '',
      status: '',
    };
  };

  // 编辑类目
  const handleEdit = (category: any) => {
    editingCategory.value = category;
    categoryForm.value = { ...category };
    showAddDialog.value = true;
  };

  // 删除类目
  const handleDelete = (category: any) => {
    deletingCategory.value = category;
    showDeleteDialog.value = true;
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (deletingCategory.value) {
      // TODO: 实现删除逻辑
      console.log('删除类目:', deletingCategory.value);
      categoryList.value = categoryList.value.filter(
        (item) => item.id !== deletingCategory.value.id
      );
      showDeleteDialog.value = false;
      deletingCategory.value = null;
    }
  };

  // 保存类目
  const handleSave = () => {
    // TODO: 实现保存逻辑
    if (editingCategory.value) {
      // 编辑模式
      const index = categoryList.value.findIndex((item) => item.id === editingCategory.value.id);
      if (index !== -1) {
        categoryList.value[index] = {
          ...categoryList.value[index],
          ...categoryForm.value,
        };
      }
    } else {
      // 新增模式
      const newCategory = {
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        ...categoryForm.value,
      };
      categoryList.value.unshift(newCategory);
    }
    closeDialog();
  };

  // 关闭对话框
  const closeDialog = () => {
    showAddDialog.value = false;
    editingCategory.value = null;
    categoryForm.value = {
      categoryNumber: '',
      name: '',
      description: '',
      status: 'active',
    };
  };

  // 分页操作
  const handlePageChange = (page: number) => {
    currentPage.value = page;
    // TODO: 实现分页加载逻辑
  };

  // 添加 loading 状态
  const loading = ref(false);

  // 定义表格列配置
  const columns = [
    {
      key: 'categoryNumber',
      title: '分类编号',
      sortable: true
    },
    {
      key: 'name',
      title: '分类名称',
      sortable: true
    },
    {
      key: 'parentCategory',
      title: '上级分类'
    },
    {
      key: 'description',
      title: '描述'
    },
    {
      key: 'status',
      title: '状态',
      render: (row: any) => h(StatusTag, {
        status: getStatusType(row.status),
        text: getStatusText(row.status)
      })
    },
    {
      key: 'actions',
      title: '操作',
      width: 200,
      render: (row: any) => h(TableActions, {
        size: 'sm',
        actions: [
          {
            key: 'edit',
            text: '编辑',
            type: 'primary',
            onClick: () => handleEdit(row)
          },
          {
            key: 'delete',
            text: '删除',
            type: 'danger',
            onClick: () => handleDelete(row)
          }
        ]
      })
    }
  ];

  const selectedCategoryKeys = ref<string[]>([]);

  // 处理选择变化
  const handleSelectionChange = (keys: string[]) => {
    selectedCategoryKeys.value = keys;
  };

  // 处理排序
  const handleSort = (key: string, order: 'asc' | 'desc') => {
    // TODO: 实现排序逻辑
    console.log('排序:', key, order);
  };

  // 处理导出
  const handleExport = () => {
    // TODO: 实现导出逻辑
    console.log('导出选中的分类:', selectedCategoryKeys.value);
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedCategoryKeys.value.length === 0) {
      // TODO: 显示提示
      return;
    }
      // TODO: 实现批量删除逻辑
      console.log('批量删除分类:', selectedCategoryKeys.value);
  };
</script>
