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

interface CategoryButtonProps {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}
const CategoryButton: React.FC<CategoryButtonProps> = ({ label, icon, active, onClick }) => (
  <button
    className={`flex items-center w-full px-4 py-2 mb-1 rounded-lg text-sm transition-colors ${active ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
    onClick={onClick}
  >
    <i className={`${icon} mr-2`}></i>
    {label}
  </button>
);

interface TagButtonProps {
  tag: string;
  onClick: () => void;
}
const TagButton: React.FC<TagButtonProps> = ({ tag, onClick }) => (
  <button
    className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-primary/10 hover:text-primary transition-colors mr-2 mb-2"
    onClick={onClick}
  >
    #{tag}
  </button>
);

export const Aside: React.FC = () => {
  const { category, setCategory } = useApiContext();

  return (
    <aside className="md:w-64 flex-shrink-0 mb-8 md:mb-0">
      <div className="sticky top-24">
        <div className="mb-8">
          <h2 className="code-font text-base font-semibold text-gray-900 mb-3">API 分類</h2>
          <div>
            {categories.map(cat => (
              <CategoryButton
                key={cat.key}
                label={cat.label}
                icon={cat.icon}
                active={category === cat.key}
                onClick={() => setCategory(cat.key)}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="code-font text-base font-semibold text-gray-900 mb-3">熱門標籤</h2>
          <div className="flex flex-wrap">
            {tags.map(tag => (
              <TagButton key={tag} tag={tag} onClick={() => setCategory(tag.toLowerCase())} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}; 
