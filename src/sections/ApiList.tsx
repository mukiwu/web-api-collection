import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ApiFavoriteButton from '../components/ApiFavoriteButton';

// 靜態假資料，與 collections.html 對齊
const mockApis = [
  {
    id: 'intersection-observer',
    name: 'Intersection Observer API',
    description: '用於監測元素進入或離開視窗的 API，可用於實現無限滾動、延遲載入圖片或影片等功能。',
    icon: 'ri-eye-line',
    browsers: [
      { icon: 'ri-chrome-fill', label: 'Chrome 51+' },
      { icon: 'ri-firefox-fill', label: 'Firefox 55+' },
      { icon: 'ri-safari-fill', label: 'Safari 12.1+' },
      { icon: 'ri-edge-fill', label: 'Edge 15+' },
      { icon: 'ri-opera-fill', label: 'Opera 38+' },
    ],
    code: `// 建立 Intersection Observer\nconst observer = new IntersectionObserver(entries => {\n  for (const entry of entries) {\n    if (entry.isIntersecting) {\n      // 元素進入視窗\n      entry.target.classList.add('visible');\n    } else {\n      // 元素離開視窗\n      entry.target.classList.remove('visible');\n    }\n  }\n}, {\n  root: null,  // 使用視窗作為參考\n  threshold: 0.1  // 當元素 10% 可見時觸發\n});\n// 監測所有需要的元素\nconst elements = document.querySelectorAll('.lazy-load');\nelements.forEach(el => observer.observe(el));`,
    tags: ['JavaScript', 'DOM'],
    demo: (
      <div className="demo-container border border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-full h-16 mb-4 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center border border-dashed border-gray-300 rounded">
              <span className="text-gray-400 text-sm">向下滾動區域</span>
            </div>
            <div className="absolute w-8 h-8 bg-primary rounded transition-all duration-300 opacity-0 transform translate-x-0" style={{ top: '-50px', left: 'calc(50% - 16px)' }}></div>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap">開始展示</button>
        </div>
      </div>
    ),
  },
  {
    id: 'web-speech',
    name: 'Web Speech API',
    description: '讓網頁應用能夠進行語音辨識和語音合成的 API，可用於語音指令、聲控介面或無障礙功能。',
    icon: 'ri-mic-line',
    browsers: [
      { icon: 'ri-chrome-fill', label: 'Chrome 33+' },
      { icon: 'ri-firefox-fill', label: 'Firefox 49+' },
      { icon: 'ri-safari-fill', label: 'Safari 14.1+' },
      { icon: 'ri-edge-fill', label: 'Edge 79+' },
      { icon: 'ri-opera-fill', label: 'Opera 19+' },
    ],
    code: `// 語音合成範例\nfunction speak(text) {\n  const utterance = new SpeechSynthesisUtterance(text);\n  utterance.lang = 'zh-TW';\n  utterance.rate = 1.0;\n  utterance.pitch = 1.0;\n  // 選擇語音\n  const voices = speechSynthesis.getVoices();\n  const voice = voices.find(v =>\n    v.lang.includes('zh') && v.name.includes('Female')\n  );\n  if (voice) utterance.voice = voice;\n  // 開始說話\n  speechSynthesis.speak(utterance);\n}`,
    tags: ['JavaScript', 'Speech'],
    demo: (
      <div className="demo-container border border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex flex-col">
          <textarea className="w-full p-3 border border-gray-200 rounded-md mb-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none" rows={2} placeholder="輸入要朗讀的文字..." defaultValue="歡迎使用 Web Speech API，這是一個能讓網頁說話的強大功能。"></textarea>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center whitespace-nowrap">
              <div className="w-5 h-5 flex items-center justify-center mr-1">
                <i className="ri-volume-up-line"></i>
              </div>
              <span>朗讀文字</span>
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center whitespace-nowrap">
              <div className="w-5 h-5 flex items-center justify-center mr-1">
                <i className="ri-stop-line"></i>
              </div>
              <span>停止</span>
            </button>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'web-storage',
    name: 'Web Storage API',
    description: '提供在瀏覽器中儲存資料的機制，包含 localStorage（永久儲存）和 sessionStorage（暫時儲存）兩種方式。',
    icon: 'ri-database-2-line',
    browsers: [
      { icon: 'ri-chrome-fill', label: 'Chrome 4+' },
      { icon: 'ri-firefox-fill', label: 'Firefox 3.5+' },
      { icon: 'ri-safari-fill', label: 'Safari 4+' },
      { icon: 'ri-edge-fill', label: 'Edge 12+' },
      { icon: 'ri-opera-fill', label: 'Opera 10.5+' },
    ],
    code: `// localStorage 使用範例\n// 儲存資料\nlocalStorage.setItem('username', '張小明');\nlocalStorage.setItem('theme', 'dark');\n// 讀取資料\nconst username = localStorage.getItem('username');\nconst theme = localStorage.getItem('theme');\n// 刪除特定資料\nlocalStorage.removeItem('theme');\n// 清除所有資料\n// localStorage.clear();`,
    tags: ['JavaScript', 'Storage'],
    demo: (
      <div className="demo-container border border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex flex-col">
          <div className="flex mb-3">
            <input type="text" placeholder="鍵名" className="w-1/3 p-2 border border-gray-200 rounded-l-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none" />
            <input type="text" placeholder="值" className="w-2/3 p-2 border-y border-r border-gray-200 rounded-r-md text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none" />
          </div>
          <div className="flex space-x-2 mb-3">
            <button className="px-3 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap">儲存</button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap">讀取</button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap">刪除</button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap">清空</button>
          </div>
          <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-700 min-h-10">結果將顯示在這裡</div>
        </div>
      </div>
    ),
  },
  {
    id: 'geolocation',
    name: 'Geolocation API',
    description: '允許網頁獲取使用者的地理位置資訊，可用於地圖應用、位置相關服務或本地化內容。',
    icon: 'ri-map-pin-line',
    browsers: [
      { icon: 'ri-chrome-fill', label: 'Chrome 5+' },
      { icon: 'ri-firefox-fill', label: 'Firefox 3.5+' },
      { icon: 'ri-safari-fill', label: 'Safari 5+' },
      { icon: 'ri-edge-fill', label: 'Edge 12+' },
      { icon: 'ri-opera-fill', label: 'Opera 10.6+' },
    ],
    code: `// 獲取使用者位置\nfunction getLocation() {\n  if (navigator.geolocation) {\n    navigator.geolocation.getCurrentPosition(\n      // 成功回調\n      position => {\n        const latitude = position.coords.latitude;\n        const longitude = position.coords.longitude;\n        const accuracy = position.coords.accuracy;\n        console.log('位置: ' + latitude + ', ' + longitude);\n        console.log('精確度: ' + accuracy + ' 公尺');\n        // 使用位置資訊...\n      },\n      // 錯誤回調\n      error => {\n        switch(error.code) {\n          case error.PERMISSION_DENIED:\n            console.error("使用者拒絕位置請求");\n            break;\n          case error.POSITION_UNAVAILABLE:\n            console.error("位置資訊不可用");\n            break;\n          case error.TIMEOUT:\n            console.error("位置請求逾時");\n            break;\n        }\n      },\n      // 選項\n      {\n        enableHighAccuracy: true,  // 高精度\n        timeout: 5000,  // 5秒逾時\n        maximumAge: 0  // 不使用快取\n      }\n    );\n  } else {\n    console.error("瀏覽器不支援地理位置");\n  }\n}`,
    tags: ['JavaScript', 'Device'],
    demo: (
      <div className="demo-container border border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex flex-col">
          <div className="w-full h-40 mb-3 rounded-md overflow-hidden" style={{ backgroundImage: `url('https://public.readdy.ai/gen_page/map_placeholder_1280x720.png')`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
            <div className="hidden w-6 h-6 bg-primary rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2" style={{ position: 'relative', left: '50%', top: '50%' }}></div>
          </div>
          <div className="flex justify-between">
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center whitespace-nowrap">
              <div className="w-5 h-5 flex items-center justify-center mr-1">
                <i className="ri-map-pin-line"></i>
              </div>
              <span>獲取位置</span>
            </button>
            <div className="text-sm text-gray-600">點擊按鈕獲取位置</div>
          </div>
        </div>
      </div>
    ),
  },
];

type Api = {
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
            {/* 程式碼範例 */}
            <div className="mb-4">
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
            </div>
            {/* 互動展示 */}
            <div>
              <h4 className="code-font text-sm font-medium text-gray-700 mb-2">互動展示</h4>
              {api.demo}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 
