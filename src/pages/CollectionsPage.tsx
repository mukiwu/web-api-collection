import React from 'react';
import { Aside } from '../sections/Aside';
import { ApiList } from '../sections/ApiList';
import { SearchBar } from '../components/SearchBar';
import { UpdatesSection } from '../sections/UpdatesSection';
import { SupportStatsSection } from '../sections/SupportStatsSection';

const CollectionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="code-font text-xl font-semibold mr-8">
              Web<span className="text-primary">APIs</span>
            </h1>
            <nav className="hidden md:flex space-x-6">
              <a href="/home" className="text-sm text-gray-900 hover:text-primary transition-colors">首頁</a>
              <a href="/collections" className="text-sm text-primary font-medium transition-colors">API 分類</a>
              <a href="/updates" className="text-sm text-gray-900 hover:text-primary transition-colors">最新更新</a>
              <a href="#" className="text-sm text-gray-900 hover:text-primary transition-colors">關於我們</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <SearchBar />
            <button className="text-sm font-medium text-white bg-primary hover:bg-primary/90 px-4 py-2 !rounded-button transition-colors">登入</button>
          </div>
        </div>
      </header>
      {/* Main Layout */}
      <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Aside */}
        <Aside />
        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="code-font text-3xl font-bold text-gray-900 mb-2">Web APIs 集合</h1>
            <p className="text-gray-600 max-w-2xl">
              探索現代瀏覽器提供的強大 Web APIs，提升您的網頁應用功能與使用者體驗。每個 API 都附有詳細說明、程式碼範例和瀏覽器相容性資訊。
            </p>
          </div>
          <ApiList />
          <UpdatesSection />
          <SupportStatsSection />
          {/* 之後可繼續元件化支援統計等區塊 */}
        </div>
      </main>
    </div>
  );
};

export default CollectionsPage; 
