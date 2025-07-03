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
        {/* 其他 API 詳細資訊區塊可再擴充 */}
      </main>
      <Footer />
    </div>
  );
};

export default ApiDetailPage; 
