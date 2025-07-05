import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';
import ApiFavoriteButton from '../components/ApiFavoriteButton';
import { getAnonymousId } from '../utils/anonymousId';
import { useNavigate } from 'react-router-dom';

// 假資料：分類
const categories = [
  '全部', 'DOM', '網路', '儲存', '裝置', '多媒體', '效能', '圖形', '通知', '檔案', '背景處理', '安全', '其他'
];

export type Api = {
  id: string;
  name: string;
  icon: string;
  iconBg?: string;
  usage: number;
  difficulty: string;
  description: string;
  tags: string[];
  favorite: boolean;
  browsers?: { id: string; name: string; icon: string; version: string; supported: boolean }[];
  isFavorite?: boolean;
  // 其他欄位可依 supabase schema 擴充
};

// 工具函式：根據 supported 顯示版本或『不支援』
function browserSupportText(version: string, supported: boolean) {
  return supported ? version : '不支援';
}

const CollectionsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [showFavoriteOnly, setShowFavoriteOnly] = useState(false);
  const [sortType] = useState('使用率排序');
  const [tab, setTab] = useState('最新');
  const [page, setPage] = useState(1);
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
        .order(tab === '熱門' ? 'favorite_count' : 'created_at', { ascending: false });
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

  // 篩選
  const filteredApis = apis.filter(api =>
    (activeCategory === '全部' || api.tags.includes(activeCategory)) &&
    (!showFavoriteOnly || api.isFavorite)
  );

  // 分頁（假設每頁 6 筆）
  const pageSize = 6;
  const totalPages = Math.ceil(filteredApis.length / pageSize) || 1;
  const pagedApis = filteredApis.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* 分類橫向 tag */}
      <div className="bg-white border-b border-gray-100 sticky top-[57px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 py-3 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                className={`tag whitespace-nowrap px-4 py-2 ${activeCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'} font-medium rounded-full transition-colors`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* 篩選/排序/收藏/最新熱門 toggle */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-4">
              {/* 篩選條件下拉 */}
              <div className="relative">
                <button className="flex items-center space-x-2 text-sm text-gray-700 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50" type="button">
                  <i className="ri-filter-3-line w-5 h-5"></i>
                  <span>篩選條件</span>
                  <i className="ri-arrow-down-s-line w-5 h-5"></i>
                </button>
                {/* 篩選下拉內容可用 popover 實作 */}
              </div>
              {/* 排序下拉 */}
              <div className="relative">
                <button className="flex items-center space-x-2 text-sm text-gray-700 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50" type="button">
                  <i className="ri-sort-desc w-5 h-5"></i>
                  <span>{sortType}</span>
                  <i className="ri-arrow-down-s-line w-5 h-5"></i>
                </button>
                {/* 排序下拉內容可用 popover 實作 */}
              </div>
              {/* 收藏顯示 toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">收藏顯示</span>
                <label className="relative inline-block w-10 h-6 align-middle select-none">
                  <input type="checkbox" checked={showFavoriteOnly} onChange={e => setShowFavoriteOnly(e.target.checked)} className="absolute w-0 h-0 opacity-0" />
                  <span className={`block w-10 h-6 rounded-full transition bg-gray-200 ${showFavoriteOnly ? 'bg-primary/60' : ''}`}></span>
                  <span className={`dot absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition ${showFavoriteOnly ? 'translate-x-4 bg-primary' : ''}`}></span>
                </label>
              </div>
            </div>
            {/* 最新/熱門 toggle */}
            <div className="flex items-center border border-gray-200 rounded-full px-1 py-1">
              <button className={`px-4 py-2 text-sm font-medium rounded-full ${tab === '最新' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setTab('最新')}>最新</button>
              <button className={`px-4 py-2 text-sm font-medium rounded-full ${tab === '熱門' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setTab('熱門')}>熱門</button>
            </div>
          </div>
        </div>
      </div>
      {/* API 卡片列表 */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center text-gray-400 py-20">載入中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedApis.map(api => (
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
                      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${api.iconBg || 'bg-primary/10 text-primary'} mr-3`}>
                        <i className={`${api.icon} ri-2x`}></i>
                      </div>
                      <div>
                        <h3 className="code-font font-medium text-gray-900 text-lg">{api.name}</h3>
                        <div className="flex items-center mt-1 space-x-2">
                          {api.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <ApiFavoriteButton apiId={api.id} />
                  </div>
                  <p className="text-sm text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: api.description.replace(/\n/g, '<br />') }} />
                  {/* 瀏覽器相容性區塊 */}
                  {Array.isArray(api.browsers) && api.browsers.length > 0 && (
                    <div className="mb-4 border-t border-gray-100 pt-4">
                      <h4 className="code-font text-sm font-medium text-gray-700 mb-2">瀏覽器相容性</h4>
                      <div className="flex flex-wrap justify-between md:flex-nowrap gap-3 md:gap-4">
                        {api.browsers.map(b => (
                          <div key={b.id} className="browser-icon flex flex-col items-center text-xs">
                            <div className={`w-8 h-8 flex items-center justify-center ${b.supported ? 'text-gray-700' : 'text-gray-300'}`}>
                              <i className={`${b.icon} ri-xl`}></i>
                            </div>
                            <span className={`${b.supported ? 'text-gray-600' : 'text-gray-400'}`}>{b.name}</span>
                            <span className={`${b.supported ? 'text-gray-600' : 'text-gray-400'}`}>{browserSupportText(b.version, b.supported)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* 分頁按鈕 */}
        <div className="flex justify-between items-center mt-10">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            <i className="ri-arrow-left-s-line w-5 h-5 mr-1"></i>上一頁
          </button>
          <div className="flex items-center">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button key={idx} onClick={() => setPage(idx + 1)} className={`w-9 h-9 flex items-center justify-center rounded-lg mx-1 ${page === idx + 1 ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{idx + 1}</button>
            ))}
          </div>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            下一頁<i className="ri-arrow-right-s-line w-5 h-5 ml-1"></i>
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionsPage; 
