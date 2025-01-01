<script setup lang="ts">
interface Props {
  status: string
  type?: 'default' | 'success' | 'warning' | 'error' | 'info'
  text?: string
}

type StatusType = 'default' | 'success' | 'warning' | 'error' | 'info'

interface StatusConfig {
  type: StatusType
  text: string
}

type StatusMap = {
  [key: string]: StatusConfig
}

type TypeClasses = {
  [key in StatusType]: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default'
})

const statusMap: StatusMap = {
  // 档案状态
  normal: { type: 'success', text: '正常' },
  damaged: { type: 'error', text: '损坏' },
  borrowed: { type: 'warning', text: '借出' },
  
  // 资产状态
  in_use: { type: 'success', text: '使用中' },
  idle: { type: 'info', text: '闲置' },
  maintenance: { type: 'warning', text: '维修中' },
  scrapped: { type: 'error', text: '已报废' },
  
  // 项目状态
  planning: { type: 'info', text: '规划中' },
  in_progress: { type: 'warning', text: '进行中' },
  completed: { type: 'success', text: '已完成' },
  suspended: { type: 'error', text: '已暂停' },
  
  // 优先级
  low: { type: 'info', text: '低' },
  medium: { type: 'warning', text: '中' },
  high: { type: 'error', text: '高' }
}

const typeClasses: TypeClasses = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800'
}

const computedType = computed(() => {
  return statusMap[props.status]?.type || props.type
})

const computedText = computed(() => {
  return props.text || statusMap[props.status]?.text || props.status
})

const computedClasses = computed(() => {
  return [
    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
    typeClasses[computedType.value as StatusType]
  ].join(' ')
})
</script>

<template>
  <span :class="computedClasses">
    {{ computedText }}
  </span>
</template> 