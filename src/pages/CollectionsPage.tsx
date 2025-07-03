import React from 'react';
import { Aside } from '../sections/Aside';
import { ApiList } from '../sections/ApiList';
import { UpdatesSection } from '../sections/UpdatesSection';
import SupportStatsSection from '../sections/SupportStatsSection';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CollectionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />
      {/* Main Layout */}
      <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Aside */}
        <Aside />
        {/* Main Content */}
        
        <div className="flex-1">
          {/* 標題與說明 */}
          <div className="mb-8">
            <h1 className="code-font text-3xl font-bold text-gray-900 mb-2">Web APIs 集合</h1>
            <p className="text-gray-600">
              探索現代瀏覽器提供的強大 Web APIs，提升您的網頁應用功能與使用者體驗。<br />
              每個 API 都附有詳細說明、程式碼範例和瀏覽器相容性資訊。
            </p>
          </div>
          {/* 熱門 APIs 區塊（含篩選列） */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="code-font text-xl font-semibold text-gray-900">熱門 APIs</h2>
              <div className="flex items-center space-x-2">
                <button className="text-sm text-gray-500 hover:text-gray-900 flex items-center rounded-[8px]">
                  <div className="w-5 h-5 flex items-center justify-center mr-1">
                    <i className="ri-filter-3-line"></i>
                  </div>
                  <span className="whitespace-nowrap">篩選</span>
                </button>
                <div className="flex items-center border rounded-full px-1 py-1">
                  <button className="px-3 py-1 text-xs font-medium rounded-full bg-primary text-white whitespace-nowrap">最新</button>
                  <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">熱門</button>
                </div>
              </div>
            </div>
            {/* ApiList 元件（之後可細分卡片元件） */}
            <ApiList />
          </section>
          {/* 最新更新區塊 */}
          <section className="mb-8">
            <UpdatesSection />
          </section>
          {/* 支援統計區塊 */}
          <section>
            <SupportStatsSection />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionsPage; 
