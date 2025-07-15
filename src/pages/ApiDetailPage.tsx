import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainContent from '../components/md/MainContent';
import ImportantNote from '../components/md/ImportantNote';
import FaqCard from '../components/FaqCard';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import * as remarkGfm from 'remark-gfm';
import { supabase } from '../supabaseClient';
import { visit } from 'unist-util-visit';
import type { Parent } from 'unist';
import type { PhrasingContent } from 'mdast';
import type { Api } from './CollectionsPage';

// mock 使用範例
const mockExamples = [
  {
    id: 'ex1',
    title: '基本用法',
    code: `fetch('https://api.example.com/data')\n  .then(response => response.json())\n  .then(data => console.log('Success:', data))\n  .catch(error => console.error('Error:', error));`,
    description: '最簡單的 Fetch 請求只需要一個參數 — 要獲取的資源的路徑：',
  },
  {
    id: 'ex2',
    title: 'POST 請求',
    code: `fetch('https://api.example.com/data', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({ name: '張小明', email: 'zhang@example.com' })\n})\n  .then(response => response.json())\n  .then(data => console.log('Success:', data));`,
    description: '發送 POST 請求需要指定 method 和 body：',
  },
];

// mock 資源（完全對齊 HTML）
const mockResources = [
  {
    id: 'res1',
    title: 'Fetch API 最佳實踐指南',
    url: '#',
    description: '學習 Fetch API 的高級技巧和最佳實踐，包括錯誤處理、緩存策略和性能優化。',
    icon: 'ri-article-line',
  },
  {
    id: 'res2',
    title: 'Fetch API 視頻教程',
    url: '#',
    description: '通過實例學習 Fetch API 的基礎知識和進階應用，適合初學者和有經驗的開發者。',
    icon: 'ri-video-line',
  },
  {
    id: 'res3',
    title: 'Fetch API 實用工具庫',
    url: '#',
    description: '探索基於 Fetch API 構建的實用工具庫，簡化常見任務並提高開發效率。',
    icon: 'ri-github-line',
  },
  {
    id: 'res4',
    title: 'Fetch API 與其他 HTTP 客戶端比較',
    url: '#',
    description: '比較 Fetch API 與 Axios、jQuery AJAX 等其他 HTTP 客戶端的優缺點和使用場景。',
    icon: 'ri-book-2-line',
  },
];

// mock 相關 API
const mockRelatedApis = [
  {
    id: 'xhr',
    name: 'XMLHttpRequest',
    icon: 'ri-exchange-line',
    description: '舊式的網路請求 API，Fetch API 的前身，仍有部分舊系統使用。',
    tags: ['網路', 'AJAX', '舊標準'],
    url: '#',
  },
  {
    id: 'axios',
    name: 'Axios',
    icon: 'ri-send-plane-line',
    description: '流行的第三方 HTTP 請求函式庫，語法簡潔、支援攔截器與自動轉換。',
    tags: ['HTTP', '第三方', 'Promise'],
    url: '#',
  },
  {
    id: 'websocket',
    name: 'WebSocket API',
    icon: 'ri-bubble-chart-line',
    description: '用於建立持久連線的 API，適合即時通訊、聊天室、遊戲等場景。',
    tags: ['即時', '雙向', '連線'],
    url: '#',
  },
];

// 固定區塊標題
const fixedSections = [
  { id: 'overview', text: '概述', level: 2 },
  { id: 'compatibility', text: '瀏覽器相容性', level: 2 },
  { id: 'examples', text: '使用範例', level: 2 },
  { id: 'faq', text: '常見問題', level: 2 },
  { id: 'related', text: '相關資源', level: 2 },
  { id: 'related-apis', text: '相關 API', level: 2 }
];

// 工具函式：timestamp 轉 YYYY.MM.DD
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function extractToc(markdown: string) {
  const toc: { id: string; text: string; level: number }[] = [];
  const tree = unified().use(remarkParse).use(remarkGfm.default).parse(markdown);
  visit(tree, 'heading', (node: Parent & { depth: number; children: PhrasingContent[] }) => {
    if (node.depth === 2 || node.depth === 3) {
      const text = node.children
        .filter((n) => (n.type === 'text' || n.type === 'inlineCode') && 'value' in n)
        .map((n) => (n as any).value as string)
        .join('');
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');
      toc.push({ id, text, level: node.depth });
    }
  });
  return toc;
}

const ApiDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [apis, setApis] = useState<Api | null>(null);
  const [apiFaq, setApiFaq] = useState<{ id: string; question: string; answer: string }[]>([]);
  const [tocActive, setTocActive] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState<string>('');
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    // 載入 API 詳細資料
    const fetchApiDetail = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('apis_with_favorite_count')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('API Detail fetch error:', error);
      } else {
        setApis(data);
        console.log('data', data);
        // 動態 import markdown
        if (data && data.slug) {
          import(`../docs/${data.slug}.md?raw`).then(mod => {
            setMarkdown(mod.default || '');
            // 產生 TOC
            const tocData = extractToc(mod.default || '');
            // 過濾掉和固定區塊重複的 id
            const filteredMainToc = tocData.filter(t => !fixedSections.some(f => f.id === t.id));
            setToc([
              fixedSections[0],
              fixedSections[1],
              ...filteredMainToc,
              fixedSections[2],
              fixedSections[3],
              fixedSections[4],
              fixedSections[5],
            ]);
          }).catch(() => {
            setMarkdown('找不到對應的說明文件');
            setToc([
              fixedSections[0],
              fixedSections[1],
              fixedSections[2],
              fixedSections[3],
              fixedSections[4],
              fixedSections[5],
            ]);
          });
        }
      }
      setLoading(false);
    };
    const fetchApiFaq = async () => {
      const { data, error } = await supabase
        .from('api_faqs')
        .select('*')
        .eq('api_id', id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('API FAQ fetch error:', error);
      } else {
        setApiFaq(data);
      }
    }
    if (id) {
      fetchApiDetail();
      fetchApiFaq()
    }
  }, [id]);

  // 側邊欄目錄元件
  const TableOfContents = () => (
    <aside className="sidebar w-64 lg:w-72 bg-white border-r border-gray-100 flex-shrink-0 h-[calc(100vh-57px)] sticky top-[57px] overflow-y-auto custom-scrollbar hidden lg:block">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-primary transition-colors">
          <div className="w-5 h-5 flex items-center justify-center mr-2">
            <i className="ri-arrow-left-line"></i>
          </div>
          <span className="text-sm">返回 API 列表</span>
        </button>
      </div>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-full flex-shrink-0 mr-2">
            <i className={`${apis?.icon} ri-xl`}></i>
          </div>
          <h2 className="code-font font-medium text-gray-900">{apis?.name}</h2>
        </div>
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <span>更新: {formatDate(apis?.updated_at || '')}</span>
        </div>
        <div className="relative">
          <input type="text" placeholder="搜尋文檔..." className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50" />
          <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center justify-center">
            <i className="ri-search-line"></i>
          </div>
        </div>
      </div>
      <nav className="p-4">
        <ul className="space-y-1">
          {toc.map((item, idx) => {
            // 找出上一個 H2
            let parentH2Idx = idx;
            while (parentH2Idx >= 0 && toc[parentH2Idx].level !== 2) parentH2Idx--;
            const isActive = tocActive === item.id;
            // 目前 active 的 idx
            const tocActiveIdx = toc.findIndex(t => t.id === tocActive);
            // 如果 active 是 H3，找出其父 H2
            let activeParentH2Id = '';
            if (tocActiveIdx >= 0 && toc[tocActiveIdx].level === 3) {
              let pIdx = tocActiveIdx;
              while (pIdx >= 0 && toc[pIdx].level !== 2) pIdx--;
              if (pIdx >= 0) activeParentH2Id = toc[pIdx].id;
            }
            // H2 active 條件
            const isH2Active = item.level === 2 && (tocActive === item.id || activeParentH2Id === item.id);

            return (
              <li key={item.id} className={item.level === 2 ? 'ml-0' : 'ml-4'}>
                <a
                  href={`#${item.id}`}
                  className={[
                    'toc-item block px-3 py-2 text-sm rounded-lg border-l-2 transition-colors hover:bg-gray-100',
                    isActive && item.level === 3 ? 'bg-gray-100 text-gray-900 border-primary active' : '',
                    isH2Active ? 'text-gray-900 border-primary bg-blue-50 active' : 'text-gray-600 border-transparent',
                  ].join(' ')}
                  onClick={e => {
                    setTocActive(item.id);
                    const el = document.getElementById(item.id);
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">載入中...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        {/* 側邊欄目錄 */}
        <TableOfContents />
        {/* 主內容 */}
        <main className="flex-1 bg-white">
          {/* breadcrumb */}
          <nav className="mb-6 flex items-center text-sm text-gray-500 max-w-4xl mx-auto px-4 pt-8">
            <a href="#" className="hover:text-primary transition-colors">首頁</a>
            <div className="mx-2 text-gray-400">
              <i className="ri-arrow-right-s-line"></i>
            </div>
            <a href="#" className="hover:text-primary transition-colors">熱門 API</a>
            <div className="mx-2 text-gray-400">
              <i className="ri-arrow-right-s-line"></i>
            </div>
            <span className="text-gray-900 font-medium">{apis?.name}</span>
          </nav>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900 code-font">{apis?.name}</h1>
              <div className="flex space-x-2">
                <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                  <i className="ri-bookmark-line"></i>
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                  <i className="ri-share-line"></i>
                </button>
              </div>
            </div>
            {/* 概述區塊 */}
            <section id="overview" className="mb-12" style={{ scrollMarginTop: '72px' }}>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-full flex-shrink-0 mr-3">
                  <i className={`${apis?.icon} ri-xl`}></i>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">概述</h2>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {apis?.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p
                className="text-gray-700 mb-4"
                dangerouslySetInnerHTML={{
                  __html: apis?.description?.replace(/\n/g, '<br />') || ''
                }}
              />
              {apis?.important_note && (
                <ImportantNote>{apis?.important_note}</ImportantNote>
              )}
            </section>
            {/* 相容性區塊（移到概述下方） */}
            <section id="compatibility" className="mb-12" style={{ scrollMarginTop: '72px' }}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                瀏覽器相容性
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg bg-white">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="pl-4 py-2 text-left text-gray-700">瀏覽器</th>
                      <th className="py-2 text-left text-gray-700">支援版本</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apis?.browsers.map(b => (
                      <tr key={b.id} className="border-t border-gray-100 text-sm">
                        <td className="flex items-center px-4 py-2 text-gray-700">
                          <i className={`${b.icon} ri-md mr-2 text-gray-700`}></i>
                          <span>{b.name}</span>
                        </td>
                        <td className={`${b.supported ? 'text-gray-700' : 'text-gray-400'}`}>
                          {b.supported ? b.version : '不支援'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            {/* 主文件內容 markdown 區塊（完全還原 HTML 樣式，支援高亮） */}
            <section id="syntax" className="mb-12">
              <MainContent>
                {markdown}
              </MainContent>
            </section>
            {/* 使用範例區塊 */}
            <section id="examples" className="mb-12" style={{ scrollMarginTop: '72px' }}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">使用範例</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockExamples.map(ex => (
                  <div key={ex.id} className="bg-slate-900 text-slate-100 rounded-lg overflow-x-auto mb-4 relative code-container">
                    <div className="flex items-center justify-between px-4 pt-4">
                      <span className="text-xs font-mono text-primary">{ex.title}</span>
                      <button
                        className="copy-button text-xs text-primary hover:text-primary/80 flex items-center rounded-[8px]"
                        onClick={() => navigator.clipboard.writeText(ex.code)}
                        title="複製程式碼"
                      >
                        <i className="ri-clipboard-line mr-1"></i>複製
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono whitespace-pre-wrap code-block">{ex.code}</pre>
                    {ex.description && <div className="px-4 pb-4 text-sm text-slate-200">{ex.description}</div>}
                  </div>
                ))}
              </div>
            </section>
            {/* FAQ 區塊 */}
            <section id="faq" className="mb-12" style={{ scrollMarginTop: '72px' }}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">常見問題</h2>
              <div className="space-y-6">
                {apiFaq.map(faq => (
                  <FaqCard key={faq.id} faq={faq} />
                ))}
              </div>
            </section>
            {/* 資源區塊 */}
            <section id="related" className="mb-12" style={{ scrollMarginTop: '72px' }}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">相關資源</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {mockResources.map(res => (
                  <a
                    key={res.id}
                    href={res.url}
                    className="flex items-start p-4 bg-white rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-full flex-shrink-0 mr-3">
                      <i className={res.icon}></i>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-1">{res.title}</h3>
                      <p className="text-sm text-gray-600">{res.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
            {/* 相關 API 區塊 */}
            <section id="related-apis" className="mb-12" style={{ scrollMarginTop: '72px' }}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-share-forward-line text-primary mr-2"></i> 相關 API
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {mockRelatedApis.map(api => (
                  <RelatedApiCard key={api.id} api={api} />
                ))}
              </div>
            </section>
            {/* 其餘區塊（語法、參數、返回值、方法、屬性、範例、FAQ、資源、相容性等）之後分元件細緻還原 */}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

// 相關 API 卡片元件
function RelatedApiCard({ api }: { api: { id: string; name: string; icon: string; description: string; tags: string[]; url: string } }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col shadow-sm h-full">
      <div className="flex items-center mb-2">
        <i className={`${api.icon} text-lg text-primary mr-2`}></i>
        <span className="text-base font-medium text-gray-900 flex-1">{api.name}</span>
        <a
          href={api.url}
          className="ml-2 text-xs text-primary border border-primary rounded-[8px] px-2 py-1 hover:bg-primary/10 transition-colors"
          title={`前往 ${api.name} 文件`}
        >
          查看
        </a>
      </div>
      <div className="text-gray-700 text-sm mb-2 flex-1">{api.description}</div>
      <div className="flex flex-wrap gap-2 mt-auto">
        {api.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default ApiDetailPage;
