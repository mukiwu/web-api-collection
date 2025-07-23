import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

// 型別定義
interface BarChartProps {
  data: {
    categories: string[];
    series: { name: string; data: number[]; color: string }[];
  };
  title: string;
  yLabel: string;
}

interface LineChartSeries {
  name: string;
  data: number[];
  color: string;
  areaColorFrom: string;
  areaColorTo: string;
}

interface LineChartProps {
  data: {
    categories: string[];
    series: LineChartSeries[];
  };
  title: string;
  yLabel: string;
}

// 支援率長條圖
export const BrowserSupportBarChart: React.FC<BarChartProps> = ({ data, _title, yLabel }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    chart.setOption({
      animation: false,
      tooltip: { trigger: 'axis' },
      legend: { data: data.series.map(s => s.name) },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: data.categories,
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisLabel: { color: '#1f2937' },
      },
      yAxis: {
        type: 'value',
        name: yLabel,
        nameTextStyle: { color: '#1f2937' },
        min: 0,
        max: 100,
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisLabel: { color: '#1f2937', formatter: '{value}%' },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
      },
      series: data.series.map(s => ({
        name: s.name,
        type: 'bar',
        data: s.data,
        itemStyle: { color: s.color, borderRadius: 4 },
      })),
    });
    const resize = () => chart.resize();
    window.addEventListener('resize', resize);
    return () => {
      chart.dispose();
      window.removeEventListener('resize', resize);
    };
  }, [data, yLabel]);

  return <div ref={chartRef} className="w-full h-80" />;
};

// 使用趨勢折線圖
export const ApiUsageLineChart: React.FC<LineChartProps> = ({ data, title, yLabel }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    chart.setOption({
      animation: false,
      tooltip: { trigger: 'axis' },
      legend: { data: data.series.map(s => s.name) },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.categories,
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisLabel: { color: '#1f2937' },
      },
      yAxis: {
        type: 'value',
        name: yLabel,
        nameTextStyle: { color: '#1f2937' },
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisLabel: { color: '#1f2937', formatter: '{value}%' },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
      },
      series: data.series.map(s => ({
        name: s.name,
        type: 'line',
        data: s.data,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: s.color, width: 3 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: s.areaColorFrom },
              { offset: 1, color: s.areaColorTo },
            ],
          },
        },
      })),
    });
    const resize = () => chart.resize();
    window.addEventListener('resize', resize);
    return () => {
      chart.dispose();
      window.removeEventListener('resize', resize);
    };
  }, [data, yLabel]);

  return <div ref={chartRef} className="w-full h-80" />;
};

// 區塊包裝元件
const SupportStatsSection: React.FC = () => {
  // 假資料，未來可由 props/context 傳入
  const barData = {
    categories: ['DOM APIs', '儲存 APIs', '網路 APIs', '裝置 APIs', '多媒體 APIs'],
    series: [
      { name: 'Chrome', data: [98, 95, 92, 88, 85], color: 'rgba(87, 181, 231, 1)' },
      { name: 'Firefox', data: [95, 92, 88, 82, 78], color: 'rgba(141, 211, 199, 1)' },
      { name: 'Safari', data: [90, 85, 80, 75, 70], color: 'rgba(251, 191, 114, 1)' },
      { name: 'Edge', data: [96, 93, 90, 85, 82], color: 'rgba(252, 141, 98, 1)' },
    ],
  };
  const lineData = {
    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
    series: [
      { name: 'Fetch API', data: [45, 48, 52, 55, 58, 62, 65], color: 'rgba(87, 181, 231, 1)', areaColorFrom: 'rgba(87, 181, 231, 0.2)', areaColorTo: 'rgba(87, 181, 231, 0.01)' },
      { name: 'Web Storage', data: [60, 62, 65, 68, 70, 72, 75], color: 'rgba(141, 211, 199, 1)', areaColorFrom: 'rgba(141, 211, 199, 0.2)', areaColorTo: 'rgba(141, 211, 199, 0.01)' },
      { name: 'Intersection Observer', data: [25, 28, 32, 38, 42, 48, 52], color: 'rgba(251, 191, 114, 1)', areaColorFrom: 'rgba(251, 191, 114, 0.2)', areaColorTo: 'rgba(251, 191, 114, 0.01)' },
      { name: 'Web Speech', data: [12, 15, 18, 20, 22, 25, 28], color: 'rgba(252, 141, 98, 1)', areaColorFrom: 'rgba(252, 141, 98, 0.2)', areaColorTo: 'rgba(252, 141, 98, 0.01)' },
    ],
  };
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto">
        <div className="mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              瀏覽器支援統計
            </h2>
            <p className="text-lg text-gray-600">
              了解各種 Web API 在主流瀏覽器中的支援情況，做出更明智的開發決策
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  API 支援率 (主流瀏覽器)
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center border border-gray-200 rounded-full px-1 py-1">
                    <button className="px-3 py-1 text-xs font-medium rounded-full bg-primary text-white whitespace-nowrap">
                      月
                    </button>
                    <button
                      className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">
                      季
                    </button>
                    <button
                      className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">
                      年
                    </button>
                  </div>
                </div>
              </div>
              <div id="browser-support-chart" className="w-full h-80">
                <BrowserSupportBarChart data={barData} title="API 支援率 (主流瀏覽器)" yLabel="支援率 (%)" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">API 使用趨勢</h3>
                <button
                  className="text-sm text-gray-500 hover:text-gray-900 flex items-center !rounded-button whitespace-nowrap">
                  <div className="w-5 h-5 flex items-center justify-center mr-1">
                    <i className="ri-download-line"></i>
                  </div>
                  <span>匯出數據</span>
                </button>
              </div>
              <div id="api-usage-chart" className="w-full h-80">
                <ApiUsageLineChart data={lineData} title="API 使用趨勢" yLabel="使用率 (%)" />
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default SupportStatsSection; 
