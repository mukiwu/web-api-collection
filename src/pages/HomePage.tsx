import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
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
                <input type="search" placeholder="搜尋 API 文件、教學或範例..." className="w-full pl-12 pr-4 py-4 text-base border-none rounded-lg bg-white shadow-lg focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 flex items-center justify-center">
                  <i className="ri-search-line ri-lg"></i>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/collections" className="px-5 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center !rounded-button whitespace-nowrap">
                <div className="w-5 h-5 flex items-center justify-center mr-2">
                  <i className="ri-compass-3-line"></i>
                </div>
                <span>探索熱門 API</span>
              </a>
              <a href="#" className="px-5 py-3 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 flex items-center !rounded-button whitespace-nowrap">
                <div className="w-5 h-5 flex items-center justify-center mr-2">
                  <i className="ri-book-open-line"></i>
                </div>
                <span>開始學習</span>
              </a>
              <a href="/collections" className="px-5 py-3 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 flex items-center !rounded-button whitespace-nowrap">
                <div className="w-5 h-5 flex items-center justify-center mr-2">
                  <i className="ri-file-list-3-line"></i>
                </div>
                <span>API 資源集</span>
              </a>
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
          {/* 這裡可進一步元件化分類卡片 */}
          {/* ...分類卡片略，後續可元件化... */}
        </div>
      </section>
      {/* 最新更新的 API 區塊 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">最新更新的 API</h2>
              <p className="text-lg text-gray-600 max-w-2xl">瀏覽我們最近更新和新增的 API 文件，掌握最新的網頁技術發展</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center border rounded-full px-1 py-1">
                <button className="px-4 py-2 text-sm font-medium rounded-full bg-primary text-white whitespace-nowrap">最新</button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">熱門</button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">推薦</button>
              </div>
            </div>
          </div>
          {/* 這裡可進一步元件化 API 更新卡片 */}
        </div>
      </section>
      {/* 精選 API 教學區塊 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">精選 API 教學</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">透過我們精心準備的教學內容，快速掌握各種 Web API 的使用方法和最佳實踐</p>
          </div>
          {/* 這裡可進一步元件化教學卡片 */}
        </div>
      </section>
      {/* 瀏覽器支援統計區塊 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">瀏覽器支援統計</h2>
              <p className="text-lg text-gray-600">了解各種 Web API 在主流瀏覽器中的支援情況，做出更明智的開發決策</p>
            </div>
            {/* 這裡可進一步元件化支援統計圖表 */}
          </div>
        </div>
      </section>
      {/* 電子報訂閱區塊 */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">訂閱我們的電子報</h2>
            <p className="text-lg text-gray-600 mb-8">獲取最新的 Web API 更新、教學和開發技巧，直接發送到您的收件匣</p>
            <div className="flex max-w-xl mx-auto">
              <input type="email" placeholder="您的電子郵件地址" className="w-full px-5 py-4 text-base border-none rounded-l-lg bg-white shadow-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" />
              <button className="px-6 py-4 bg-primary text-white text-base font-medium rounded-r-lg hover:bg-primary/90 transition-colors !rounded-none whitespace-nowrap">訂閱</button>
            </div>
            <p className="text-sm text-gray-500 mt-4">我們尊重您的隱私，不會分享您的電子郵件地址。您可以隨時取消訂閱。</p>
          </div>
        </div>
      </section>
      {/* Footer 可獨立元件化 */}
    </div>
  );
};

export default HomePage; 
