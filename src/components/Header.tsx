import React from 'react';
import { SearchBar } from './SearchBar';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="code-font text-xl font-semibold mr-8">
            Web<span className="text-primary">APIs</span>
          </h1>
          <nav className="hidden md:flex space-x-6">
            <a href="/home" className="text-sm text-gray-900 hover:text-primary transition-colors">首頁</a>
            <a href="/collections" className="text-sm text-gray-900 hover:text-primary transition-colors">API 分類</a>
            <a href="/updates" className="text-sm text-gray-900 hover:text-primary transition-colors">最新更新</a>
            <a href="#" className="text-sm text-gray-900 hover:text-primary transition-colors">關於我們</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <SearchBar />
          <button className="text-sm font-medium text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-[8px] transition-colors">登入</button>
        </div>
      </div>
    </header>
  );
};

export default Header; 
