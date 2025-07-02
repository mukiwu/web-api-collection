import React from 'react';

const browserSupport = [
  { name: 'Chrome', data: [98, 95, 92, 88, 85] },
  { name: 'Firefox', data: [95, 92, 88, 82, 78] },
  { name: 'Safari', data: [90, 85, 80, 75, 70] },
  { name: 'Edge', data: [96, 93, 90, 85, 82] },
];
const categories = ['DOM APIs', '儲存 APIs', '網路 APIs', '裝置 APIs', '多媒體 APIs'];

export const SupportStatsSection: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="code-font text-xl font-semibold text-gray-900">瀏覽器支援統計</h2>
        <div className="flex items-center space-x-2">
          <button className="text-sm text-gray-500 hover:text-gray-900 flex items-center !rounded-button">
            <div className="w-5 h-5 flex items-center justify-center mr-1">
              <i className="ri-download-line"></i>
            </div>
            <span className="whitespace-nowrap">匯出數據</span>
          </button>
          <div className="flex items-center border rounded-full px-1 py-1">
            <button className="px-3 py-1 text-xs font-medium rounded-full bg-primary text-white whitespace-nowrap">月</button>
            <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">季</button>
            <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">年</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-5">
          <h3 className="code-font text-base font-medium text-gray-900 mb-4">API 支援率 (主流瀏覽器)</h3>
          {/* 這裡可嵌入圖表元件，暫以表格呈現 */}
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="py-2 px-2">API 類型</th>
                {browserSupport.map(b => (
                  <th key={b.name} className="py-2 px-2">{b.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat}>
                  <td className="py-2 px-2 font-medium">{cat}</td>
                  {browserSupport.map(b => (
                    <td key={b.name} className="py-2 px-2">{b.data[i]}%</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-5">
          <h3 className="code-font text-base font-medium text-gray-900 mb-4">API 使用趨勢</h3>
          {/* 這裡可嵌入趨勢圖表元件，暫以 placeholder 呈現 */}
          <div className="w-full h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded">（趨勢圖表預留區）</div>
        </div>
      </div>
    </div>
  );
}; 
