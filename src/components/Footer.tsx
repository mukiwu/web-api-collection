import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="code-font text-lg font-semibold text-gray-900 mb-4">Web<span className="text-primary">APIs</span></h3>
            <p className="text-sm text-gray-600 mb-4">全面收集和整理現代瀏覽器提供的 Web APIs，為開發者提供詳細的文件、程式碼範例和相容性資訊。</p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary hover:text-white transition-colors"><i className="ri-github-fill"></i></a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary hover:text-white transition-colors"><i className="ri-twitter-x-fill"></i></a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary hover:text-white transition-colors"><i className="ri-discord-fill"></i></a>
            </div>
          </div>
          <div>
            <h4 className="code-font font-medium text-gray-900 mb-4">API 分類</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">DOM APIs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">裝置 APIs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">儲存 APIs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">網路 APIs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">通知 APIs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">效能 APIs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">多媒體 APIs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="code-font font-medium text-gray-900 mb-4">資源連結</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">API 使用指南</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">最佳實踐</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">教學文章</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">影片教學</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">常見問題</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">API 更新日誌</a></li>
            </ul>
          </div>
          <div>
            <h4 className="code-font font-medium text-gray-900 mb-4">訂閱更新</h4>
            <p className="text-sm text-gray-600 mb-4">訂閱我們的電子報，獲取最新的 Web API 更新和教學文章。</p>
            <div className="flex">
              <input type="email" placeholder="您的電子郵件" className="w-full px-4 py-2 text-sm border-none rounded-l-md bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none shadow-sm" />
              <button className="px-4 py-2 bg-primary text-white text-sm rounded-r-md hover:bg-primary/90 transition-colors whitespace-nowrap">訂閱</button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">&copy; 2025 WebAPIs 資源庫. 保留所有權利.</p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">隱私政策</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">使用條款</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">Cookie 設定</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
