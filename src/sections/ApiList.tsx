import React, { useEffect } from 'react';
import { useApiContext } from '../context/ApiContext';

// 假資料，後續可串接 API 或搬移自 collections.html
const mockApis = [
  {
    id: 'intersection-observer',
    name: 'Intersection Observer API',
    description: '用於監測元素進入或離開視窗的 API，可用於無限滾動、延遲載入等。',
    category: 'dom',
    tags: ['JavaScript', 'DOM'],
  },
  {
    id: 'web-speech',
    name: 'Web Speech API',
    description: '讓網頁應用能夠進行語音辨識和語音合成的 API。',
    category: 'media',
    tags: ['JavaScript', 'Speech'],
  },
  {
    id: 'web-storage',
    name: 'Web Storage API',
    description: '提供在瀏覽器中儲存資料的機制，包含 localStorage 和 sessionStorage。',
    category: 'storage',
    tags: ['JavaScript', 'Storage'],
  },
  {
    id: 'geolocation',
    name: 'Geolocation API',
    description: '允許網頁獲取使用者的地理位置資訊。',
    category: 'device',
    tags: ['JavaScript', 'Device'],
  },
];

interface ApiCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
}

const ApiCard: React.FC<ApiCardProps> = ({ name, description, tags }) => (
  <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 mb-4 hover:shadow-md transition-shadow">
    <h3 className="code-font text-lg font-semibold text-gray-900 mb-1">{name}</h3>
    <p className="text-gray-600 text-sm mb-2">{description}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">{tag}</span>
      ))}
    </div>
  </div>
);

export const ApiList: React.FC = () => {
  const { apis, setApis, category, search } = useApiContext();

  // 僅初始化一次假資料
  useEffect(() => {
    if (apis.length === 0) setApis(mockApis);
    // eslint-disable-next-line
  }, []);

  const filtered = apis.filter(api =>
    (!category || api.category === category) &&
    (!search || api.name.toLowerCase().includes(search.toLowerCase()) || api.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="code-font text-xl font-semibold text-gray-900">熱門 APIs</h2>
        <span className="text-xs text-gray-400">共 {filtered.length} 項</span>
      </div>
      <div>
        {filtered.length === 0 ? (
          <div className="text-gray-400 text-center py-8">查無符合條件的 API</div>
        ) : (
          filtered.map(api => <ApiCard key={api.id} {...api} />)
        )}
      </div>
    </div>
  );
} 
