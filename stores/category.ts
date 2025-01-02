import { defineStore } from 'pinia';
import type { Category, CategoryForm, CategorySearchForm } from '~/types/asset';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as Category[],
    loading: false,
    searchForm: {
      categoryNo: '',
      name: '',
      status: '',
    } as CategorySearchForm,
    currentPage: 1,
    pageSize: 10,
    total: 0,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      try {
        // TODO: 替换为实际的 API 调用
        const response = await Promise.resolve({
          list: [
            {
              id: 1,
              categoryNo: 'CAT20230001',
              name: '办公设备',
              description: '办公用电脑、打印机等设备',
              status: 'active' as const,
              createdAt: '2023-01-01',
              updatedAt: '2023-01-01',
            },
            {
              id: 2,
              categoryNo: 'CAT20230002',
              name: '网络设备',
              description: '路由器、交换机等网络设备',
              status: 'active' as const,
              createdAt: '2023-01-02',
              updatedAt: '2023-01-02',
            },
          ],
          total: 2,
        });
        this.categories = response.list;
        this.total = response.total;
      } catch (error) {
        console.error('获取类目列表失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createCategory(form: CategoryForm) {
      try {
        // TODO: 替换为实际的 API 调用
        await Promise.resolve();
        await this.fetchCategories();
      } catch (error) {
        console.error('创建类目失败:', error);
        throw error;
      }
    },

    async updateCategory(id: number, form: CategoryForm) {
      try {
        // TODO: 替换为实际的 API 调用
        await Promise.resolve();
        await this.fetchCategories();
      } catch (error) {
        console.error('更新类目失败:', error);
        throw error;
      }
    },

    async deleteCategory(id: number) {
      try {
        // TODO: 替换为实际的 API 调用
        await Promise.resolve();
        await this.fetchCategories();
      } catch (error) {
        console.error('删除类目失败:', error);
        throw error;
      }
    },

    setSearchForm(form: CategorySearchForm) {
      this.searchForm = form;
    },

    setCurrentPage(page: number) {
      this.currentPage = page;
    },

    setPageSize(size: number) {
      this.pageSize = size;
    },
  },
});
