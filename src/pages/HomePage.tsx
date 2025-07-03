import React from 'react';
import SupportStatsSection from '../sections/SupportStatsSection';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
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
          {/* 分類卡片內容（靜態六張） */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* DOM APIs */}
            <div className="api-category-card bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                  <i className="ri-file-list-line ri-2x"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">DOM APIs</h3>
                <p className="text-gray-600 mb-4">操作文件物件模型的 API，包含選取、修改和監聽 DOM 元素的各種方法。</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="tag">Document</span>
                  <span className="tag">Element</span>
                  <span className="tag">Event</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">42 個 API</span>
                  <a href="#" className="text-primary hover:text-primary/80 font-medium text-sm flex items-center !rounded-button whitespace-nowrap">
                    <span>查看全部</span>
                    <div className="w-5 h-5 flex items-center justify-center ml-1">
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            {/* 裝置 APIs */}
            <div className="api-category-card bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                  <i className="ri-device-line ri-2x"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">裝置 APIs</h3>
                <p className="text-gray-600 mb-4">存取使用者裝置功能的 API，如地理位置、相機、麥克風和其他感測器資料。</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="tag">Geolocation</span>
                  <span className="tag">Camera</span>
                  <span className="tag">Sensors</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">28 個 API</span>
                  <a href="#" className="text-primary hover:text-primary/80 font-medium text-sm flex items-center !rounded-button whitespace-nowrap">
                    <span>查看全部</span>
                    <div className="w-5 h-5 flex items-center justify-center ml-1">
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            {/* 儲存 APIs */}
            <div className="api-category-card bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                  <i className="ri-database-2-line ri-2x"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">儲存 APIs</h3>
                <p className="text-gray-600 mb-4">在瀏覽器中儲存和管理資料的 API，從簡單的 key-value 儲存到複雜的資料庫系統。</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="tag">LocalStorage</span>
                  <span className="tag">IndexedDB</span>
                  <span className="tag">Cache</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">15 個 API</span>
                  <a href="#" className="text-primary hover:text-primary/80 font-medium text-sm flex items-center !rounded-button whitespace-nowrap">
                    <span>查看全部</span>
                    <div className="w-5 h-5 flex items-center justify-center ml-1">
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            {/* 網路 APIs */}
            <div className="api-category-card bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                  <i className="ri-wifi-line ri-2x"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">網路 APIs</h3>
                <p className="text-gray-600 mb-4">處理網路請求和通訊的 API，包含 HTTP 請求、WebSockets 和網路狀態監測。</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="tag">Fetch</span>
                  <span className="tag">WebSocket</span>
                  <span className="tag">XMLHttpRequest</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">18 個 API</span>
                  <a href="#" className="text-primary hover:text-primary/80 font-medium text-sm flex items-center !rounded-button whitespace-nowrap">
                    <span>查看全部</span>
                    <div className="w-5 h-5 flex items-center justify-center ml-1">
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            {/* 通知 APIs */}
            <div className="api-category-card bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                  <i className="ri-notification-4-line ri-2x"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">通知 APIs</h3>
                <p className="text-gray-600 mb-4">向使用者發送通知和提醒的 API，包含瀏覽器通知、推送通知和震動提醒。</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="tag">Notifications</span>
                  <span className="tag">Push</span>
                  <span className="tag">Vibration</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">9 個 API</span>
                  <a href="#" className="text-primary hover:text-primary/80 font-medium text-sm flex items-center !rounded-button whitespace-nowrap">
                    <span>查看全部</span>
                    <div className="w-5 h-5 flex items-center justify-center ml-1">
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            {/* 多媒體 APIs */}
            <div className="api-category-card bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                  <i className="ri-gamepad-line ri-2x"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">多媒體 APIs</h3>
                <p className="text-gray-600 mb-4">處理音訊、視訊和圖形的 API，包含媒體播放、錄製和處理功能。</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="tag">Audio</span>
                  <span className="tag">Video</span>
                  <span className="tag">Canvas</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">23 個 API</span>
                  <a href="#" className="text-primary hover:text-primary/80 font-medium text-sm flex items-center !rounded-button whitespace-nowrap">
                    <span>查看全部</span>
                    <div className="w-5 h-5 flex items-center justify-center ml-1">
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a href="#" className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
              <div className="w-5 h-5 flex items-center justify-center mr-2">
                <i className="ri-apps-line"></i>
              </div>
              <span>查看所有 API 分類</span>
            </a>
          </div>
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
              <div className="flex items-center border border-gray-200 rounded-full px-1 py-1">
                <button className="px-4 py-2 text-sm font-medium rounded-full bg-primary text-white whitespace-nowrap">最新</button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">熱門</button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">推薦</button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Web Animations API 卡片 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-full shrink-0 mr-3">
                      <i className="ri-file-code-line ri-lg"></i>
                    </div>
                    <div>
                      <h3 className="code-font font-medium text-gray-900">Web Animations API</h3>
                      <span className="text-xs text-gray-500">2025-07-01 更新</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center !rounded-button">
                      <i className="ri-bookmark-line"></i>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Web Animations API 提供了控制 CSS 動畫和 JavaScript 動畫的統一介面，讓開發者能夠更精確地控制動畫效果。</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="tag">Animation</span>
                  <span className="tag">CSS</span>
                  <span className="tag">JavaScript</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-5 h-5 flex items-center justify-center text-green-600 mr-1">
                      <i className="ri-check-line"></i>
                    </div>
                    <span className="text-xs text-gray-600">支援主流瀏覽器</span>
                  </div>
                  <a href="#" className="text-primary hover:text-primary/80 font-medium text-sm flex items-center !rounded-button whitespace-nowrap">
                    <span>查看詳情</span>
                    <div className="w-5 h-5 flex items-center justify-center ml-1">
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            {/* Fetch API 更新卡片 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-full shrink-0 mr-3">
                      <i className="ri-update-line ri-lg"></i>
                    </div>
                    <div>
                      <h3 className="code-font font-medium text-gray-900">Fetch API 更新</h3>
                      <span className="text-xs text-gray-500">2025-06-28 更新</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center !rounded-button">
                      <i className="ri-bookmark-line"></i>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Fetch API 更新包含 AbortController 和 Request/Response streams 的使用說明，讓網路請求處理更加靈活。</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="tag">Network</span>
                  <span className="tag">JavaScript</span>
                  <span className="tag">Async</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-5 h-5 flex items-center justify-center text-green-600 mr-1">
                      <i className="ri-check-line"></i>
                    </div>
                    <span className="text-xs text-gray-600">支援主流瀏覽器</span>
                  </div>
                  <a href="#" className="text-primary hover:text-primary/80 font-medium text-sm flex items-center !rounded-button whitespace-nowrap">
                    <span>查看詳情</span>
                    <div className="w-5 h-5 flex items-center justify-center ml-1">
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            {/* WebGPU API 卡片 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-full shrink-0 mr-3">
                      <i className="ri-add-line ri-lg"></i>
                    </div>
                    <div>
                      <h3 className="code-font font-medium text-gray-900">WebGPU API</h3>
                      <span className="text-xs text-gray-500">2025-06-25 更新</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center !rounded-button">
                      <i className="ri-bookmark-line"></i>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">WebGPU API 是新一代 Web 圖形 API，提供高效能圖形和計算功能，適合開發 3D 遊戲和複雜視覺應用。</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="tag">Graphics</span>
                  <span className="tag">Performance</span>
                  <span className="tag">3D</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-5 h-5 flex items-center justify-center text-yellow-600 mr-1">
                      <i className="ri-error-warning-line"></i>
                    </div>
                    <span className="text-xs text-gray-600">部分瀏覽器支援</span>
                  </div>
                  <a href="#" className="text-primary hover:text-primary/80 font-medium text-sm flex items-center !rounded-button whitespace-nowrap">
                    <span>查看詳情</span>
                    <div className="w-5 h-5 flex items-center justify-center ml-1">
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a href="#" className="inline-flex items-center px-6 py-3 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 whitespace-nowrap">
              <span>查看所有更新</span>
              <div className="w-5 h-5 flex items-center justify-center ml-2">
                <i className="ri-arrow-right-line"></i>
              </div>
            </a>
          </div>
        </div>
      </section>
      {/* 精選 API 教學區塊 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">精選 API 教學</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">透過我們精心準備的教學內容，快速掌握各種 Web API 的使用方法和最佳實踐</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 教學卡片 1 */}
            <div className="tutorial-card bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="relative h-48 overflow-hidden">
                <img src="https://readdy.ai/api/search-image?query=code%20editor%20with%20javascript%20syntax%20highlighting%2C%20showing%20web%20animation%20code%20example%2C%20clean%20modern%20interface%2C%20soft%20blue%20lighting%2C%20professional%20development%20environment&width=600&height=400&seq=tutorial1&orientation=landscape" alt="Web Animations API 教學" className="w-full h-full object-cover object-top" />
                <div className="absolute top-3 left-3 flex space-x-2">
                  <span className="difficulty-badge difficulty-intermediate">中級</span>
                  <span className="bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full">15 分鐘</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">使用 Web Animations API 創建流暢動畫</h3>
                <p className="text-sm text-gray-600 mb-4">學習如何使用 Web Animations API 創建複雜的關鍵幀動畫，並實現精確的動畫控制。</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="tag">Animation</span>
                  <span className="tag">Tutorial</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <img src="https://readdy.ai/api/search-image?query=professional%20asian%20male%20developer%20portrait%2C%20simple%20background%2C%20high%20quality%2C%20professional%20headshot&width=100&height=100&seq=author1&orientation=squarish" alt="作者頭像" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm text-gray-700">陳志明</span>
                  </div>
                  <span className="text-xs text-gray-500">2025-06-30</span>
                </div>
              </div>
            </div>
            {/* 教學卡片 2 */}
            <div className="tutorial-card bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="relative h-48 overflow-hidden">
                <img src="https://readdy.ai/api/search-image?query=modern%20web%20application%20showing%20local%20storage%20usage%2C%20browser%20developer%20tools%20open%2C%20clean%20interface%2C%20data%20visualization%20of%20storage%2C%20professional%20development%20environment&width=600&height=400&seq=tutorial2&orientation=landscape" alt="Web Storage API 教學" className="w-full h-full object-cover object-top" />
                <div className="absolute top-3 left-3 flex space-x-2">
                  <span className="difficulty-badge difficulty-beginner">初級</span>
                  <span className="bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full">10 分鐘</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Web Storage API 實用指南</h3>
                <p className="text-sm text-gray-600 mb-4">深入了解 localStorage 和 sessionStorage 的使用方法，以及如何有效管理網頁應用中的客戶端資料。</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="tag">Storage</span>
                  <span className="tag">Beginner</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <img src="https://readdy.ai/api/search-image?query=professional%20asian%20female%20developer%20portrait%2C%20simple%20background%2C%20high%20quality%2C%20professional%20headshot&width=100&height=100&seq=author2&orientation=squarish" alt="作者頭像" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm text-gray-700">林佳穎</span>
                  </div>
                  <span className="text-xs text-gray-500">2025-06-28</span>
                </div>
              </div>
            </div>
            {/* 教學卡片 3 */}
            <div className="tutorial-card bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="relative h-48 overflow-hidden">
                <img src="https://readdy.ai/api/search-image?query=web%20application%20showing%20geolocation%20map%20interface%2C%20with%20location%20tracking%2C%20clean%20modern%20design%2C%20map%20markers%20and%20user%20interface%20elements%2C%20professional%20development%20environment&width=600&height=400&seq=tutorial3&orientation=landscape" alt="Geolocation API 教學" className="w-full h-full object-cover object-top" />
                <div className="absolute top-3 left-3 flex space-x-2">
                  <span className="difficulty-badge difficulty-advanced">進階</span>
                  <span className="bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full">25 分鐘</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">打造位置感知的網頁應用</h3>
                <p className="text-sm text-gray-600 mb-4">使用 Geolocation API 結合地圖服務，創建具有位置感知功能的現代網頁應用。</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="tag">Geolocation</span>
                  <span className="tag">Maps</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <img src="https://readdy.ai/api/search-image?query=professional%20asian%20male%20developer%20portrait%2C%20different%20person%2C%20simple%20background%2C%20high%20quality%2C%20professional%20headshot&width=100&height=100&seq=author3&orientation=squarish" alt="作者頭像" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm text-gray-700">王建國</span>
                  </div>
                  <span className="text-xs text-gray-500">2025-06-25</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a href="#" className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
              <div className="w-5 h-5 flex items-center justify-center mr-2">
                <i className="ri-book-open-line"></i>
              </div>
              <span>瀏覽所有教學</span>
            </a>
          </div>
        </div>
      </section>
      {/* 瀏覽器支援統計區塊（靜態區塊，圖表可先留空 div） */}
      <SupportStatsSection />
      {/* 電子報訂閱區塊 */}
      <section className="py-16 bg-primary/5">
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
