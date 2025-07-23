import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UpdateItem: React.FC<{
  date: string;
  type: string;
  typeColor: string;
  typeIcon: string;
  title: string;
  version: string;
  description: string;
  details: {
    title: string;
    items: string[];
    code?: string;
  };
  id: string;
  openDetails: string | null;
  toggleDetails: (id: string) => void;
}> = ({ date, type, typeColor, typeIcon, title, version, description, details, id, openDetails, toggleDetails }) => {
  const isOpen = openDetails === id;

  const codeExample = details.code ? (
    <div className="mt-4">
      <h4 className="code-font text-sm font-medium text-gray-900 mb-2">程式碼範例：</h4>
      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm text-gray-200">
          <code>{details.code}</code>
        </pre>
      </div>
    </div>
  ) : null;

  return (
    <div className="p-6">
      <div className="flex">
        <aside className="w-32 flex-shrink-0">
          <time className="text-sm text-gray-500">{date}</time>
          <div className={`mt-1 inline-flex items-center rounded-full ${typeColor}-50 px-2 py-1`}>
            <div className={`w-4 h-4 flex items-center justify-center mr-1 text-${typeColor}-600`}>
              <i className={typeIcon}></i>
            </div>
            <span className={`text-xs font-medium text-${typeColor}-700`}>{type}</span>
          </div>
        </aside>
        <article className="flex-1">
          <header className="flex items-start justify-between">
            <h3 className="code-font text-lg font-semibold text-gray-900">{title}</h3>
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1">
              <span className="text-xs font-medium text-gray-600">{version}</span>
            </span>
          </header>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
          <div className="mt-4 flex items-center space-x-4">
            <button className="text-sm text-primary hover:text-primary/80 flex items-center !rounded-button"
              onClick={() => toggleDetails(id)}>
              <span className="whitespace-nowrap">查看詳情</span>
              <div
                className={`w-5 h-5 flex items-center justify-center ml-1 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                <i className="ri-arrow-down-s-line"></i>
              </div>
            </button>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700 flex items-center !rounded-button">
              <div className="w-5 h-5 flex items-center justify-center mr-1">
                <i className="ri-file-text-line"></i>
              </div>
              <span className="whitespace-nowrap">變更文件</span>
            </a>
          </div>
          {isOpen && (
            <section className="mt-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="mb-6">
                  <h4 className="code-font text-sm font-medium text-gray-900 mb-2">{details.title}</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {details.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-4 h-4 flex items-center justify-center mt-1 mr-2 text-primary">
                          <i className="ri-checkbox-circle-line"></i>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {codeExample}
                </div>
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
};


const UpdatesPage: React.FC = () => {
  const [openDetails, setOpenDetails] = useState<string | null>(null);

  const toggleDetails = (id: string) => {
    setOpenDetails(openDetails === id ? null : id);
  };

  const updates = [
    {
      id: 'update-1',
      date: '2025-07-03',
      type: '新功能',
      typeColor: 'green',
      typeIcon: 'ri-add-line',
      title: 'Web Animations API',
      version: 'v2.1.0',
      description: '新增高級動畫控制功能，支援更複雜的動畫序列和時間軸控制。',
      details: {
        title: '更新內容：',
        items: [
          '新增 AnimationTimeline 介面，支援自定義時間軸',
          '支援動畫組合和序列控制',
          '優化動畫性能和記憶體使用',
        ],
        code: `const element = document.querySelector('.animated-element');\nconst timeline = new AnimationTimeline({\n  duration: 3000,\n  iterations: Infinity\n});\nconst keyframes = [\n  { transform: 'scale(1)', opacity: 1 },\n  { transform: 'scale(1.5)', opacity: 0.5 },\n  { transform: 'scale(1)', opacity: 1 }\n];\nelement.animate(keyframes, {\n  duration: 2000,\n  iterations: Infinity,\n  timeline: timeline\n});`
      }
    },
    {
      id: 'update-2',
      date: '2025-07-02',
      type: '功能更新',
      typeColor: 'blue',
      typeIcon: 'ri-refresh-line',
      title: 'File System Access API',
      version: 'v1.5.0',
      description: '改進檔案系統存取權限管理，新增目錄遞迴讀取功能。',
      details: {
        title: '更新內容：',
        items: [
          '新增目錄遞迴讀取功能',
          '改進權限管理機制',
          '優化檔案讀寫性能',
        ],
        code: `async function readDirectory() {\n  try {\n    const dirHandle = await window.showDirectoryPicker();\n    for await (const entry of dirHandle.values()) {\n      if (entry.kind === 'file') {\n        const file = await entry.getFile();\n        console.log(\`檔案: \${file.name}\`);\n      }\n    }\n  } catch (err) {\n    console.error('讀取目錄失敗:', err);\n  }\n}`
      }
    },
    {
      id: 'update-3',
      date: '2025-07-01',
      type: '棄用通知',
      typeColor: 'yellow',
      typeIcon: 'ri-error-warning-line',
      title: 'Web SQL Database',
      version: 'v3.0.0',
      description: 'Web SQL Database API 將在未來版本中棄用，建議使用 IndexedDB 或其他現代儲存方案。',
      details: {
        title: '棄用說明：',
        items: [
          'Web SQL Database 將在 2026 年底停止支援',
          '建議使用 IndexedDB 作為替代方案',
          '提供資料遷移工具和指南',
        ],
        code: `// 從 Web SQL 遷移到 IndexedDB\nconst dbName = 'myDatabase';\nconst request = indexedDB.open(dbName, 1);\nrequest.onupgradeneeded = function(event) {\n  const db = event.target.result;\n  const store = db.createObjectStore('users', {\n    keyPath: 'id',\n    autoIncrement: true\n  });\n  store.createIndex('name', 'name');\n  store.createIndex('email', 'email', { unique: true });\n};`
      }
    }
  ];


  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="code-font text-3xl font-bold text-gray-900 mb-2">Web API 最新更新</h1>
          <p className="text-gray-600 max-w-2xl">追蹤所有 Web API 的更新記錄，包含新功能發布、重要變更和棄用通知。</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="code-font font-medium text-gray-900">時間篩選</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="radio" name="timeRange" className="hidden" defaultChecked />
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2 flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">最近一週</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="timeRange" className="hidden" />
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">最近一個月</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="timeRange" className="hidden" />
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">最近三個月</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="timeRange" className="hidden" />
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">最近半年</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="timeRange" className="hidden" />
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">最近一年</span>
                  </label>
                </div>
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">自定義時間範圍</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">開始日期</label>
                      <input type="date"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">結束日期</label>
                      <input type="date"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">API 類型</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="hidden" defaultChecked />
                      <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded"></div>
                      </div>
                      <span className="text-sm text-gray-700">DOM APIs</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="hidden" defaultChecked />
                      <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded"></div>
                      </div>
                      <span className="text-sm text-gray-700">儲存 APIs</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="hidden" defaultChecked />
                      <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded"></div>
                      </div>
                      <span className="text-sm text-gray-700">網路 APIs</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="hidden" defaultChecked />
                      <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded"></div>
                      </div>
                      <span className="text-sm text-gray-700">裝置 APIs</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="hidden" defaultChecked />
                      <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded"></div>
                      </div>
                      <span className="text-sm text-gray-700">多媒體 APIs</span>
                    </label>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">更新類型</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="hidden" defaultChecked />
                      <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded"></div>
                      </div>
                      <span className="text-sm text-gray-700">新功能</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="hidden" defaultChecked />
                      <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded"></div>
                      </div>
                      <span className="text-sm text-gray-700">功能更新</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="hidden" defaultChecked />
                      <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded"></div>
                      </div>
                      <span className="text-sm text-gray-700">問題修復</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="hidden" defaultChecked />
                      <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded"></div>
                      </div>
                      <span className="text-sm text-gray-700">安全更新</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="hidden" defaultChecked />
                      <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded"></div>
                      </div>
                      <span className="text-sm text-gray-700">棄用通知</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="code-font font-medium text-gray-900">更新時間軸</h2>
                <div className="flex items-center space-x-2">
                  <button className="text-sm text-gray-500 hover:text-gray-900 flex items-center !rounded-button">
                    <div className="w-5 h-5 flex items-center justify-center mr-1">
                      <i className="ri-download-line"></i>
                    </div>
                    <span className="whitespace-nowrap">匯出記錄</span>
                  </button>
                  <div className="flex items-center border rounded-full px-1 py-1">
                    <button
                      className="px-3 py-1 text-xs font-medium rounded-full bg-primary text-white whitespace-nowrap">最新優先</button>
                    <button
                      className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">依
                      API 分類</button>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {updates.map(update => (
                  <UpdateItem
                    key={update.id}
                    {...update}
                    openDetails={openDetails}
                    toggleDetails={toggleDetails}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpdatesPage;