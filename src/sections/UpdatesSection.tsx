import React from 'react';

const updates = [
  {
    id: 'web-animations',
    title: 'Web Animations API',
    date: '2025-07-01',
    desc: '新增 Web Animations API 文件，包含詳細的動畫控制方法和範例。',
    tags: ['Animation', 'CSS', 'JavaScript'],
  },
  {
    id: 'fetch-update',
    title: 'Fetch API 更新',
    date: '2025-06-28',
    desc: '更新 Fetch API 文件，新增 AbortController 和 Request/Response streams 的使用說明。',
    tags: ['Network', 'JavaScript'],
  },
  {
    id: 'webgpu',
    title: 'WebGPU API',
    date: '2025-06-25',
    desc: '新增 WebGPU API 文件，提供高效能圖形和計算功能的新一代 Web 圖形 API。',
    tags: ['Graphics', 'Performance', '3D'],
  },
];

interface UpdateItemProps {
  title: string;
  date: string;
  desc: string;
  tags: string[];
}

const UpdateItem: React.FC<UpdateItemProps> = ({ title, date, desc, tags }) => (
  <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 mb-4">
    <div className="flex items-center justify-between mb-1">
      <h3 className="code-font text-base font-semibold text-gray-900">{title}</h3>
      <span className="text-xs text-gray-400">{date}</span>
    </div>
    <p className="text-gray-600 text-sm mb-2">{desc}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">{tag}</span>
      ))}
    </div>
  </div>
);

export const UpdatesSection: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="code-font text-xl font-semibold text-gray-900">最新 API 更新</h2>
      </div>
      <div>
        {updates.length === 0 ? (
          <div className="text-gray-400 text-center py-8">暫無更新</div>
        ) : (
          updates.map(update => <UpdateItem key={update.id} {...update} />)
        )}
      </div>
    </div>
  );
} 
