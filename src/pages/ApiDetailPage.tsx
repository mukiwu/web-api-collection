import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { Api } from '../sections/ApiList';

const ApiDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const api = location.state?.api as Api | undefined;

  const handleClose = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(-1);
      });
    } else {
      navigate(-1);
    }
  };

  if (!api) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Header />
        <div className="text-gray-500 text-lg">找不到 API 詳細資料，請從列表點擊進入。</div>
        <button className="mt-6 px-4 py-2 bg-primary text-white rounded-lg" onClick={() => navigate('/collections')}>回 API 列表</button>
        <Footer />
      </div>
    );
  }

  // 假資料：API 詳細介紹
  const apiDetailContent = {
    background: "在 Web Animations API 出現之前，網頁動畫主要依賴 CSS transitions/animations 或 JavaScript 操作 DOM 樣式，這讓複雜動畫難以管理、同步與控制。",
    solution: "Web Animations API 提供了統一的 JavaScript 介面，讓開發者能以程式方式建立、控制、同步動畫，並能與 CSS 動畫無縫整合。",
    useCases: [
      "動畫進場/退場效果",
      "互動式 UI 動畫（如按鈕點擊、拖曳）",
      "複雜的序列動畫（如步驟導覽、教學動畫）"
    ]
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* 關閉按鈕 */}
      <button
        className="absolute top-24 right-18 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 hover:cursor-pointer shadow transition-all"
        aria-label="關閉"
        onClick={handleClose}
      >
        <i className="ri-close-line text-2xl"></i>
      </button>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="code-font text-3xl font-bold text-gray-900 mb-2">{api.name}</h1>
          <p className="text-gray-700 text-lg mb-4">{api.description}</p>
        </div>
        {/* 瀏覽器相容性區塊 */}
        {Array.isArray(api.browsers) && api.browsers.length > 0 && (
          <section className="mb-10">
            <h4 className="code-font text-lg font-medium text-gray-700 mb-2">瀏覽器相容性</h4>
            <div className="flex flex-wrap md:flex-nowrap gap-4 mb-4 justify-start md:justify-between">
              {api.browsers.map(b => (
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
        {/* API 詳細介紹區塊 */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-2 flex items-center">
                <i className="ri-information-line mr-2"></i>
                API 詳細介紹
              </h2>
              <div className="h-1 w-12 bg-primary/20 rounded mb-4"></div>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">歷史背景與困難</h3>
                  <p className="text-gray-600 leading-relaxed">{apiDetailContent.background}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">API 解決方案</h3>
                  <p className="text-gray-600 leading-relaxed">{apiDetailContent.solution}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">實際應用情境</h3>
                  <ul className="list-disc pl-5 text-gray-600 leading-relaxed">
                    {apiDetailContent.useCases.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* 其他 API 詳細資訊區塊可再擴充 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">程式碼範例</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray((api as unknown as { codeSamples?: { language: string; code: string }[] }).codeSamples) &&
              (api as unknown as { codeSamples: { language: string; code: string }[] }).codeSamples.map((sample, idx) => (
              <div key={idx} className="bg-slate-900 text-slate-100 rounded-lg overflow-x-auto mb-4">
                <div className="flex items-center justify-between px-4 pt-4">
                  <span className="text-xs font-mono text-primary">{sample.language}</span>
                  <button className="copy-button text-xs text-primary hover:text-primary/80 flex items-center rounded-[8px]">
                    <i className="ri-clipboard-line mr-1"></i>複製
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono whitespace-pre-wrap">{sample.code}</pre>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">互動展示（預留區塊）</h2>
          <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-400">
            這裡可以放互動範例、Demo 或 Playground
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ApiDetailPage; 
