<script setup lang="ts">
  import type { VNode } from 'vue';

  interface Column {
    key: string;
    title: string;
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    render?: (row: any) => VNode | string;
    className?: string;
    sortable?: boolean;
    fixed?: 'left' | 'right';
  }

  interface Props {
    columns: Column[];
    data: any[];
    loading?: boolean;
    bordered?: boolean;
    striped?: boolean;
    hover?: boolean;
    rowKey?: string;
    selection?: boolean;
    selectedKeys?: string[];
    rowClassName?: string | ((row: any) => string);
    toolbar?: boolean;
    toolbarActions?: { key: string; text: string; type?: string; onClick: () => void }[];
  }

  interface Emits {
    (e: 'update:selectedKeys', keys: string[]): void;
    (e: 'sort', key: string, order: 'asc' | 'desc'): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    bordered: false,
    striped: false,
    hover: true,
    rowKey: 'id',
    selection: false,
    selectedKeys: () => [],
    toolbar: false
  });

  const emit = defineEmits<Emits>();

  const selectedRowKeys = ref<string[]>(props.selectedKeys);

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

  const getRowClassName = (row: any) => {
    if (typeof props.rowClassName === 'function') {
      return props.rowClassName(row);
    }
    return props.rowClassName || '';
  };

  const getCellValue = (row: any, column: Column) => {
    if (column.render) {
      return column.render(row);
    }
    return row[column.key];
  };

  const handleSort = (column: Column) => {
    if (!column.sortable) return;
    const key = column.key;
    const currentOrder = sortState.value[key] || 'none';
    const nextOrder = currentOrder === 'none' ? 'asc' : currentOrder === 'asc' ? 'desc' : 'none';
    sortState.value = { [key]: nextOrder };
    if (nextOrder !== 'none') {
      emit('sort', key, nextOrder);
    }
  };

  const handleSelectAll = (e: Event) => {
    const checked = (e.target as HTMLInputElement).checked;
    const keys = checked ? props.data.map(row => row[props.rowKey]) : [];
    selectedRowKeys.value = keys;
    emit('update:selectedKeys', keys);
  };

  const handleSelectRow = (row: any) => {
    const key = row[props.rowKey];
    const index = selectedRowKeys.value.indexOf(key);
    if (index === -1) {
      selectedRowKeys.value.push(key);
    } else {
      selectedRowKeys.value.splice(index, 1);
    }
    emit('update:selectedKeys', selectedRowKeys.value);
  };

  const isSelected = (row: any) => {
    return selectedRowKeys.value.includes(row[props.rowKey]);
  };

  const sortState = ref<Record<string, 'none' | 'asc' | 'desc'>>({});

  watch(() => props.selectedKeys, (newKeys) => {
    selectedRowKeys.value = newKeys;
  }, { deep: true });
</script>

<template>
  <div>
    <div v-if="toolbar && toolbarActions?.length" class="mb-4 flex justify-end space-x-2">
      <Button
        v-for="action in toolbarActions"
        :key="action.key"
        :type="action.type"
        @click="action.onClick"
      >
        {{ action.text }}
      </Button>
    </div>

    <div class="overflow-x-auto">
      <table :class="tableClasses">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-if="selection"
              class="w-12 px-6 py-3"
            >
              <input
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                :checked="selectedRowKeys.length === data.length && data.length > 0"
                :indeterminate="selectedRowKeys.length > 0 && selectedRowKeys.length < data.length"
                @change="handleSelectAll"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              :style="{ width: column.width }"
              :class="[
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                column.align === 'center' ? 'text-center' : '',
                column.align === 'right' ? 'text-right' : '',
                column.className,
                column.sortable ? 'cursor-pointer select-none' : ''
              ]"
              @click="handleSort(column)"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.title }}</span>
                <span v-if="column.sortable" class="inline-flex flex-col">
                  <ChevronUpIcon
                    class="h-3 w-3"
                    :class="sortState[column.key] === 'asc' ? 'text-primary-600' : 'text-gray-400'"
                  />
                  <ChevronDownIcon
                    class="h-3 w-3 -mt-1"
                    :class="sortState[column.key] === 'desc' ? 'text-primary-600' : 'text-gray-400'"
                  />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody :class="tbodyClasses">
          <template v-if="loading">
            <tr>
              <td :colspan="selection ? columns.length + 1 : columns.length" class="px-6 py-4 text-center text-sm text-gray-500">
                <div class="flex items-center justify-center">
                  <LoadingIcon class="h-5 w-5 mr-2 animate-spin" />
                  加载中...
                </div>
              </td>
            </tr>
          </template>
          <template v-else-if="data.length === 0">
            <tr>
              <td :colspan="selection ? columns.length + 1 : columns.length" class="px-6 py-4 text-center text-sm text-gray-500">
                暂无数据
              </td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="row in data"
              :key="row[rowKey]"
              :class="[trClasses, getRowClassName(row)]"
            >
              <td
                v-if="selection"
                class="w-12 px-6 py-4"
              >
                <input
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  :checked="isSelected(row)"
                  @change="() => handleSelectRow(row)"
                />
              </td>
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
  </div>
</template>
