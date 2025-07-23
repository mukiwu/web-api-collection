import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiFavoriteButton from '../components/ApiFavoriteButton';
import { supabase } from '../supabaseClient';
import { getAnonymousId } from '../utils/anonymousId';
import type { Api, Browser } from '../types';

const UpdatesSection: React.FC = () => {
  const [tab, setTab] = useState('最新');
  const [apis, setApis] = useState<Api[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 取得 supabase 資料
  useEffect(() => {
    const fetchApis = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('apis_with_favorite_count')
        .select('*')
        .order(tab === '熱門' ? 'favorite_count' : 'updated_at', { ascending: false })
        .limit(3);

      let apisData = data as Api[] || [];
      
      // 查詢目前使用者收藏的 API id
      const anonymousId = getAnonymousId();
      const { data: favs } = await supabase
        .from('api_favorites')
        .select('api_id')
        .eq('anonymous_id', anonymousId);

      const favoriteIds = (favs || []).map(f => f.api_id);
      apisData = apisData.map(api => ({ ...api, isFavorite: favoriteIds.includes(api.id) }));
      setApis(apisData);
      
      if (error) {
        console.error('Error fetching APIs:', error);
      }
      setLoading(false);
    };
    fetchApis();
  }, [tab]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">最新更新的 API</h2>
            <p className="text-lg text-gray-600 max-w-2xl">瀏覽我們最近更新和新增的 API 文件，掌握最新的網頁技術發展</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center border border-gray-200 rounded-full px-1 py-1">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-full ${tab === '最新' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`} 
                onClick={() => setTab('最新')}
              >
                最新
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-full ${tab === '熱門' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`} 
                onClick={() => setTab('熱門')}
              >
                熱門
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-full ${tab === '推薦' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`} 
                onClick={() => setTab('推薦')}
              >
                推薦
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-gray-400 py-20">載入中...</div>
          ) : (
            apis.map(api => (
              <div
                key={api.id}
                className="api-card bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 p-6 flex flex-col justify-between cursor-pointer"
                onClick={() => 
                  document.startViewTransition(() => {
                    navigate(`/api/${api.id}`, { state: { api } });
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  })
                }
                tabIndex={0}
                role="button"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    document.startViewTransition(() => {
                      navigate(`/api/${api.id}`, { state: { api } });
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    });
                  }
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-full ${api.iconBg || 'bg-primary/10 text-primary'} mr-3`}>
                        <i className={`${api.icon} ri-lg`}></i>
                      </div>
                      <div>
                        <h3 className="code-font font-medium text-gray-900">{api.name}</h3>
                        <span className="text-xs text-gray-500">{new Date(api.updated_at).toLocaleDateString('zh-TW')} 更新</span>
                      </div>
                    </div>
                    <ApiFavoriteButton apiId={api.id} />
                  </div>

                  <p className="text-sm text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: api.description.replace(/\n/g, '<br />') }} />

                  <div className="flex flex-wrap gap-2 mb-4">
                    {api.tags.map((tag: string) => (
                      <span 
                        key={tag} 
                        className="tag"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 瀏覽器相容性區塊 */}
                  {Array.isArray(api.browsers) && api.browsers.length > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 flex items-center justify-center ${api.browsers.every((b: Browser) => b.supported) ? 'text-green-600' : 'text-yellow-600'} mr-1`}>
                          <i className={api.browsers.every((b: Browser) => b.supported) ? 'ri-check-line' : 'ri-error-warning-line'}></i>
                        </div>
                        <span className="text-xs text-gray-600">
                          {api.browsers.every((b: Browser) => b.supported) ? '支援主流瀏覽器' : '部分瀏覽器支援'}
                        </span>
                      </div>
                      <a href={`/api/${api.id}`} className="text-primary hover:text-primary/80 font-medium text-sm flex items-center !rounded-button whitespace-nowrap">
                        <span>查看詳情</span>
                        <div className="w-5 h-5 flex items-center justify-center ml-1">
                          <i className="ri-arrow-right-line"></i>
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-12 text-center">
          <a href="/collections" className="inline-flex items-center px-6 py-3 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 whitespace-nowrap">
            <span>查看所有更新</span>
            <div className="w-5 h-5 flex items-center justify-center ml-2">
              <i className="ri-arrow-right-line"></i>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default UpdatesSection; 
