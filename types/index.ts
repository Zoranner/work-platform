// 通用接口定义
export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

// 通用响应接口
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 档案管理相关接口
export interface ArchiveBase {
  id: number
  archiveNo: string
  name: string
  location: string
  status: 'normal' | 'damaged' | 'borrowed'
  createdAt: string
  updatedAt: string
}

export interface DiskArchive extends ArchiveBase {
  diskType: 'CD' | 'DVD' | 'BD'
  capacity: string
  entryDate: string
}

export interface PaperArchive extends ArchiveBase {
  pageCount: number
  category: string
  securityLevel: string
}

// 资产管理相关接口
export interface AssetBase {
  id: number
  deviceNo: string
  name: string
  type: 'computer' | 'printer' | 'scanner' | 'server' | 'network' | 'other'
  model: string
  status: 'in_use' | 'idle' | 'maintenance' | 'scrapped'
  purchaseDate: string
  createdAt: string
  updatedAt: string
}

export interface DeviceAsset extends AssetBase {}

// 项目管理相关接口
export interface Project {
  id: number
  name: string
  code: string
  status: 'planning' | 'in_progress' | 'completed' | 'suspended'
  startDate: string
  endDate: string
  manager: string
  description: string
  progress: number
  priority: 'low' | 'medium' | 'high'
}

// 用户相关接口
export interface User {
  id: number
  username: string
  email: string
  role: string
  avatar?: string
  department: string
  lastLoginAt: string
} 