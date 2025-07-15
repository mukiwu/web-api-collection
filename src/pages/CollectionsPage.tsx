import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ApiFavoriteButton from '../components/ApiFavoriteButton';
import { supabase } from '../supabaseClient';
import { getAnonymousId } from '../utils/anonymousId';
import type { Api, Browser } from '../types';

// 工具函式：根據 supported 顯示版本或『不支援』
function browserSupportText(version: string, supported: boolean) {
  return supported ? version : '不支援';
}

const CollectionsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [showFavoriteOnly, setShowFavoriteOnly] = useState(false);
  const [tab, setTab] = useState('最新');
  const [page, setPage] = useState(1);
  const [apis, setApis] = useState<Api[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filters, setFilters] = useState({
    browserSupport: '全部',
    lastUpdated: '全部',
  });
  const navigate = useNavigate();

  // 從 API 資料中提取所有唯一的 tags
  const categories = useMemo(() => {
    const allTags = apis.flatMap(api => api.tags);
    const uniqueTags = Array.from(new Set(allTags));
    return ['全部', ...uniqueTags].filter(Boolean);
  }, [apis]);

  // 篩選選項
  const filterOptions = {
    browserSupport: ['全部', '完全支援', '部分支援'],
    lastUpdated: ['全部', '最近一週', '最近一個月', '最近三個月']
  };

  // 重設篩選條件
  const resetFilters = () => {
    setFilters({
      browserSupport: '全部',
      lastUpdated: '全部'
    });
  };

  // 處理篩選條件變更
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

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

  // 篩選 API
  const filteredApis = useMemo(() => {
    return apis.filter(api => {
      // 收藏篩選
      if (showFavoriteOnly && !api.isFavorite) {
        return false;
      }

      // 分類篩選
      if (activeCategory !== '全部' && !api.tags.includes(activeCategory)) {
        return false;
      }

      // 瀏覽器支援篩選
      if (filters.browserSupport !== '全部') {
        const supportedBrowsers = api.browsers.filter((b: Browser) => b.supported).length;
        const totalBrowsers = api.browsers.length;
        if (filters.browserSupport === '完全支援' && supportedBrowsers !== totalBrowsers) {
          return false;
        }
        if (filters.browserSupport === '部分支援' && supportedBrowsers === totalBrowsers) {
          return false;
        }
      }

      // 最後更新時間篩選
      if (filters.lastUpdated !== '全部') {
        const now = new Date();
        const updateDate = new Date(api.updated_at);
        const diffDays = Math.floor((now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (filters.lastUpdated === '最近一週' && diffDays > 7) {
          return false;
        }
        if (filters.lastUpdated === '最近一個月' && diffDays > 30) {
          return false;
        }
        if (filters.lastUpdated === '最近三個月' && diffDays > 90) {
          return false;
        }
      }

      return true;
    });
  }, [apis, showFavoriteOnly, activeCategory, filters]);

  // 分頁
  const pageSize = 6;
  const totalPages = Math.ceil(filteredApis.length / pageSize);
  const pagedApis = filteredApis.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* 分類橫向 tag */}
      <div className="bg-white border-b border-gray-100 sticky top-[57px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 py-3 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                className={`tag whitespace-nowrap px-4 py-2 cursor-pointer ${activeCategory === cat ? '!bg-primary !text-white' : 'bg-gray-100 text-gray-700'} font-medium rounded-full transition-colors`}
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
              <div className="relative filter-dropdown">
                <button 
                  className="flex items-center space-x-2 text-sm text-gray-700 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50" 
                  type="button"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                  <i className="ri-filter-3-line w-5 h-5"></i>
                  <span>篩選條件</span>
                  <i className="ri-arrow-down-s-line w-5 h-5"></i>
                </button>
                
                {showFilterDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4">
                      {/* 瀏覽器支援篩選 */}
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">瀏覽器支援</h3>
                        <div className="space-y-2">
                          {filterOptions.browserSupport.map(option => (
                            <label key={option} className="flex items-center">
                              <input
                                type="radio"
                                name="browserSupport"
                                value={option}
                                checked={filters.browserSupport === option}
                                onChange={(e) => handleFilterChange('browserSupport', e.target.value)}
                                className="form-radio text-primary"
                              />
                              <span className="ml-2 text-sm text-gray-600">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* 最後更新時間篩選 */}
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">最後更新</h3>
                        <div className="space-y-2">
                          {filterOptions.lastUpdated.map(option => (
                            <label key={option} className="flex items-center">
                              <input
                                type="radio"
                                name="lastUpdated"
                                value={option}
                                checked={filters.lastUpdated === option}
                                onChange={(e) => handleFilterChange('lastUpdated', e.target.value)}
                                className="form-radio text-primary"
                              />
                              <span className="ml-2 text-sm text-gray-600">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* 重設按鈕 */}
                      <div className="pt-3 border-t border-gray-200">
                        <button
                          onClick={resetFilters}
                          className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          重設篩選條件
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 收藏顯示 toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">收藏顯示</span>
                <label className="relative inline-block w-10 h-6 align-middle select-none">
                  <input 
                    type="checkbox" 
                    checked={showFavoriteOnly} 
                    onChange={e => setShowFavoriteOnly(e.target.checked)} 
                    className="absolute w-0 h-0 opacity-0" 
                  />
                  <span className={`block w-10 h-6 rounded-full transition bg-gray-200 ${showFavoriteOnly ? 'bg-primary/60' : ''}`}></span>
                  <span className={`dot absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition ${showFavoriteOnly ? 'translate-x-4 bg-primary' : ''}`}></span>
                </label>
              </div>
            </div>

            {/* 最新/熱門 toggle */}
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
                          {api.tags.map((tag: string) => (
                            <span 
                              key={tag} 
                              tabIndex={0}
                              role="button"
                              className={'px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 transition-colors'}
                            >
                              {tag}
                            </span>
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
                        {api.browsers.map((b: Browser) => (
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
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-10">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)} 
              className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <i className="ri-arrow-left-s-line w-5 h-5 mr-1"></i>上一頁
            </button>
            <div className="flex items-center">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setPage(idx + 1)} 
                  className={`w-9 h-9 flex items-center justify-center rounded-lg mx-1 ${page === idx + 1 ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(page + 1)} 
              className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              下一頁<i className="ri-arrow-right-s-line w-5 h-5 ml-1"></i>
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CollectionsPage;
