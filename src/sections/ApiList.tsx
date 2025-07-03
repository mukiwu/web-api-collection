import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ApiFavoriteButton from '../components/ApiFavoriteButton';

export type Api = {
  id: string;
  name: string;
  description: string;
  category: string;
  homepage: string;
  tags: string[];
  icon: string;
  browsers: { icon: string; label: string }[];
  code: string;
  demo: React.ReactNode;
  favorite_count: number;
  created_at: string;
};

export const ApiList: React.FC = () => {
  const [apis, setApis] = useState<Api[]>([]);
  const navigate = useNavigate();

  const handleViewDetail = (api: Api) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(`/api/${api.id}`, { state: { api } });
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
    } else {
      navigate(`/api/${api.id}`, { state: { api } });
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  useEffect(() => {
    const fetchApis = async () => {
      const { data, error } = await supabase
      .from('apis_with_favorite_count')
      .select('*')
      .order('favorite_count', { ascending: false });
      if (data) {
        setApis(data);
      }
      if (error) {
        console.error('Error fetching APIs:', error);
      }
    };
    fetchApis();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {apis.map(api => (
        <div key={api.id} className="api-card bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="code-font text-lg font-semibold text-gray-900 flex items-center">
                <i className={`${api.icon} mr-2 text-primary`}></i>
                {api.name}
              </h3>
              <div className="flex space-x-1">
                <ApiFavoriteButton apiId={api.id} />
                <button className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-[8px]">
                  <i className="ri-share-line"></i>
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">{api.description}</p>
            {/* 瀏覽器相容性 */}
            <div className="mb-4">
              <h4 className="code-font text-sm font-medium text-gray-700 mb-2">瀏覽器相容性</h4>
              <div className="grid grid-cols-5 gap-2">
                {api.browsers.map(b => (
                  <div key={b.label} className="browser-icon flex flex-col items-center text-xs">
                    <div className="w-8 h-8 flex items-center justify-center mb-1 text-gray-700">
                      <i className={`${b.icon} ri-lg`}></i>
                    </div>
                    <span className="text-gray-600">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <button className="mt-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/80 transition hover:cursor-pointer" onClick={() => handleViewDetail(api)}>
                詳細內容
              </button>
            </div>
            {/* 程式碼範例 */}
            {/* <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="code-font text-sm font-medium text-gray-700">程式碼範例</h4>
                <button className="copy-button text-xs text-primary hover:text-primary/80 flex items-center rounded-[8px]">
                  <div className="w-4 h-4 flex items-center justify-center mr-1">
                    <i className="ri-clipboard-line"></i>
                  </div>
                  <span className="whitespace-nowrap">複製</span>
                </button>
              </div>
              <div className="code-block bg-slate-900 text-slate-100 rounded-lg overflow-x-auto">
                <pre className="p-4 text-xs font-mono whitespace-pre-wrap">{api.code}</pre>
              </div>
            </div> */}
            {/* 互動展示 */}
            {/* <div>
              <h4 className="code-font text-sm font-medium text-gray-700 mb-2">互動展示</h4>
              {api.demo}
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
}; 
