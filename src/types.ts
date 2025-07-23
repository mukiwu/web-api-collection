// 瀏覽器相容性介面
export interface Browser {
  id: string;
  name: string;
  icon: string;
  version: string;
  supported: boolean;
}

// API 介面
export interface Api {
  id: string;
  name: string;
  icon: string;
  iconBg?: string;
  description: string;
  tags: string[];
  browsers: Browser[];
  isFavorite: boolean;
  favorite_count?: number;
  updated_at: string;
  created_at: string;
}

export interface TagMetadata {
  tag_name: string;
  display_name: string;
  description: string;
  icon_name: string;
  usage_count: number;
} 
