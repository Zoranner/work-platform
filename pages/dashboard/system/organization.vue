<template>
  <div>
    <PageContainer>
      <!-- 页面标题和操作按钮 -->
      <PageHeader
        title="组织管理"
        :show-add-button="true"
        add-button-text="新建组织"
        @add="showAddDialog = true"
      />

      <!-- 搜索和筛选区域 -->
      <SearchSection @search="handleSearch" @reset="handleReset">
        <div>
          <label class="block text-sm font-medium text-gray-700">组织编号</label>
          <input
            type="text"
            v-model="searchForm.orgNumber"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">组织名称</label>
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
            <option value="active">启用</option>
            <option value="disabled">禁用</option>
          </select>
        </div>
      </SearchSection>

      <!-- 组织列表 -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                组织编号
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                组织名称
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                负责人
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                联系电话
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                创建时间
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                状态
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="org in orgList" :key="org.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ org.orgNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ org.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ org.manager }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ org.phone }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ org.createdAt }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <StatusTag :status="getStatusType(org.status)" :text="getStatusText(org.status)" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <TableActions
                  size="sm"
                  :actions="[
                    {
                      key: 'edit',
                      text: '编辑',
                      type: 'primary',
                      onClick: () => handleEdit(org),
                    },
                    {
                      key: 'delete',
                      text: '删除',
                      type: 'danger',
                      onClick: () => handleDelete(org),
                    },
                  ]"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <Pagination
          :current-page="currentPage"
          :total="total"
          :page-size="pageSize"
          @update:current-page="handlePageChange"
        />
      </div>
    </PageContainer>

    <!-- 新增/编辑对话框 -->
    <Modal v-model:visible="showAddDialog" :title="editingOrg ? '编辑组织' : '新建组织'">
      <div class="space-y-4">
        <FormInput
          v-model="orgForm.orgNumber"
          label="组织编号"
          placeholder="请输入组织编号"
          :disabled="!!editingOrg"
        />
        <FormInput v-model="orgForm.name" label="组织名称" placeholder="请输入组织名称" />
        <FormInput v-model="orgForm.manager" label="负责人" placeholder="请输入负责人" />
        <FormInput v-model="orgForm.phone" label="联系电话" placeholder="请输入联系电话" />
        <FormInput
          type="textarea"
          v-model="orgForm.description"
          label="描述"
          placeholder="请输入组织描述"
        />
        <FormSelect
          v-model="orgForm.status"
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
        <p class="text-sm text-gray-500">确定要删除该组织吗？此操作无法撤销。</p>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <Button @click="showDeleteDialog = false">取消</Button>
          <Button type="danger" @click="handleConfirmDelete">删除</Button>
        </div>
      </template>
    </Modal>
  </div>
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
    orgNumber: '',
    name: '',
    manager: '',
    status: '',
  });

  // 组织表单
  const orgForm = ref({
    orgNumber: '',
    name: '',
    manager: '',
    phone: '',
    description: '',
    status: 'active',
  });

  // 列表数据
  const orgList = ref([
    {
      id: 1,
      orgNumber: 'ORG001',
      name: '技术研发部',
      manager: '张三',
      phone: '13800138001',
      description: '负责公司技术研发工作',
      createdAt: '2024-01-01',
      status: 'active',
    },
    {
      id: 2,
      orgNumber: 'ORG002',
      name: '人力资源部',
      manager: '李四',
      phone: '13800138002',
      description: '负责公司人力资源管理工作',
      createdAt: '2024-01-15',
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
  const editingOrg = ref<any>(null);
  const deletingOrg = ref<any>(null);

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
      orgNumber: '',
      name: '',
      manager: '',
      status: '',
    };
  };

  // 编辑组织
  const handleEdit = (org: any) => {
    editingOrg.value = org;
    orgForm.value = { ...org };
    showAddDialog.value = true;
  };

  // 删除组织
  const handleDelete = (org: any) => {
    deletingOrg.value = org;
    showDeleteDialog.value = true;
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (deletingOrg.value) {
      // TODO: 实现删除逻辑
      console.log('删除组织:', deletingOrg.value);
      orgList.value = orgList.value.filter((item) => item.id !== deletingOrg.value.id);
      showDeleteDialog.value = false;
      deletingOrg.value = null;
    }
  };

  // 保存组织
  const handleSave = () => {
    // TODO: 实现保存逻辑
    if (editingOrg.value) {
      // 编辑模式
      const index = orgList.value.findIndex((item) => item.id === editingOrg.value.id);
      if (index !== -1) {
        orgList.value[index] = {
          ...orgList.value[index],
          ...orgForm.value,
        };
      }
    } else {
      // 新增模式
      const newOrg = {
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        ...orgForm.value,
      };
      orgList.value.unshift(newOrg);
    }
    closeDialog();
  };

  // 关闭对话框
  const closeDialog = () => {
    showAddDialog.value = false;
    editingOrg.value = null;
    orgForm.value = {
      orgNumber: '',
      name: '',
      manager: '',
      phone: '',
      description: '',
      status: 'active',
    };
  };

  // 分页操作
  const handlePageChange = (page: number) => {
    currentPage.value = page;
    // TODO: 实现分页加载逻辑
  };
</script>
