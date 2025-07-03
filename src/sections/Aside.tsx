import React from 'react';
import { useApiContext } from '../context/ApiContext';

const categories = [
  { key: '', label: '所有 APIs', icon: 'ri-layout-grid-line' },
  { key: 'dom', label: 'DOM APIs', icon: 'ri-file-list-line' },
  { key: 'device', label: '裝置 APIs', icon: 'ri-device-line' },
  { key: 'storage', label: '儲存 APIs', icon: 'ri-database-2-line' },
  { key: 'network', label: '網路 APIs', icon: 'ri-wifi-line' },
  { key: 'notification', label: '通知 APIs', icon: 'ri-notification-4-line' },
  { key: 'performance', label: '效能 APIs', icon: 'ri-timer-line' },
  { key: 'media', label: '多媒體 APIs', icon: 'ri-gamepad-line' },
];

const tags = [
  'JavaScript', 'HTML5', 'CSS', 'Animation', 'Storage', 'Mobile'
];

export const Aside: React.FC = () => {
  const { category, setCategory } = useApiContext();

  return (
    <aside className="md:w-64 shrink-0">
      <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="code-font font-medium text-gray-900">API 分類</h2>
        </div>
        <nav className="p-2">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`flex items-center px-3 py-2 rounded-md text-sm mb-1 transition-colors ${category === cat.key ? 'bg-primary/5 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setCategory(cat.key)}
            >
              <div className="w-5 h-5 flex items-center justify-center mr-2">
                <i className={cat.icon}></i>
              </div>
              <span>{cat.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <h3 className="code-font font-medium text-gray-900 mb-3">熱門標籤</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                className={`tag${category === tag.toLowerCase() ? ' active' : ''}`}
                onClick={() => setCategory(tag.toLowerCase())}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}; 
