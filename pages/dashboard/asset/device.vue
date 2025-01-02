<template>
  <PageContainer>
    <!-- 页面标题和操作按钮 -->
    <PageHeader
      title="设备管理"
      :show-add-button="true"
      add-button-text="新建设备"
      @add="showAddDialog = true"
    />

    <!-- 搜索和筛选区域 -->
    <SearchSection @search="handleSearch" @reset="handleReset">
      <div>
        <label class="block text-sm font-medium text-gray-700">设备编号</label>
        <input
          type="text"
          v-model="searchForm.deviceNumber"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">设备名称</label>
        <input
          type="text"
          v-model="searchForm.name"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">设备类型</label>
        <select
          v-model="searchForm.type"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">全部</option>
          <option value="computer">计算机</option>
          <option value="printer">打印机</option>
          <option value="network">网络设备</option>
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
          <option value="in_use">使用中</option>
          <option value="idle">闲置</option>
          <option value="maintenance">维修中</option>
          <option value="scrapped">已报废</option>
        </select>
      </div>
    </SearchSection>

    <!-- 设备列表 -->
    <div class="overflow-x-auto">
      <Table
        :columns="columns"
        :data="deviceList"
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
  <Modal v-model:visible="showAddDialog" :title="editingDevice ? '编辑设备' : '新建设备'">
    <div class="space-y-4">
      <FormInput
        v-model="deviceForm.deviceNumber"
        label="设备编号"
        placeholder="请输入设备编号"
        :disabled="!!editingDevice"
      />
      <FormInput v-model="deviceForm.name" label="设备名称" placeholder="请输入设备名称" />
      <FormSelect
        v-model="deviceForm.type"
        label="设备类型"
        :options="[
          { label: '计算机', value: 'computer' },
          { label: '打印机', value: 'printer' },
          { label: '网络设备', value: 'network' },
          { label: '其他', value: 'other' },
        ]"
      />
      <FormInput v-model="deviceForm.model" label="型号" placeholder="请输入设备型号" />
      <FormInput type="date" v-model="deviceForm.purchaseDate" label="购入日期" />
      <FormSelect
        v-model="deviceForm.status"
        label="状态"
        :options="[
          { label: '使用中', value: 'in_use' },
          { label: '闲置', value: 'idle' },
          { label: '维修中', value: 'maintenance' },
          { label: '已报废', value: 'scrapped' },
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
      <p class="text-sm text-gray-500">确定要删除该设备吗？此操作无法撤销。</p>
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
    deviceNumber: '',
    name: '',
    type: '',
    status: '',
  });

  // 设备表单
  const deviceForm = ref({
    deviceNumber: '',
    name: '',
    type: 'computer',
    model: '',
    purchaseDate: '',
    status: 'in_use',
  });

  // 列表数据
  const deviceList = ref([
    {
      id: 1,
      deviceNumber: 'DEV001',
      name: '办公电脑',
      type: 'computer',
      model: 'ThinkPad T490',
      purchaseDate: '2023-01-01',
      status: 'in_use',
    },
    {
      id: 2,
      deviceNumber: 'DEV002',
      name: '打印机',
      type: 'printer',
      model: 'HP LaserJet Pro',
      purchaseDate: '2023-02-15',
      status: 'maintenance',
    },
  ]);

  // 分页相关
  const currentPage = ref(1);
  const pageSize = ref(10);
  const total = ref(20);

  // 对话框控制
  const showAddDialog = ref(false);
  const showDeleteDialog = ref(false);
  const editingDevice = ref<any>(null);
  const deletingDevice = ref<any>(null);

  // 获取类型文本
  const getTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      computer: '计算机',
      printer: '打印机',
      network: '网络设备',
      other: '其他',
    };
    return typeMap[type] || type;
  };

  // 获取状态类型
  const getStatusType = (status: string) => {
    const statusMap: Record<string, 'normal' | 'warning' | 'success' | 'error'> = {
      in_use: 'success',
      idle: 'warning',
      maintenance: 'normal',
      scrapped: 'error',
    };
    return statusMap[status] || 'normal';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      in_use: '使用中',
      idle: '闲置',
      maintenance: '维修中',
      scrapped: '已报废',
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
      deviceNumber: '',
      name: '',
      type: '',
      status: '',
    };
  };

  // 编辑设备
  const handleEdit = (device: any) => {
    editingDevice.value = device;
    deviceForm.value = { ...device };
    showAddDialog.value = true;
  };

  // 删除设备
  const handleDelete = (device: any) => {
    deletingDevice.value = device;
    showDeleteDialog.value = true;
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (deletingDevice.value) {
      // TODO: 实现删除逻辑
      console.log('删除设备:', deletingDevice.value);
      deviceList.value = deviceList.value.filter((item) => item.id !== deletingDevice.value.id);
      showDeleteDialog.value = false;
      deletingDevice.value = null;
    }
  };

  // 保存设备
  const handleSave = () => {
    // TODO: 实现保存逻辑
    if (editingDevice.value) {
      // 编辑模式
      const index = deviceList.value.findIndex((item) => item.id === editingDevice.value.id);
      if (index !== -1) {
        deviceList.value[index] = {
          ...deviceList.value[index],
          ...deviceForm.value,
        };
      }
    } else {
      // 新增模式
      const newDevice = {
        id: Date.now(),
        ...deviceForm.value,
      };
      deviceList.value.unshift(newDevice);
    }
    closeDialog();
  };

  // 关闭对话框
  const closeDialog = () => {
    showAddDialog.value = false;
    editingDevice.value = null;
    deviceForm.value = {
      deviceNumber: '',
      name: '',
      type: 'computer',
      model: '',
      purchaseDate: '',
      status: 'in_use',
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
      key: 'deviceNumber',
      title: '设备编号',
      className: 'text-gray-900 font-medium'
    },
    {
      key: 'name',
      title: '设备名称'
    },
    {
      key: 'type',
      title: '设备类型',
      render: (row: any) => getTypeText(row.type)
    },
    {
      key: 'model',
      title: '型号'
    },
    {
      key: 'purchaseDate',
      title: '购入日期'
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
