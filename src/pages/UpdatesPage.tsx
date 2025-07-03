import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UpdatesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="code-font text-3xl md:text-4xl font-bold text-gray-900 mb-2">最新更新<br />Web APIs 資源中心</h1>
        </div>
        {/* 篩選工具列 */}
        <div className="mb-10">
          <form className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            {/* 時間範圍 */}
            <div className="flex space-x-2">
              <button type="button" className="px-3 py-1 text-xs font-medium rounded-full bg-primary text-white whitespace-nowrap">最近一週</button>
              <button type="button" className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">一個月</button>
              <button type="button" className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">三個月</button>
              <button type="button" className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">全部</button>
            </div>
            {/* API 類型 */}
            <div>
              <select className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-hidden">
                <option>所有類型</option>
                <option>DOM APIs</option>
                <option>裝置 APIs</option>
                <option>儲存 APIs</option>
                <option>網路 APIs</option>
                <option>通知 APIs</option>
                <option>效能 APIs</option>
                <option>多媒體 APIs</option>
              </select>
            </div>
            {/* 瀏覽器支援 */}
            <div className="flex items-center space-x-2">
              <label className="flex items-center text-xs text-gray-700"><input type="checkbox" className="mr-1 accent-primary" defaultChecked /> Chrome</label>
              <label className="flex items-center text-xs text-gray-700"><input type="checkbox" className="mr-1 accent-primary" defaultChecked /> Firefox</label>
              <label className="flex items-center text-xs text-gray-700"><input type="checkbox" className="mr-1 accent-primary" defaultChecked /> Safari</label>
              <label className="flex items-center text-xs text-gray-700"><input type="checkbox" className="mr-1 accent-primary" defaultChecked /> Edge</label>
            </div>
            {/* 搜尋框 */}
            <div className="flex-1">
              <input type="text" placeholder="搜尋關鍵字..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:outline-hidden" />
            </div>
            {/* 結果計數 */}
            <div className="text-xs text-gray-500 whitespace-nowrap">共 <span>12</span> 筆結果</div>
          </form>
        </div>
        {/* 時間軸內容 */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>
          <div className="space-y-10">
            {/* 這裡可進一步元件化更新項目卡片 */}
          </div>
        </div>
        {/* 分頁與載入更多 */}
        <div className="mt-12 flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm text-gray-500 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed !rounded-button"><i className="ri-arrow-left-s-line"></i> 上一頁</button>
            <button className="px-3 py-2 text-sm bg-primary text-white rounded-md !rounded-button">1</button>
            <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md !rounded-button">2</button>
            <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md !rounded-button">3</button>
            <span className="px-2 text-sm text-gray-500">...</span>
            <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md !rounded-button">10</button>
            <button className="px-3 py-2 text-sm text-gray-500 hover:text-primary !rounded-button">下一頁 <i className="ri-arrow-right-s-line"></i></button>
          </div>
          <button className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 !rounded-button"><i className="ri-download-line mr-2"></i>載入更多</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpdatesPage; 
