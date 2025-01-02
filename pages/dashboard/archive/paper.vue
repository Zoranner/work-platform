<template>
  <PageContainer>
    <!-- 页面标题和操作按钮 -->
    <PageHeader
      title="档案管理"
      :show-add-button="true"
      add-button-text="新建档案"
      @add="showAddDialog = true"
    />

    <!-- 搜索和筛选区域 -->
    <SearchSection @search="handleSearch" @reset="handleReset">
      <div>
        <label class="block text-sm font-medium text-gray-700">档案编号</label>
        <input
          type="text"
          v-model="searchForm.paperNumber"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">档案名称</label>
        <input
          type="text"
          v-model="searchForm.name"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">档案类型</label>
        <select
          v-model="searchForm.type"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">全部</option>
          <option value="contract">合同</option>
          <option value="invoice">发票</option>
          <option value="certificate">证书</option>
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
          <option value="archived">已归档</option>
          <option value="borrowed">已借出</option>
        </select>
      </div>
    </SearchSection>

    <!-- 档案列表 -->
    <div class="overflow-x-auto">
      <Table
        :columns="columns"
        :data="paperList"
        :loading="loading"
        :current-page="currentPage"
        :total="total"
        :page-size="pageSize"
        @update:current-page="handlePageChange"
        hover
        striped
      />
    </div>
  </PageContainer>

  <!-- 新增/编辑对话框 -->
  <Modal v-model:visible="showAddDialog" :title="editingPaper ? '编辑档案' : '新建档案'">
    <div class="space-y-4">
      <FormInput
        v-model="paperForm.paperNumber"
        label="档案编号"
        placeholder="请输入档案编号"
        :disabled="!!editingPaper"
      />
      <FormInput v-model="paperForm.name" label="档案名称" placeholder="请输入档案名称" />
      <FormSelect
        v-model="paperForm.type"
        label="档案类型"
        :options="[
          { label: '合同', value: 'contract' },
          { label: '发票', value: 'invoice' },
          { label: '证书', value: 'certificate' },
          { label: '其他', value: 'other' },
        ]"
      />
      <FormInput v-model="paperForm.location" label="保管位置" placeholder="请输入保管位置" />
      <FormInput
        type="textarea"
        v-model="paperForm.description"
        label="描述"
        placeholder="请输入档案描述"
      />
      <FormSelect
        v-model="paperForm.status"
        label="状态"
        :options="[
          { label: '正常', value: 'active' },
          { label: '已归档', value: 'archived' },
          { label: '已借出', value: 'borrowed' },
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
      <p class="text-sm text-gray-500">确定要删除该档案吗？此操作无法撤销。</p>
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
    paperNumber: '',
    name: '',
    type: '',
    status: '',
  });

  // 档案表单
  const paperForm = ref({
    paperNumber: '',
    name: '',
    type: 'contract',
    location: '',
    description: '',
    status: 'active',
  });

  // 列表数据
  const paperList = ref([
    {
      id: 1,
      paperNumber: 'DOC001',
      name: '采购合同',
      type: 'contract',
      location: 'A区-01-01',
      description: '2024年度办公用品采购合同',
      createdAt: '2024-01-01',
      status: 'active',
    },
    {
      id: 2,
      paperNumber: 'DOC002',
      name: '软件授权证书',
      type: 'certificate',
      location: 'B区-02-01',
      description: '企业软件授权证书',
      createdAt: '2024-01-15',
      status: 'archived',
    },
  ]);

  // 分页相关
  const currentPage = ref(1);
  const pageSize = ref(10);
  const total = ref(20);

  // 对话框控制
  const showAddDialog = ref(false);
  const showDeleteDialog = ref(false);
  const editingPaper = ref<any>(null);
  const deletingPaper = ref<any>(null);

  // 获取类型文本
  const getTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      contract: '合同',
      invoice: '发票',
      certificate: '证书',
      other: '其他',
    };
    return typeMap[type] || type;
  };

  // 获取状态类型
  const getStatusType = (status: string) => {
    const statusMap: Record<string, 'normal' | 'warning' | 'success' | 'error'> = {
      active: 'success',
      archived: 'normal',
      borrowed: 'warning',
    };
    return statusMap[status] || 'normal';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      active: '正常',
      archived: '已归档',
      borrowed: '已借出',
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
      paperNumber: '',
      name: '',
      type: '',
      status: '',
    };
  };

  // 编辑档案
  const handleEdit = (paper: any) => {
    editingPaper.value = paper;
    paperForm.value = { ...paper };
    showAddDialog.value = true;
  };

  // 删除档案
  const handleDelete = (paper: any) => {
    deletingPaper.value = paper;
    showDeleteDialog.value = true;
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (deletingPaper.value) {
      // TODO: 实现删除逻辑
      console.log('删除档案:', deletingPaper.value);
      paperList.value = paperList.value.filter((item) => item.id !== deletingPaper.value.id);
      showDeleteDialog.value = false;
      deletingPaper.value = null;
    }
  };

  // 保存档案
  const handleSave = () => {
    // TODO: 实现保存逻辑
    if (editingPaper.value) {
      // 编辑模式
      const index = paperList.value.findIndex((item) => item.id === editingPaper.value.id);
      if (index !== -1) {
        paperList.value[index] = {
          ...paperList.value[index],
          ...paperForm.value,
        };
      }
    } else {
      // 新增模式
      const newPaper = {
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        ...paperForm.value,
      };
      paperList.value.unshift(newPaper);
    }
    closeDialog();
  };

  // 关闭对话框
  const closeDialog = () => {
    showAddDialog.value = false;
    editingPaper.value = null;
    paperForm.value = {
      paperNumber: '',
      name: '',
      type: 'contract',
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

  // 定义表格列配置
  const columns = [
    {
      key: 'paperNumber',
      title: '档案编号',
      className: 'text-gray-900 font-medium'
    },
    {
      key: 'name',
      title: '档案名称'
    },
    {
      key: 'type',
      title: '档案类型',
      render: (row: any) => getTypeText(row.type)
    },
    {
      key: 'location',
      title: '保管位置'
    },
    {
      key: 'createdAt',
      title: '创建时间'
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
      width: '160px',
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
