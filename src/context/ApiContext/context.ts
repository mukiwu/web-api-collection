import { createContext } from 'react';
import type { TagMetadata } from '../../types';

export interface ApiContextType {
  popularTags: TagMetadata[];
  isLoadingTags: boolean;
  error: string | null;
  search: string;
  setSearch: (search: string) => void;
}

export const ApiContext = createContext<ApiContextType>({
  popularTags: [],
  isLoadingTags: false,
  error: null,
  search: '',
  setSearch: () => {},
}); 
