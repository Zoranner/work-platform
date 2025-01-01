<script setup lang="ts">
interface Props {
  currentPage: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
}

interface Emits {
  (e: 'update:currentPage', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'change', page: number, pageSize: number): void
}

const props = withDefaults(defineProps<Props>(), {
  showSizeChanger: true,
  showQuickJumper: true
})

const emit = defineEmits<Emits>()

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const pageSizeOptions = [10, 20, 50, 100]

const displayedPages = computed(() => {
  const current = props.currentPage
  const total = totalPages.value
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  range.push(1)

  for (let i = current - delta; i <= current + delta; i++) {
    if (i < total && i > 1) {
      range.push(i)
    }
  }

  if (total > 1) {
    range.push(total)
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
})

const handlePageChange = (page: number | string) => {
  if (typeof page === 'string' || page === props.currentPage) return
  emit('update:currentPage', page)
  emit('change', page, props.pageSize)
}

const handlePageSizeChange = (event: Event) => {
  const size = Number((event.target as HTMLSelectElement).value)
  emit('update:pageSize', size)
  emit('change', 1, size)
}

const jumpPage = ref('')

const handleJumpPage = () => {
  const page = Number(jumpPage.value)
  if (page && page >= 1 && page <= totalPages.value) {
    handlePageChange(page)
    jumpPage.value = ''
  }
}
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="handlePageChange(currentPage - 1)"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        上一页
      </button>
      <button
        @click="handlePageChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        下一页
      </button>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          显示第
          <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
          至
          <span class="font-medium">{{ Math.min(currentPage * pageSize, total) }}</span>
          条，共
          <span class="font-medium">{{ total }}</span>
          条记录
        </p>
      </div>
      <div class="flex items-center space-x-4">
        <select
          v-if="showSizeChanger"
          :value="pageSize"
          @change="handlePageSizeChange"
          class="rounded-md border-gray-300 py-1 text-base focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        >
          <option
            v-for="size in pageSizeOptions"
            :key="size"
            :value="size"
          >
            {{ size }} 条/页
          </option>
        </select>

        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">上一页</span>
            <IconsChevronDownIcon class="h-5 w-5 rotate-90" />
          </button>
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="page !== '...' ? handlePageChange(page) : undefined"
            :class="[
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
              page === currentPage
                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              page === '...' ? 'cursor-default' : ''
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">下一页</span>
            <IconsChevronDownIcon class="h-5 w-5 -rotate-90" />
          </button>
        </nav>

        <div v-if="showQuickJumper" class="flex items-center space-x-2">
          <span class="text-sm text-gray-700">跳至</span>
          <input
            v-model="jumpPage"
            type="number"
            min="1"
            :max="totalPages"
            @keyup.enter="handleJumpPage"
            class="w-16 rounded-md border-gray-300 py-1 text-base focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
          <span class="text-sm text-gray-700">页</span>
        </div>
      </div>
    </div>
  </div>
</template> 