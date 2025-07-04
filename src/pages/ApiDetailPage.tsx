import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';
import ReactMarkdown from 'react-markdown';

// 型別定義
interface ApiType {
  id: string;
  name: string;
  description: string;
  tags?: string[];
  browser_support?: { label: string; icon: string }[];
  [key: string]: unknown;
}
interface ApiDetailType {
  id: string;
  api_id: string;
  why_needed?: string;
  doc_content?: string;
  [key: string]: unknown;
}
interface ApiExampleType {
  id: string;
  api_id: string;
  title: string;
  code: string;
  description?: string;
  is_demo?: boolean;
  demo_config?: Record<string, unknown>;
  order?: number;
}

// 側邊欄目錄自動產生元件
function TableOfContents({ content }: { content: string }) {
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);
  useEffect(() => {
    if (!content) return;
    const lines = content.split('\n');
    const tocItems: { id: string; text: string; level: number }[] = [];
    lines.forEach(line => {
      const match = line.match(/^(##+)\s+(.+)/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-');
        tocItems.push({ id, text, level });
      }
    });
    setToc(tocItems);
  }, [content]);
  if (!toc.length) return null;
  return (
    <nav className="p-6">
      <h2 className="text-lg font-bold mb-4 text-gray-900">目錄</h2>
      <ul className="space-y-2">
        {toc.map(item => (
          <li key={item.id} className={item.level === 2 ? 'ml-0' : 'ml-4'}>
            <a href={`#${item.id}`} className="text-gray-700 hover:text-primary transition-colors text-sm block">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const ApiDetailPage: React.FC = () => {
  const { id: apiId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [api, setApi] = useState<ApiType | null>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [examples, setExamples] = useState<ApiExampleType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // 1. 取得 apis
      const { data: apiData } = await supabase.from('apis').select('*').eq('id', apiId).single();
      setApi(apiData as ApiType);
      // 2. 取得 api_sections
      const { data: sectionData } = await supabase.from('api_sections').select('*').eq('api_id', apiId).order('order');
      setSections(sectionData || []);
      // 3. 取得 api_examples
      const { data: exampleData } = await supabase.from('api_examples').select('*').eq('api_id', apiId).order('order');
      setExamples((exampleData || []) as ApiExampleType[]);
      setLoading(false);
    };
    if (apiId) fetchData();
  }, [apiId]);

  const handleClose = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(-1);
      });
    } else {
      navigate(-1);
    }
  };

  // if (!api) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center bg-white">
  //       <Header />
  //       <div className="text-gray-500 text-lg">找不到 API 詳細資料，請從列表點擊進入。</div>
  //       <button className="mt-6 px-4 py-2 bg-primary text-white rounded-lg" onClick={() => navigate('/collections')}>回 API 列表</button>
  //       <Footer />
  //     </div>
  //   );
  // }

  // 取得各章節內容
  const overviewSection = sections.find(s => s.type === 'overview');
  const whyNeededSection = sections.find(s => s.type === 'why_needed');
  const docSection = sections.find(s => s.type === 'doc');
  // why_needed 欄位建議 markdown 格式，分三欄以 --- 分隔
  let background = '', solution = '', useCases = '';
  if (whyNeededSection && whyNeededSection.content) {
    const parts = whyNeededSection.content.split(/---+/);
    background = parts[0]?.trim() || '';
    solution = parts[1]?.trim() || '';
    useCases = parts[2]?.trim() || '';
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {loading && <div className="flex justify-center items-center h-screen text-gray-500 text-lg">載入中...</div>}
      {!loading && !api && 
        <div className="flex flex-col justify-center items-center h-screen text-gray-500 text-lg">
          <div>找不到 API 詳細資料，請從列表點擊進入。</div>
          <button className="mt-6 px-4 py-2 bg-primary text-white rounded-lg" onClick={() => navigate('/collections')}>回 API 列表</button>
        </div>
      }
      {api && (
        <div className="flex">
          {/* 側邊欄目錄 */}
          <aside className="w-72 bg-white border-r border-gray-100 min-h-screen hidden lg:block">
            <TableOfContents content={docSection?.content || ''} />
          </aside>
          {/* 主內容 */}
          <div className="flex-1 min-h-screen relative">
            {/* 關閉按鈕 */}
            <button
              className="absolute top-8 right-8 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 hover:cursor-pointer shadow transition-all"
              aria-label="關閉"
              onClick={handleClose}
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
            <main className="max-w-4xl mx-auto px-4 py-10">
              {/* 標題/描述 */}
              <div className="mb-8">
                <h1 className="code-font text-3xl font-bold text-gray-900 mb-2">{api.name}</h1>
                <p className="text-gray-700 text-lg mb-4">{api.description}</p>
                {Array.isArray(api.tags) && api.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {api.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              {/* 為什麼需要這個 API 區塊 */}
              {(background || solution || useCases) && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                    <i className="ri-information-line mr-2"></i>
                    為什麼需要這個 API？
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">歷史背景與困難</h3>
                      <ReactMarkdown>{background}</ReactMarkdown>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">API 解決方案</h3>
                      <ReactMarkdown>{solution}</ReactMarkdown>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">實際應用情境</h3>
                      <ReactMarkdown>{useCases}</ReactMarkdown>
                    </div>
                  </div>
                </section>
              )}
              {/* 主文件內容（markdown） */}
              {docSection?.content && (
                <section className="mb-12 prose prose-slate max-w-none">
                  <ReactMarkdown>{docSection.content}</ReactMarkdown>
                </section>
              )}
              {/* 使用範例與即時演示 */}
              {examples.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">使用範例</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {examples.map(ex => (
                      <div key={ex.id} className="bg-slate-900 text-slate-100 rounded-lg overflow-x-auto mb-4">
                        <div className="flex items-center justify-between px-4 pt-4">
                          <span className="text-xs font-mono text-primary">{ex.title}</span>
                          <button className="copy-button text-xs text-primary hover:text-primary/80 flex items-center rounded-[8px]" onClick={() => navigator.clipboard.writeText(ex.code)}>
                            <i className="ri-clipboard-line mr-1"></i>複製
                          </button>
                        </div>
                        <pre className="p-4 text-xs font-mono whitespace-pre-wrap">{ex.code}</pre>
                        {ex.description && <div className="px-4 pb-4"><ReactMarkdown>{ex.description}</ReactMarkdown></div>}
                        {ex.is_demo && (
                          <div className="bg-gray-100 rounded-lg p-6 m-4 text-center text-gray-700">
                            {/* 這裡可根據 ex.demo_config 實作互動 demo，暫以預留區塊顯示 */}
                            <span>即時演示（Demo）</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {/* 瀏覽器相容性區塊 */}
              {Array.isArray(api.browser_support) && api.browser_support.length > 0 && (
                <section className="mb-10">
                  <h4 className="code-font text-lg font-medium text-gray-700 mb-2">瀏覽器相容性</h4>
                  <div className="flex flex-wrap md:flex-nowrap gap-4 mb-4 justify-start md:justify-between">
                    {api.browser_support.map((b: { label: string; icon: string }) => (
                      <div key={b.label} className="browser-icon flex flex-col items-center text-base md:text-lg">
                        <div className="w-12 h-12 flex items-center justify-center mb-1 text-gray-700">
                          <i className={`${b.icon} ri-2x`}></i>
                        </div>
                        <span className="text-gray-600 text-xs md:text-sm">{b.label}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </main>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ApiDetailPage; 
