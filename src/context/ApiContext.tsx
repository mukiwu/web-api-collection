import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// 定義 API 資料型別
export interface ApiItem {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  // ...可依需求擴充
}

interface ApiContextType {
  apis: ApiItem[];
  setApis: (apis: ApiItem[]) => void;
  search: string;
  setSearch: (search: string) => void;
  category: string;
  setCategory: (category: string) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [apis, setApis] = useState<ApiItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  return (
    <ApiContext.Provider value={{ apis, setApis, search, setSearch, category, setCategory }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApiContext = () => {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApiContext 必須在 ApiProvider 內使用');
  return ctx;
}; 
