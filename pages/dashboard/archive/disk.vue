<template>
  <PageContainer>
    <!-- 页面标题和操作按钮 -->
    <PageHeader
      title="光盘档案"
      :show-add-button="true"
      add-button-text="新建光盘"
      @add="showAddDialog = true"
    />

    <!-- 搜索和筛选区域 -->
    <SearchSection @search="handleSearch" @reset="handleReset">
      <div>
        <label class="block text-sm font-medium text-gray-700">光盘编号</label>
        <input
          type="text"
          v-model="searchForm.diskNumber"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">光盘名称</label>
        <input
          type="text"
          v-model="searchForm.name"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">光盘类型</label>
        <select
          v-model="searchForm.type"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">全部</option>
          <option value="software">软件</option>
          <option value="document">文档</option>
          <option value="media">多媒体</option>
          <option value="backup">备份</option>
          <option value="other">其他</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">状态</label>
        <select
          v-model="searchForm.status"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">全部</option>
          <option value="active">正常</option>
          <option value="borrowed">已借出</option>
          <option value="damaged">已损坏</option>
        </select>
      </div>
    </SearchSection>

    <!-- 光盘列表 -->
    <div class="overflow-x-auto">
      <Table
        :columns="columns"
        :data="diskList"
        :loading="loading"
        :selection="true"
        :selected-keys="selectedDiskKeys"
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
  <Modal v-model:visible="showAddDialog" :title="editingDisk ? '编辑光盘' : '新建光盘'">
    <div class="space-y-4">
      <FormInput
        v-model="diskForm.diskNumber"
        label="光盘编号"
        placeholder="请输入光盘编号"
        :disabled="!!editingDisk"
      />
      <FormInput v-model="diskForm.name" label="光盘名称" placeholder="请输入光盘名称" />
      <FormSelect
        v-model="diskForm.type"
        label="光盘类型"
        :options="[
          { label: '软件', value: 'software' },
          { label: '文档', value: 'document' },
          { label: '多媒体', value: 'media' },
          { label: '备份', value: 'backup' },
          { label: '其他', value: 'other' },
        ]"
      />
      <FormInput v-model="diskForm.capacity" label="容量" placeholder="请输入光盘容量" />
      <FormInput v-model="diskForm.location" label="保管位置" placeholder="请输入保管位置" />
      <FormInput
        type="textarea"
        v-model="diskForm.description"
        label="描述"
        placeholder="请输入光盘描述"
      />
      <FormSelect
        v-model="diskForm.status"
        label="状态"
        :options="[
          { label: '正常', value: 'active' },
          { label: '已借出', value: 'borrowed' },
          { label: '已损坏', value: 'damaged' },
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
      <p class="text-sm text-gray-500">确定要删除该光盘吗？此操作无法撤销。</p>
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
    diskNumber: '',
    name: '',
    type: '',
    status: '',
  });

  // 光盘表单
  const diskForm = ref({
    diskNumber: '',
    name: '',
    type: 'software',
    capacity: '',
    location: '',
    description: '',
    status: 'active',
  });

  // 列表数据
  const diskList = ref([
    {
      id: 1,
      diskNumber: 'DISK001',
      name: '系统备份',
      type: 'backup',
      capacity: '4.7GB',
      location: 'A区-01-01',
      description: '系统完整备份',
      createdAt: '2024-01-01',
      status: 'active',
    },
    {
      id: 2,
      diskNumber: 'DISK002',
      name: '软件安装包',
      type: 'software',
      capacity: '8.5GB',
      location: 'B区-02-01',
      description: '常用软件安装包合集',
      createdAt: '2024-01-15',
      status: 'borrowed',
    },
  ]);

  // 分页相关
  const currentPage = ref(1);
  const pageSize = ref(10);
  const total = ref(20);

  // 对话框控制
  const showAddDialog = ref(false);
  const showDeleteDialog = ref(false);
  const editingDisk = ref<any>(null);
  const deletingDisk = ref<any>(null);

  // 获取类型文本
  const getTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      software: '软件',
      document: '文档',
      media: '多媒体',
      backup: '备份',
      other: '其他',
    };
    return typeMap[type] || type;
  };

  // 获取状态类型
  const getStatusType = (status: string) => {
    const statusMap: Record<string, 'normal' | 'warning' | 'success' | 'error'> = {
      active: 'success',
      borrowed: 'warning',
      damaged: 'error',
    };
    return statusMap[status] || 'normal';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      active: '正常',
      borrowed: '已借出',
      damaged: '已损坏',
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
      diskNumber: '',
      name: '',
      type: '',
      status: '',
    };
  };

  // 编辑光盘
  const handleEdit = (disk: any) => {
    editingDisk.value = disk;
    diskForm.value = { ...disk };
    showAddDialog.value = true;
  };

  // 删除光盘
  const handleDelete = (disk: any) => {
    deletingDisk.value = disk;
    showDeleteDialog.value = true;
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (deletingDisk.value) {
      // TODO: 实现删除逻辑
      console.log('删除光盘:', deletingDisk.value);
      diskList.value = diskList.value.filter((item) => item.id !== deletingDisk.value.id);
      showDeleteDialog.value = false;
      deletingDisk.value = null;
    }
  };

  // 保存光盘
  const handleSave = () => {
    // TODO: 实现保存逻辑
    if (editingDisk.value) {
      // 编辑模式
      const index = diskList.value.findIndex((item) => item.id === editingDisk.value.id);
      if (index !== -1) {
        diskList.value[index] = {
          ...diskList.value[index],
          ...diskForm.value,
        };
      }
    } else {
      // 新增模式
      const newDisk = {
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        ...diskForm.value,
      };
      diskList.value.unshift(newDisk);
    }
    closeDialog();
  };

  // 关闭对话框
  const closeDialog = () => {
    showAddDialog.value = false;
    editingDisk.value = null;
    diskForm.value = {
      diskNumber: '',
      name: '',
      type: 'software',
      capacity: '',
      location: '',
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

  // 添加选择行数据
  const selectedDiskKeys = ref<string[]>([]);

  // 处理选择变化
  const handleSelectionChange = (keys: string[]) => {
    selectedDiskKeys.value = keys;
  };

  // 处理排序
  const handleSort = (key: string, order: 'asc' | 'desc') => {
    // TODO: 实现排序逻辑
    console.log('排序:', key, order);
  };

  // 处理导出
  const handleExport = () => {
    // TODO: 实现导出逻辑
    console.log('导出选中的盘点记录:', selectedDiskKeys.value);
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedDiskKeys.value.length === 0) {
      // TODO: 显示提示
      return;
    }
    // TODO: 实现批量删除逻辑
    console.log('批量删除盘点记录:', selectedDiskKeys.value);
  };

  // 定义表格列配置
  const columns = [
    {
      key: 'diskNumber',
      title: '盘点编号',
      sortable: true
    },
    {
      key: 'name',
      title: '盘点名称',
      sortable: true
    },
    {
      key: 'manager',
      title: '负责人'
    },
    {
      key: 'startDate',
      title: '开始日期',
      sortable: true
    },
    {
      key: 'endDate',
      title: '结束日期',
      sortable: true
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
</script>
