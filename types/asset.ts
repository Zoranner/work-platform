export interface Category {
  id: number;
  categoryNo: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CategoryForm {
  categoryNo: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface CategorySearchForm {
  categoryNo: string;
  name: string;
  status: string;
}
