import React from 'react';
import { useApiContext } from '../context/ApiContext';

export const SearchBar: React.FC = () => {
  const { search, setSearch } = useApiContext();

  return (
    <div className="search-container relative">
      <input
        type="text"
        placeholder="搜尋 API..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="pl-10 pr-4 py-2 w-64 text-sm border-none rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
      />
      <div className="search-icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center">
        <i className="ri-search-line"></i>
      </div>
    </div>
  );
}; 
