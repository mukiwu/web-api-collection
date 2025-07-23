import React from 'react';
import SupportStatsSection from '../sections/SupportStatsSection';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useApi } from '../context/ApiContext/hook';
import { Skeleton } from '../components/ui/Skeleton';
import UpdatesSection from '../sections/UpdatesSection';

const HomePage: React.FC = () => {
  const { popularTags, isLoadingTags, error } = useApi();

  const renderTagCards = () => {
    if (isLoadingTags) {
      return Array(6).fill(null).map((_, index) => (
        <div key={index} className="api-category-card bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6">
            <Skeleton className="w-14 h-14 rounded-full mb-5" />
            <Skeleton className="h-7 w-3/4 mb-3" />
            <Skeleton className="h-20 w-full mb-4" />
            <div className="flex flex-wrap gap-2 mb-5">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>
      ));
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    return popularTags.map((tag) => (
      <div key={tag.tag_name} className="api-category-card bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
            <i className={`${tag.icon_name} ri-2x`}></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{tag.display_name}</h3>
          <p className="text-gray-600 mb-4">{tag.description}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {/* 這裡可以添加相關的子標籤，如果需要的話 */}
            <span className="tag">{tag.tag_name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{tag.usage_count} 個 API</span>
            <a href={`/collections?tag=${tag.tag_name}`} className="text-primary hover:text-primary/80 font-medium text-sm flex items-center !rounded-button whitespace-nowrap">
              <span>查看全部</span>
              <div className="w-5 h-5 flex items-center justify-center ml-1">
                <i className="ri-arrow-right-line"></i>
              </div>
            </a>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header 區塊 */}
      <Header />
      {/* Hero 區塊 */}
      <section className="relative overflow-hidden bg-cover bg-center" style={{backgroundImage: "url('https://readdy.ai/api/search-image?query=modern%20tech%20background%20with%20abstract%20digital%20network%20connections%2C%20soft%20blue%20and%20purple%20gradient%2C%20futuristic%20pattern%20with%20code%20elements%2C%20clean%20minimal%20design%20with%20soft%20lighting%20on%20right%20side%2C%20left%20side%20completely%20white%20for%20text%20overlay&width=1600&height=800&seq=hero1&orientation=landscape')"}}>
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="hero-gradient w-full md:w-3/5 lg:w-1/2 p-8 md:p-12 rounded-xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              探索現代網頁開發的<br /><span className="text-primary">強大 API 生態系統</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl">
              全面收集和整理現代瀏覽器提供的 Web APIs，為開發者提供詳細文件、程式碼範例和相容性資訊，助您打造更出色的網頁應用。
            </p>
            <div className="mb-8">
              <div className="relative max-w-xl">
                <input type="search" placeholder="搜尋 API 文件、教學或範例..." className="w-full pl-12 pr-4 py-4 text-base border-none rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 flex items-center justify-center">
                  <i className="ri-search-line ri-lg"></i>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/collections" className="px-5 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center whitespace-nowrap">
                <div className="w-5 h-5 flex items-center justify-center mr-2">
                  <i className="ri-compass-3-line"></i>
                </div>
                <span>探索熱門 API</span>
              </a>
              {/* <a href="#" className="px-5 py-3 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 flex items-center whitespace-nowrap">
                <div className="w-5 h-5 flex items-center justify-center mr-2">
                  <i className="ri-book-open-line"></i>
                </div>
                <span>開始學習</span>
              </a>
              <a href="/collections" className="px-5 py-3 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 flex items-center whitespace-nowrap">
                <div className="w-5 h-5 flex items-center justify-center mr-2">
                  <i className="ri-file-list-3-line"></i>
                </div>
                <span>API 資源集</span>
              </a> */}
            </div>
          </div>
        </div>
      </section>
      {/* 熱門 API 分類區塊 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">熱門 API 分類</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">瀏覽各種功能強大的 Web API 分類，助您實現各種網頁應用功能需求</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderTagCards()}
          </div>
          <div className="mt-12 text-center">
            <a href="/collections" className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
              <div className="w-5 h-5 flex items-center justify-center mr-2">
                <i className="ri-apps-line"></i>
              </div>
              <span>查看所有 API 分類</span>
            </a>
          </div>
        </div>
      </section>
      {/* 最新更新的 API 區塊 */}
      <UpdatesSection />
      {/* 瀏覽器支援統計區塊 */}
      <SupportStatsSection />
      {/* 電子報訂閱區塊 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">訂閱我們的電子報</h2>
            <p className="text-lg text-gray-600 mb-8">獲取最新的 Web API 更新、教學和開發技巧，直接發送到您的收件匣</p>
            <div className="flex max-w-xl mx-auto">
              <input type="email" placeholder="您的電子郵件地址" className="w-full px-5 py-4 text-base border-none rounded-l-lg bg-white shadow-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" />
              <button className="px-6 py-4 bg-primary text-white text-base font-medium rounded-r-lg hover:bg-primary/90 transition-colors whitespace-nowrap">訂閱</button>
            </div>
            <p className="text-sm text-gray-500 mt-4">我們尊重您的隱私，不會分享您的電子郵件地址。您可以隨時取消訂閱。</p>
          </div>
        </div>
      </section>
      {/* Footer 區塊 */}
      <Footer />
    </div>
  );
};

export default HomePage; 
