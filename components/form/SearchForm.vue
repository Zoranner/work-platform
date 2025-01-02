<script setup lang="ts">
  interface FormField {
    key: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'daterange' | 'number';
    placeholder?: string;
    options?: { label: string; value: any }[];
    span?: number;
  }

  interface Props {
    fields: FormField[];
    modelValue: Record<string, any>;
    loading?: boolean;
    cols?: number;
  }

  interface Emits {
    (e: 'update:modelValue', value: Record<string, any>): void;
    (e: 'search'): void;
    (e: 'reset'): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    cols: 4,
  });

  const emit = defineEmits<Emits>();

  const formData = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });

  const handleSearch = () => {
    emit('search');
  };

  const handleReset = () => {
    const resetData: Record<string, any> = {};
    props.fields.forEach((field) => {
      resetData[field.key] = '';
    });
    emit('update:modelValue', resetData);
    emit('reset');
  };

  const getFieldSpan = (field: FormField) => {
    return field.span || 1;
  };
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div :class="['grid gap-4', `grid-cols-1 md:grid-cols-${cols}`]">
      <div
        v-for="field in fields"
        :key="field.key"
        :class="['space-y-1', `md:col-span-${getFieldSpan(field)}`]"
      >
        <label class="block text-sm font-medium text-gray-700">{{ field.label }}</label>
        <template v-if="field.type === 'select'">
          <select
            v-model="formData[field.key]"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            :placeholder="field.placeholder"
          >
            <option value="">全部</option>
            <option v-for="option in field.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </template>
        <template v-else-if="field.type === 'date'">
          <input
            v-model="formData[field.key]"
            type="date"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            :placeholder="field.placeholder"
          />
        </template>
        <template v-else-if="field.type === 'daterange'">
          <div class="flex items-center space-x-2">
            <input
              v-model="formData[`${field.key}Start`]"
              type="date"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              :placeholder="field.placeholder && `${field.placeholder}开始`"
            />
            <span class="text-gray-500">至</span>
            <input
              v-model="formData[`${field.key}End`]"
              type="date"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              :placeholder="field.placeholder && `${field.placeholder}结束`"
            />
          </div>
        </template>
        <template v-else-if="field.type === 'number'">
          <input
            v-model.number="formData[field.key]"
            type="number"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            :placeholder="field.placeholder"
          />
        </template>
        <template v-else>
          <input
            v-model="formData[field.key]"
            type="text"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            :placeholder="field.placeholder"
          />
        </template>
      </div>
    </div>
    <div class="mt-4 flex justify-end space-x-2">
      <UiButton @click="handleSearch" :disabled="loading" type="primary" :loading="loading">
        搜索
      </UiButton>
      <UiButton @click="handleReset" :disabled="loading" type="secondary"> 重置 </UiButton>
    </div>
  </div>
</template>
