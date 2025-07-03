import React from 'react';

const updates = [
  {
    id: 'web-animations',
    icon: 'ri-file-code-line',
    title: 'Web Animations API',
    date: '2025-07-01',
    desc: '新增 Web Animations API 文件，包含詳細的動畫控制方法和範例。',
    tags: ['Animation', 'CSS', 'JavaScript'],
  },
  {
    id: 'fetch-update',
    icon: 'ri-update-line',
    title: 'Fetch API 更新',
    date: '2025-06-28',
    desc: '更新 Fetch API 文件，新增 AbortController 和 Request/Response streams 的使用說明。',
    tags: ['Network', 'JavaScript'],
  },
  {
    id: 'webgpu',
    icon: 'ri-add-line',
    title: 'WebGPU API',
    date: '2025-06-25',
    desc: '新增 WebGPU API 文件，提供高效能圖形和計算功能的新一代 Web 圖形 API。',
    tags: ['Graphics', 'Performance', '3D'],
  },
];

export const UpdatesSection: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="code-font text-xl font-semibold text-gray-900">最新更新</h2>
        <a href="#" className="text-sm text-primary hover:text-primary/80 flex items-center rounded-[8px]">
          <span className="whitespace-nowrap">查看全部</span>
          <div className="w-5 h-5 flex items-center justify-center ml-1">
            <i className="ri-arrow-right-line"></i>
          </div>
        </a>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {updates.map((item, idx) => (
            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-full shrink-0 mr-4">
                  <i className={`${item.icon} ri-lg`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="code-font font-medium text-gray-900">{item.title}</h3>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.desc}</p>
                  <div className="flex space-x-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 
