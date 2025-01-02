<template>
  <PageContainer>
    <!-- 页面标题和操作按钮 -->
    <PageHeader
      title="用户管理"
      :show-add-button="true"
      add-button-text="新建用户"
      @add="showAddDialog = true"
    />

    <!-- 搜索和筛选区域 -->
    <SearchSection @search="handleSearch" @reset="handleReset">
      <div>
        <label class="block text-sm font-medium text-gray-700">用户名</label>
        <input
          type="text"
          v-model="searchForm.username"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">姓名</label>
        <input
          type="text"
          v-model="searchForm.name"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">部门</label>
        <input
          type="text"
          v-model="searchForm.department"
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

    <!-- 用户列表 -->
    <Table
      :columns="columns"
      :data="userList"
      :loading="loading"
      :selection="true"
      :selected-keys="selectedUserKeys"
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
      @update:selected-keys="handleSelectionChange"
      @sort="handleSort"
    />

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
  <Modal v-model:visible="showAddDialog" :title="editingUser ? '编辑用户' : '新建用户'">
    <div class="space-y-4">
      <FormInput
        v-model="userForm.username"
        label="用户名"
        placeholder="请输入用户名"
        :disabled="!!editingUser"
      />
      <FormInput v-model="userForm.name" label="姓名" placeholder="请输入姓名" />
      <FormInput v-model="userForm.department" label="部门" placeholder="请输入部门" />
      <FormSelect
        v-model="userForm.role"
        label="角色"
        :options="[
          { label: '管理员', value: 'admin' },
          { label: '普通用户', value: 'user' },
        ]"
      />
      <FormInput type="email" v-model="userForm.email" label="邮箱" placeholder="请输入邮箱" />
      <FormInput
        type="password"
        v-model="userForm.password"
        label="密码"
        placeholder="请输入密码"
        v-if="!editingUser"
      />
      <FormSelect
        v-model="userForm.status"
        label="状态"
        :options="[
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'disabled' },
        ]"
      />
    </div>
    <template #footer>
      <div class="flex justify-end space-x-3">
        <UiButton @click="closeDialog">取消</UiButton>
        <UiButton type="primary" @click="handleSave">确定</UiButton>
      </div>
    </template>
  </Modal>

  <!-- 删除确认对话框 -->
  <Modal v-model:visible="showDeleteDialog" title="确认删除">
    <div class="mt-2">
      <p class="text-sm text-gray-500">确定要删除该用户吗？此操作无法撤销。</p>
    </div>
    <template #footer>
      <div class="flex justify-end space-x-3">
        <UiButton @click="showDeleteDialog = false">取消</UiButton>
        <UiButton type="danger" @click="handleConfirmDelete">删除</UiButton>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
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
    username: '',
    name: '',
    department: '',
    status: '',
  });

  // 用户表单
  const userForm = ref({
    username: '',
    name: '',
    department: '',
    role: 'user',
    email: '',
    password: '',
    status: 'active',
  });

  // 列表数据
  const userList = ref([
    {
      id: 1,
      username: 'admin',
      name: '系统管理员',
      department: '技术部',
      role: '管理员',
      email: 'admin@example.com',
      status: 'active',
    },
    {
      id: 2,
      username: 'user1',
      name: '张三',
      department: '人事部',
      role: '普通用户',
      email: 'zhangsan@example.com',
      status: 'active',
    },
  ]);

  // 分页相关
  const currentPage = ref(1);
  const pageSize = ref(10);
  const total = ref(20);

  // 对话框控制
  const showAddDialog = ref(false);
  const showDeleteDialog = ref(false);
  const editingUser = ref<any>(null);
  const deletingUser = ref<any>(null);

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
      username: '',
      name: '',
      department: '',
      status: '',
    };
  };

  // 编辑用户
  const handleEdit = (user: any) => {
    editingUser.value = user;
    const { password, ...rest } = user;
    userForm.value = { ...rest, password: '' };
    showAddDialog.value = true;
  };

  // 删除用户
  const handleDelete = (user: any) => {
    deletingUser.value = user;
    showDeleteDialog.value = true;
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (deletingUser.value) {
      // TODO: 实现删除逻辑
      console.log('删除用户:', deletingUser.value);
      userList.value = userList.value.filter((item) => item.id !== deletingUser.value.id);
      showDeleteDialog.value = false;
      deletingUser.value = null;
    }
  };

  // 保存用户
  const handleSave = () => {
    // TODO: 实现保存逻辑
    if (editingUser.value) {
      // 编辑模式
      const index = userList.value.findIndex((item) => item.id === editingUser.value.id);
      if (index !== -1) {
        const { password, ...rest } = userForm.value;
        userList.value[index] = {
          ...userList.value[index],
          ...rest,
        };
      }
    } else {
      // 新增模式
      const newUser = {
        id: Date.now(),
        ...userForm.value,
      };
      userList.value.unshift(newUser);
    }
    closeDialog();
  };

  // 关闭对话框
  const closeDialog = () => {
    showAddDialog.value = false;
    editingUser.value = null;
    userForm.value = {
      username: '',
      name: '',
      department: '',
      role: 'user',
      email: '',
      password: '',
      status: 'active',
    };
  };

  // 分页操作
  const handlePageChange = (page: number) => {
    currentPage.value = page;
    // TODO: 实现分页加载逻辑
  };

  // 表格列定义
  const columns = [
    {
      key: 'username',
      title: '用户名',
      sortable: true
    },
    {
      key: 'name',
      title: '姓名',
      sortable: true
    },
    {
      key: 'department',
      title: '部门'
    },
    {
      key: 'role',
      title: '角色'
    },
    {
      key: 'email',
      title: '邮箱'
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

  const loading = ref(false);
  const selectedUserKeys = ref<string[]>([]);

  // 处理选择变化
  const handleSelectionChange = (keys: string[]) => {
    selectedUserKeys.value = keys;
  };

  // 处理排序
  const handleSort = (key: string, order: 'asc' | 'desc') => {
    // TODO: 实现排序逻辑
    console.log('排序:', key, order);
  };

  // 处理导出
  const handleExport = () => {
    // TODO: 实现导出逻辑
    console.log('导出选中的用户:', selectedUserKeys.value);
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedUserKeys.value.length === 0) {
      // TODO: 显示提示
      return;
    }
    // TODO: 实现批量删除逻辑
    console.log('批量删除用户:', selectedUserKeys.value);
  };
</script>
