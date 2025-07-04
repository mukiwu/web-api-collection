import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import mockDocMarkdown from './mockDoc.md?raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import * as remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { Parent } from 'unist';
import type { PhrasingContent } from 'mdast';

// Mock 資料
const mockApi = {
  name: 'Fetch API',
  icon: 'ri-wifi-line',
  difficulty: '初級',
  usage: '92%',
  updated: '2025-06-15',
  tags: ['網路', '非同步', 'JSON', 'HTTP', 'Promise'],
  description: 'Fetch API 提供了一個用於獲取資源的介面，包括跨網路的非同步請求。它是 XMLHttpRequest 的現代替代方案，提供更強大和靈活的功能集。Fetch API 使用 Promise，這使得它的 API 更簡潔，並避免了回調地獄。',
};

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

// mock FAQ
const mockFaqs = [
  {
    id: 'faq1',
    q: 'Fetch API 與 XMLHttpRequest 相比有哪些優勢？',
    a: `Fetch API 相比 XMLHttpRequest 有以下優勢：\n\n- 基於 Promise，避免了回調地獄，代碼更簡潔\n- 提供了更強大的請求控制能力\n- 支持流式處理\n- 更好的錯誤處理機制\n- 與現代 JavaScript 特性（如 async/await）更好地集成\n- 設計更加模塊化，如 Headers、Request 和 Response 物件`,
  },
  {
    id: 'faq2',
    q: '為什麼 fetch() 不會在 HTTP 錯誤狀態時拒絕 Promise？',
    a: `Fetch API 的設計理念是，只有在網路錯誤或請求被阻止時才會拒絕 Promise。HTTP 錯誤狀態（如 404 或 500）被視為正常的 HTTP 響應，因此 Promise 會正常解析。這種設計使開發者能夠更靈活地處理不同的 HTTP 狀態碼，而不是將所有非成功狀態碼都視為錯誤。為了檢查請求是否成功，應該檢查 \`response.ok\` 屬性或 \`response.status\` 屬性。`,
  },
  {
    id: 'faq3',
    q: '如何在 Fetch 請求中發送 cookies？',
    a: `默認情況下，Fetch 請求不會發送 cookies。要發送 cookies，需要設置 \`credentials\` 選項：\n\n\`\`\`js\nfetch('https://api.example.com/data', {\n  credentials: 'include' // 包括跨域請求的 cookies\n});\n\`\`\`\n\n\`credentials\` 選項有三個可能的值：\n- \`omit\`：不發送 cookies\n- \`same-origin\`：只在同源請求中發送 cookies（默認值）\n- \`include\`：在所有請求中發送 cookies，包括跨域請求`,
  },
  {
    id: 'faq4',
    q: '如何處理 Fetch 請求的超時？',
    a: `Fetch API 本身不提供超時選項，但可以使用 \`Promise.race()\` 和 \`AbortController\` 來實現超時功能：\n\n\`\`\`js\nfunction fetchWithTimeout(url, options = {}, timeout = 5000) {\n  const controller = new AbortController();\n  const { signal } = controller;\n  const timeoutPromise = new Promise((_, reject) => {\n    setTimeout(() => {\n      controller.abort();\n      reject(new Error(\`Request timed out after \${timeout}ms\`));\n    }, timeout);\n  });\n  return Promise.race([\n    fetch(url, { ...options, signal }),\n    timeoutPromise\n  ]);\n}\n\`\`\``,
  },
  {
    id: 'faq5',
    q: '如何使用 Fetch API 進行錯誤處理？',
    a: `完整的 Fetch API 錯誤處理應該包括網路錯誤和 HTTP 錯誤：\n\n\`\`\`js\nasync function fetchWithErrorHandling(url, options = {}) {\n  try {\n    const response = await fetch(url, options);\n    if (!response.ok) {\n      const errorData = await response.json().catch(() => ({}));\n      throw {\n        status: response.status,\n        statusText: response.statusText,\n        data: errorData\n      };\n    }\n    return await response.json();\n  } catch (error) {\n    if (error instanceof TypeError && error.message.includes('fetch')) {\n      throw new Error('Network error. Please check your connection.');\n    }\n    if (error.status) {\n      throw new Error(\`Server error: \${error.status} \${error.statusText}\`);\n    }\n    throw error;\n  }\n}\n\`\`\``,
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

// mock 相容性
const mockCompat = [
  { id: 'chrome', name: 'Chrome', icon: 'ri-chrome-line', version: '42+', supported: true },
  { id: 'firefox', name: 'Firefox', icon: 'ri-firefox-line', version: '39+', supported: true },
  { id: 'edge', name: 'Edge', icon: 'ri-edge-line', version: '14+', supported: true },
  { id: 'safari', name: 'Safari', icon: 'ri-safari-line', version: '10.1+', supported: true },
  { id: 'opera', name: 'Opera', icon: 'ri-opera-line', version: '29+', supported: true },
  { id: 'ie', name: 'IE', icon: 'ri-ie-line', version: '不支援', supported: false },
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
  { id: 'examples', text: '使用範例', level: 2 },
  { id: 'faq', text: '常見問題', level: 2 },
  { id: 'related', text: '相關資源', level: 2 },
  { id: 'compatibility', text: '瀏覽器相容性', level: 2 },
  { id: 'related-apis', text: '相關 API', level: 2 },
];

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
  const [tocActive, setTocActive] = useState('overview');

  // 只取主 markdown 的 H2/H3
  const mainToc = extractToc(mockDocMarkdown);
  // 過濾掉和固定區塊重複的 id
  const filteredMainToc = mainToc.filter(t => !fixedSections.some(f => f.id === t.id));
  // TOC = 概述 + 主 markdown TOC (H2/H3) + 其他固定區塊
  const toc = [
    fixedSections[0], // 概述
    ...filteredMainToc,
    fixedSections[1], // 使用範例
    fixedSections[2], // 常見問題
    fixedSections[3], // 相關資源
    fixedSections[4], // 瀏覽器相容性
    fixedSections[5], // 相關 API
  ];

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
            <i className={mockApi.icon}></i>
          </div>
          <h2 className="code-font font-medium text-gray-900">{mockApi.name}</h2>
        </div>
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <span>更新: {mockApi.updated}</span>
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
          {toc.map(item => (
            <li key={item.id} className={item.level === 2 ? 'ml-0' : 'ml-4'}>
              <a
                href={`#${item.id}`}
                className={`toc-item block px-3 py-2 text-sm rounded-lg border-l-2 transition-colors ${tocActive === item.id ? 'text-gray-900 border-primary bg-blue-50' : 'text-gray-600 border-transparent'}`}
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
          ))}
        </ul>
      </nav>
    </aside>
  );

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
            <span className="text-gray-900 font-medium">{mockApi.name}</span>
          </nav>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900 code-font">{mockApi.name}</h1>
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
                  <i className="ri-wifi-line ri-lg"></i>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">概述</h2>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {mockApi.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{mockApi.description}</p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-blue-500 mt-0.5">
                    <i className="ri-information-line"></i>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">重要提示</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Fetch API 返回的 Promise <strong>不會</strong> 因 HTTP 錯誤狀態（如 404 或 500）而被拒絕。相反，它會正常解析，只有在網路故障或請求被阻止時才會被拒絕。因此，檢查 <code className="code-font bg-blue-100 px-1 py-0.5 rounded text-blue-800">response.ok</code> 和 <code className="code-font bg-blue-100 px-1 py-0.5 rounded text-blue-800">response.status</code> 是很重要的。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* 主文件內容 markdown 區塊（完全還原 HTML 樣式，支援高亮） */}
            <section id="syntax" className="mb-12 prose prose-slate max-w-none">
              <ReactMarkdown
                components={{
                  code(props) {
                    const { className, children, ...rest } = props as { className?: string; children: React.ReactNode };
                    if (className === undefined) {
                      return (
                        <code
                          className="code-font bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 text-sm"
                          style={{
                            fontFamily: '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
                            background: '#f3f4f6',
                            borderRadius: '0.3em',
                            padding: '0.2em 0.4em',
                            fontSize: '.85rem',
                          }}
                          {...rest}
                        >
                          {children}
                        </code>
                      );
                    }
                    const match = /language-(\w+)/.exec(className || '');
                    return (
                      <pre
                        style={{
                          background: '#fafafa',
                          color: '#383a42',
                          fontFamily: '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
                          borderRadius: '0.3em',
                          padding: '1em',
                          margin: '0.5em 0',
                          overflow: 'auto',
                        }}
                      >
                        <code
                          className={className}
                          style={{
                            background: 'inherit',
                            color: 'inherit',
                            fontFamily: 'inherit',
                            fontSize: '.85rem',
                            whiteSpace: 'pre',
                          }}
                          {...rest}
                        >
                          <SyntaxHighlighter
                            style={oneLight}
                            language={match ? match[1] : ''}
                            PreTag="div"
                            customStyle={{
                              background: 'inherit',
                              color: 'inherit',
                              fontFamily: 'inherit',
                              fontSize: 'inherit',
                              margin: 0,
                              padding: 0,
                            }}
                            codeTagProps={{
                              style: {
                                background: 'inherit',
                                color: 'inherit',
                                fontFamily: 'inherit',
                                fontSize: 'inherit',
                                padding: 0,
                                margin: 0,
                              }
                            }}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </code>
                      </pre>
                    );
                  },
                  h2({ children, ...props }) {
                    const text = String(children);
                    const id = text
                      .toLowerCase()
                      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                      .replace(/^-+|-+$/g, '');
                    return <h2 id={id} style={{ scrollMarginTop: '72px' }} {...props}>{children}</h2>;
                  },
                  h3({ children, ...props }) {
                    const text = String(children);
                    const id = text
                      .toLowerCase()
                      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                      .replace(/^-+|-+$/g, '');
                    return <h3 id={id} style={{ scrollMarginTop: '72px' }} {...props}>{children}</h3>;
                  },
                  blockquote(props) {
                    return <blockquote className="border-l-4 border-gray-300 pl-4 text-gray-700 my-4" {...props} />;
                  },
                  a(props) {
                    return <a className="text-primary underline hover:text-primary/80" {...props} />;
                  },
                  ul(props) {
                    return <ul className="list-disc list-inside space-y-1 text-gray-700" {...props} />;
                  },
                  ol(props) {
                    return <ol className="list-decimal list-inside space-y-1 text-gray-700" {...props} />;
                  },
                  li(props) {
                    return <li className="mb-1" {...props} />;
                  },
                  table(props) {
                    return <table className="min-w-full border border-gray-200 rounded-lg my-4" {...props} />;
                  },
                  th(props) {
                    return <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b" {...props} />;
                  },
                  td(props) {
                    return <td className="px-4 py-3 text-sm text-gray-700 border-r" {...props} />;
                  },
                  p(props) {
                    return <p className="text-gray-700 mb-4" {...props} />;
                  },
                }}
              >
                {mockDocMarkdown}
              </ReactMarkdown>
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
                {mockFaqs.map(faq => (
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
            {/* 相容性區塊 */}
            <section id="compatibility" className="mb-12" style={{ scrollMarginTop: '72px' }}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-shield-check-line text-primary mr-2"></i> 瀏覽器相容性
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg bg-white">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">瀏覽器</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">支援版本</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCompat.map(b => (
                      <tr key={b.id} className="border-t border-gray-100">
                        <td className="flex items-center px-4 py-2 text-gray-900">
                          <i className={`${b.icon} text-xl mr-2 ${b.supported ? 'text-primary' : 'text-gray-400'}`}></i>
                          <span>{b.name}</span>
                        </td>
                        <td className={`px-4 py-2 ${b.supported ? 'text-green-700' : 'text-gray-400'}`}>{b.version}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

// FAQ 卡片元件
function FaqCard({ faq }: { faq: { id: string; q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(faq.a);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <button
        className="flex items-center w-full text-left focus:outline-none"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <i className={`ri-question-line text-lg text-primary mr-3 transition-transform ${open ? 'rotate-90' : ''}`}></i>
        <span className="text-lg font-medium text-gray-900 flex-1">{faq.q}</span>
        <i className={`ri-arrow-down-s-line ml-2 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}></i>
      </button>
      {open && (
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <button
              className="copy-button text-xs text-primary hover:text-primary/80 flex items-center rounded-[8px] border border-primary px-2 py-1 mr-2"
              onClick={handleCopy}
              title="複製答案"
            >
              <i className={`ri-clipboard-line mr-1 ${copied ? 'hidden' : ''}`}></i>
              <i className={`ri-check-line mr-1 ${copied ? '' : 'hidden'}`}></i>
              {copied ? '已複製' : '複製'}
            </button>
          </div>
          <div className="prose prose-slate max-w-none text-sm">
            <ReactMarkdown>{faq.a}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

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
