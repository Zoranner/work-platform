<script setup lang="ts">
  import type { VNode } from 'vue';

  interface Column {
    key: string;
    title: string;
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    render?: (row: any) => VNode | string;
    className?: string;
  }

  interface Props {
    columns: Column[];
    data: any[];
    loading?: boolean;
    bordered?: boolean;
    striped?: boolean;
    hover?: boolean;
    rowKey?: string;
    pagination?: boolean;
    currentPage?: number;
    pageSize?: number;
    total?: number;
  }

  interface Emits {
    (e: 'update:currentPage', page: number): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    bordered: false,
    striped: false,
    hover: true,
    rowKey: 'id',
    pagination: true,
    currentPage: 1,
    pageSize: 10,
    total: 0
  });

  const emit = defineEmits<Emits>();

  const tableClasses = computed(() => {
    return [
      'min-w-full',
      'divide-y',
      'divide-gray-200',
      props.bordered ? 'border border-gray-200' : ''
    ].filter(Boolean).join(' ');
  });

  const tbodyClasses = computed(() => {
    return [
      'bg-white',
      'divide-y',
      'divide-gray-200',
      props.striped ? 'divide-y-0' : ''
    ].filter(Boolean).join(' ');
  });

  const trClasses = computed(() => {
    return [
      props.striped ? 'even:bg-gray-50' : '',
      props.hover ? 'hover:bg-gray-50' : '',
      'transition-colors'
    ].filter(Boolean).join(' ');
  });

  const getCellValue = (row: any, column: Column) => {
    if (column.render) {
      return column.render(row);
    }
    return row[column.key];
  };

  const handlePageChange = (page: number) => {
    emit('update:currentPage', page);
  };
</script>

<template>
  <div>
    <div class="overflow-x-auto">
      <table :class="tableClasses">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :style="{ width: column.width }"
              :class="[
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                column.align === 'center' ? 'text-center' : '',
                column.align === 'right' ? 'text-right' : '',
                column.className
              ]"
            >
              {{ column.title }}
            </th>
          </tr>
        </thead>
        <tbody :class="tbodyClasses">
          <template v-if="loading">
            <tr>
              <td :colspan="columns.length" class="px-6 py-4 text-center text-sm text-gray-500">
                <div class="flex items-center justify-center">
                  <IconsLoadingIcon class="h-5 w-5 mr-2 animate-spin" />
                  加载中...
                </div>
              </td>
            </tr>
          </template>
          <template v-else-if="data.length === 0">
            <tr>
              <td :colspan="columns.length" class="px-6 py-4 text-center text-sm text-gray-500">
                暂无数据
              </td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="row in data"
              :key="row[rowKey]"
              :class="trClasses"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                :class="[
                  'px-6 py-4 whitespace-nowrap text-sm',
                  column.align === 'center' ? 'text-center' : '',
                  column.align === 'right' ? 'text-right' : '',
                  column.className
                ]"
              >
                <component
                  v-if="column.render"
                  :is="getCellValue(row, column)"
                />
                <template v-else>
                  {{ getCellValue(row, column) }}
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    
    <div
      v-if="pagination"
      class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
    >
      <Pagination
        :current-page="currentPage"
        :total="total"
        :page-size="pageSize"
        @update:current-page="handlePageChange"
      />
    </div>
  </div>
</template>
