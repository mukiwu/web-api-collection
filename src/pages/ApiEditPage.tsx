import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

// 型別定義
interface Api {
  id?: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  icon: string;
  usage_rate?: number;
  difficulty: string;
  browser_support?: any;
  browsers?: any;
  slug?: string;
  is_published?: boolean;
}

type SectionContent = OverviewContent | SyntaxContent | ParamsContent | MethodsContent | ExamplesContent | string;
interface Section {
  id: string;
  api_id?: string;
  type: string;
  title: string;
  content: SectionContent;
  section_order: number;
  collapsed?: boolean;
}

interface Example {
  id: string;
  api_id?: string;
  title: string;
  code: string;
  description?: string;
  is_demo?: boolean;
  demo_config?: Record<string, unknown>;
  order: number;
}

interface Faq {
  id: string;
  api_id?: string;
  question: string;
  answer: string;
  order: number;
}

interface Resource {
  id: string;
  api_id?: string;
  title: string;
  url: string;
  icon: string;
  order: number;
}

const DEFAULT_API: Api = {
  name: '',
  description: '',
  category: '',
  tags: [],
  icon: '',
  usage_rate: 0,
  difficulty: '',
  browser_support: [],
  browsers: [],
  slug: '',
  is_published: false,
};

// 章節型別與順序
const SECTION_TYPES = [
  { type: 'overview', label: '概述' },
  { type: 'syntax', label: '語法' },
  { type: 'params', label: '參數' },
  { type: 'methods', label: '方法' },
  { type: 'examples', label: '使用範例' },
  { type: 'custom', label: '自訂章節' },
];

// 概述章節內容型別
interface OverviewContent {
  icon: string;
  title: string;
  usage: string;
  level: string;
  tags: string[];
  paragraphs: string[];
  tipTitle: string;
  tipContent: string;
}

const DEFAULT_OVERVIEW: OverviewContent = {
  icon: 'ri-wifi-line',
  title: '',
  usage: '',
  level: '',
  tags: [],
  paragraphs: [''],
  tipTitle: '',
  tipContent: '',
};

// 語法章節內容型別
interface SyntaxContent {
  title: string;
  code: string;
  description: string;
  params: Array<{ name: string; desc: string; defaultValue: string }>;
}

const DEFAULT_SYNTAX: SyntaxContent = {
  title: '',
  code: '',
  description: '',
  params: [ { name: '', desc: '', defaultValue: '' } ],
};

// 參數章節內容型別
interface ParamsContent {
  title: string;
  params: Array<{ name: string; desc: string; type: string; required: boolean; defaultValue: string }>;
}

const DEFAULT_PARAMS: ParamsContent = {
  title: '',
  params: [ { name: '', desc: '', type: '', required: false, defaultValue: '' } ],
};

// 語法章節編輯元件
const SyntaxSectionEditor: React.FC<{
  value: SyntaxContent;
  onChange: (v: SyntaxContent) => void;
}> = ({ value, onChange }) => {
  const handleParamChange = (idx: number, field: keyof SyntaxContent['params'][0], val: string) => {
    const params = value.params.map((p, i) => i === idx ? { ...p, [field]: val } : p);
    onChange({ ...value, params });
  };
  const addParam = () => onChange({ ...value, params: [...value.params, { name: '', desc: '', defaultValue: '' }] });
  const removeParam = (idx: number) => onChange({ ...value, params: value.params.filter((_, i) => i !== idx) });
  return (
    <div className="section-content p-4">
      <input
        className="text-xl font-semibold text-gray-900 mb-2 bg-transparent border-b border-gray-200 focus:border-primary outline-none w-full"
        value={value.title}
        onChange={e => onChange({ ...value, title: e.target.value })}
        placeholder="語法標題"
      />
      <textarea
        className="code-block w-full mb-2"
        value={value.code}
        onChange={e => onChange({ ...value, code: e.target.value })}
        rows={4}
        placeholder="語法程式碼..."
      />
      <textarea
        className="text-gray-700 w-full mb-2"
        value={value.description}
        onChange={e => onChange({ ...value, description: e.target.value })}
        rows={2}
        placeholder="語法說明..."
      />
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">參數名稱</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">描述</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">預設值</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {value.params.map((p, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2"><input className="w-full" value={p.name} onChange={e => handleParamChange(idx, 'name', e.target.value)} /></td>
                <td className="px-4 py-2"><input className="w-full" value={p.desc} onChange={e => handleParamChange(idx, 'desc', e.target.value)} /></td>
                <td className="px-4 py-2"><input className="w-full" value={p.defaultValue} onChange={e => handleParamChange(idx, 'defaultValue', e.target.value)} /></td>
                <td><button type="button" className="text-red-400" onClick={() => removeParam(idx)}><i className="ri-delete-bin-line"></i></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="mt-2 text-primary text-sm flex items-center" onClick={addParam}><i className="ri-add-line mr-1"></i>添加參數</button>
      </div>
    </div>
  );
};

// 參數章節編輯元件
const ParamsSectionEditor: React.FC<{
  value: ParamsContent;
  onChange: (v: ParamsContent) => void;
}> = ({ value, onChange }) => {
  const handleParamChange = (idx: number, field: keyof ParamsContent['params'][0], val: string | boolean) => {
    const params = value.params.map((p, i) => i === idx ? { ...p, [field]: val } : p);
    onChange({ ...value, params });
  };
  const addParam = () => onChange({ ...value, params: [...value.params, { name: '', desc: '', type: '', required: false, defaultValue: '' }] });
  const removeParam = (idx: number) => onChange({ ...value, params: value.params.filter((_, i) => i !== idx) });
  return (
    <div className="section-content p-4">
      <input className="text-xl font-semibold text-gray-900 mb-2 bg-transparent border-b border-gray-200 focus:border-primary outline-none w-full" value={value.title} onChange={e => onChange({ ...value, title: e.target.value })} placeholder="參數" />
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">名稱</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">描述</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">型別</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">必填</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">預設值</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {value.params.map((p, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2"><input className="w-full" value={p.name} onChange={e => handleParamChange(idx, 'name', e.target.value)} /></td>
                <td className="px-4 py-2"><input className="w-full" value={p.desc} onChange={e => handleParamChange(idx, 'desc', e.target.value)} /></td>
                <td className="px-4 py-2"><input className="w-full" value={p.type} onChange={e => handleParamChange(idx, 'type', e.target.value)} /></td>
                <td className="px-4 py-2"><input type="checkbox" checked={!!p.required} onChange={e => handleParamChange(idx, 'required', e.target.checked)} /></td>
                <td className="px-4 py-2"><input className="w-full" value={p.defaultValue} onChange={e => handleParamChange(idx, 'defaultValue', e.target.value)} /></td>
                <td><button type="button" className="text-red-400" onClick={() => removeParam(idx)}><i className="ri-delete-bin-line"></i></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="mt-2 text-primary text-sm flex items-center" onClick={addParam}><i className="ri-add-line mr-1"></i>添加行</button>
      </div>
    </div>
  );
};

// 方法章節內容型別
interface MethodsContent {
  methods: Array<{
    name: string;
    desc: string;
    code: string;
    note: string;
  }>;
}

const DEFAULT_METHODS: MethodsContent = {
  methods: [ { name: '', desc: '', code: '', note: '' } ],
};

// 方法章節編輯元件
const MethodsSectionEditor: React.FC<{
  value: MethodsContent;
  onChange: (v: MethodsContent) => void;
}> = ({ value, onChange }) => {
  const handleMethodChange = (idx: number, field: keyof MethodsContent['methods'][0], val: string) => {
    const methods = value.methods.map((m, i) => i === idx ? { ...m, [field]: val } : m);
    onChange({ ...value, methods });
  };
  const addMethod = () => onChange({ ...value, methods: [...value.methods, { name: '', desc: '', code: '', note: '' }] });
  const removeMethod = (idx: number) => onChange({ ...value, methods: value.methods.filter((_, i) => i !== idx) });
  return (
    <div className="section-content p-4">
      {value.methods.map((m, idx) => (
        <div key={idx} className="p-4 mb-4 rounded-lg border border-gray-200">
          <input className="text-lg font-medium text-gray-900 mb-2 code-font bg-transparent border-b border-gray-200 focus:border-primary outline-none w-full" value={m.name} onChange={e => handleMethodChange(idx, 'name', e.target.value)} placeholder="方法名稱" />
          <textarea className="text-gray-700 w-full mb-2" value={m.desc} onChange={e => handleMethodChange(idx, 'desc', e.target.value)} rows={2} placeholder="方法說明..." />
          <textarea className="code-block w-full mb-2" value={m.code} onChange={e => handleMethodChange(idx, 'code', e.target.value)} rows={3} placeholder="程式碼..." />
          <textarea className="text-gray-600 text-sm w-full mb-2" value={m.note} onChange={e => handleMethodChange(idx, 'note', e.target.value)} rows={1} placeholder="備註/說明..." />
          {value.methods.length > 1 && <button type="button" className="text-red-400" onClick={() => removeMethod(idx)}><i className="ri-delete-bin-line"></i> 移除</button>}
        </div>
      ))}
      <button type="button" className="mt-2 text-primary text-sm flex items-center" onClick={addMethod}><i className="ri-add-line mr-1"></i>添加方法</button>
    </div>
  );
};

// 範例章節內容型別
interface ExamplesContent {
  examples: Array<{
    title: string;
    desc: string;
    code: string;
  }>;
}

const DEFAULT_EXAMPLES: ExamplesContent = {
  examples: [ { title: '', desc: '', code: '' } ],
};

// 範例章節編輯元件
const ExamplesSectionEditor: React.FC<{
  value: ExamplesContent;
  onChange: (v: ExamplesContent) => void;
}> = ({ value, onChange }) => {
  const handleExampleChange = (idx: number, field: keyof ExamplesContent['examples'][0], val: string) => {
    const examples = value.examples.map((ex, i) => i === idx ? { ...ex, [field]: val } : ex);
    onChange({ ...value, examples });
  };
  const addExample = () => onChange({ ...value, examples: [...value.examples, { title: '', desc: '', code: '' }] });
  const removeExample = (idx: number) => onChange({ ...value, examples: value.examples.filter((_, i) => i !== idx) });
  return (
    <div className="section-content p-4">
      {value.examples.map((ex, idx) => (
        <div key={idx} className="mb-8">
          <input className="text-lg font-medium text-gray-900 mb-2 bg-transparent border-b border-gray-200 focus:border-primary outline-none w-full" value={ex.title} onChange={e => handleExampleChange(idx, 'title', e.target.value)} placeholder="範例標題" />
          <textarea className="text-gray-700 w-full mb-2" value={ex.desc} onChange={e => handleExampleChange(idx, 'desc', e.target.value)} rows={2} placeholder="範例說明..." />
          <textarea className="code-block w-full mb-2" value={ex.code} onChange={e => handleExampleChange(idx, 'code', e.target.value)} rows={4} placeholder="程式碼..." />
          {value.examples.length > 1 && <button type="button" className="text-red-400" onClick={() => removeExample(idx)}><i className="ri-delete-bin-line"></i> 移除</button>}
        </div>
      ))}
      <button type="button" className="mt-2 text-primary text-sm flex items-center" onClick={addExample}><i className="ri-add-line mr-1"></i>添加範例</button>
    </div>
  );
};

// 章節內容型別對應
const getDefaultSectionContent = (type: string) => {
  if (type === 'overview') return { ...DEFAULT_OVERVIEW };
  if (type === 'syntax') return { ...DEFAULT_SYNTAX };
  if (type === 'params') return { ...DEFAULT_PARAMS };
  if (type === 'methods') return { ...DEFAULT_METHODS };
  if (type === 'examples') return { ...DEFAULT_EXAMPLES };
  // 其他型別後續補齊
  return '';
};

// FAQ 編輯元件
const FaqsEditor: React.FC<{
  value: Faq[];
  onChange: (v: Faq[]) => void;
}> = ({ value, onChange }) => {
  const handleChange = (idx: number, field: keyof Faq, val: string) => {
    onChange(value.map((f, i) => i === idx ? { ...f, [field]: val } : f));
  };
  const addFaq = () => onChange([...value, { id: uuidv4(), api_id: undefined, question: '', answer: '', order: value.length }]);
  const removeFaq = (idx: number) => onChange(value.filter((_, i) => i !== idx));
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">FAQ</h2>
      {value.map((faq, idx) => (
        <div key={faq.id} className="mb-4 border border-gray-200 rounded-lg p-4">
          <input className="w-full mb-2 border-b border-gray-200 focus:border-primary outline-none text-base font-medium" value={faq.question} onChange={e => handleChange(idx, 'question', e.target.value)} placeholder="問題" />
          <textarea className="w-full border-b border-gray-200 focus:border-primary outline-none text-gray-700" value={faq.answer} onChange={e => handleChange(idx, 'answer', e.target.value)} placeholder="答案..." rows={2} />
          {value.length > 1 && <button type="button" className="text-red-400 mt-2" onClick={() => removeFaq(idx)}><i className="ri-delete-bin-line"></i> 移除</button>}
        </div>
      ))}
      <button type="button" className="mt-2 text-primary text-sm flex items-center" onClick={addFaq}><i className="ri-add-line mr-1"></i>新增 FAQ</button>
    </div>
  );
};

// 資源編輯元件
const ResourcesEditor: React.FC<{
  value: Resource[];
  onChange: (v: Resource[]) => void;
}> = ({ value, onChange }) => {
  const handleChange = (idx: number, field: keyof Resource, val: string) => {
    onChange(value.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  };
  const addResource = () => onChange([...value, { id: uuidv4(), api_id: undefined, title: '', url: '', icon: '', order: value.length }]);
  const removeResource = (idx: number) => onChange(value.filter((_, i) => i !== idx));
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">延伸資源</h2>
      {value.map((res, idx) => (
        <div key={res.id} className="mb-4 border border-gray-200 rounded-lg p-4">
          <input className="w-full mb-2 border-b border-gray-200 focus:border-primary outline-none text-base font-medium" value={res.title} onChange={e => handleChange(idx, 'title', e.target.value)} placeholder="資源標題" />
          <input className="w-full mb-2 border-b border-gray-200 focus:border-primary outline-none text-gray-700" value={res.url} onChange={e => handleChange(idx, 'url', e.target.value)} placeholder="資源網址" />
          <input className="w-full mb-2 border-b border-gray-200 focus:border-primary outline-none text-gray-700" value={res.icon} onChange={e => handleChange(idx, 'icon', e.target.value)} placeholder="Remixicon class，如 ri-link" />
          {value.length > 1 && <button type="button" className="text-red-400 mt-2" onClick={() => removeResource(idx)}><i className="ri-delete-bin-line"></i> 移除</button>}
        </div>
      ))}
      <button type="button" className="mt-2 text-primary text-sm flex items-center" onClick={addResource}><i className="ri-add-line mr-1"></i>新增資源</button>
    </div>
  );
};

// 型別守衛
function isOverviewContent(content: SectionContent): content is OverviewContent {
  return typeof content === 'object' && 'icon' in content && 'tipTitle' in content;
}

function isSyntaxContent(content: SectionContent): content is SyntaxContent {
  return typeof content === 'object' && 'code' in content && 'params' in content;
}

function isParamsContent(content: SectionContent): content is ParamsContent {
  return typeof content === 'object' && 'params' in content && 'title' in content && Array.isArray((content as any).params) && 'type' in (content as any).params[0];
}

function isMethodsContent(content: SectionContent): content is MethodsContent {
  return typeof content === 'object' && 'methods' in content;
}

function isExamplesContent(content: SectionContent): content is ExamplesContent {
  return typeof content === 'object' && 'examples' in content;
}

// 字數統計
const countWords = (sections: Section[]) => {
  let total = 0;
  sections.forEach(s => {
    if (isOverviewContent(s.content)) {
      total += s.content.title.replace(/\s+/g, ' ').trim().split(/\s+/).length;
      total += s.content.paragraphs.reduce((acc, p) => acc + p.replace(/\s+/g, ' ').trim().split(/\s+/).length, 0);
      total += s.content.tipTitle.replace(/\s+/g, ' ').trim().split(/\s+/).length;
      total += s.content.tipContent.replace(/\s+/g, ' ').trim().split(/\s+/).length;
    } else if (typeof s.content === 'string') {
      total += s.content.replace(/\s+/g, ' ').trim().split(/\s+/).length;
    }
  });
  return total;
};

const OverviewSectionEditor: React.FC<{
  value: OverviewContent;
  onChange: (v: OverviewContent) => void;
}> = ({ value, onChange }) => {
  // 處理標籤
  const handleTagAdd = () => {
    onChange({ ...value, tags: [...value.tags, ''] });
  };
  const handleTagChange = (idx: number, tag: string) => {
    const tags = [...value.tags];
    tags[idx] = tag;
    onChange({ ...value, tags });
  };
  const handleTagRemove = (idx: number) => {
    const tags = value.tags.filter((_, i) => i !== idx);
    onChange({ ...value, tags });
  };
  // 處理段落
  const handleParagraphChange = (idx: number, text: string) => {
    const paragraphs = [...value.paragraphs];
    paragraphs[idx] = text;
    onChange({ ...value, paragraphs });
  };
  const handleParagraphAdd = () => {
    onChange({ ...value, paragraphs: [...value.paragraphs, ''] });
  };
  const handleParagraphRemove = (idx: number) => {
    if (value.paragraphs.length <= 1) return;
    const paragraphs = value.paragraphs.filter((_, i) => i !== idx);
    onChange({ ...value, paragraphs });
  };
  // 處理 icon
  const iconOptions = [
    'ri-wifi-line', 'ri-link', 'ri-code-s-slash-line', 'ri-database-2-line', 'ri-lock-line', 'ri-eye-line',
    'ri-settings-3-line', 'ri-user-line', 'ri-global-line', 'ri-braces-line', 'ri-terminal-line',
  ];
  return (
    <div className="section-content p-4">
      <div className="flex items-center mb-4">
        <select
          className="w-10 h-10 bg-primary/10 text-primary rounded-full flex-shrink-0 mr-3 text-xl text-center"
          value={value.icon}
          onChange={e => onChange({ ...value, icon: e.target.value })}
        >
          {iconOptions.map(icon => (
            <option key={icon} value={icon}>{icon}</option>
          ))}
        </select>
        <input
          className="text-xl font-semibold text-gray-900 flex-1 bg-transparent border-b border-gray-200 focus:border-primary outline-none"
          value={value.title}
          onChange={e => onChange({ ...value, title: e.target.value })}
          placeholder="API 標題"
        />
        <div className="flex flex-col ml-4 gap-1">
          <input
            className="text-xs text-gray-500 bg-transparent border-b border-gray-200 focus:border-primary outline-none mb-1"
            value={value.usage}
            onChange={e => onChange({ ...value, usage: e.target.value })}
            placeholder="使用率: 92%"
            style={{ width: 70 }}
          />
          <input
            className="text-xs text-green-800 bg-green-100 px-2 py-0.5 rounded-full border-none outline-none"
            value={value.level}
            onChange={e => onChange({ ...value, level: e.target.value })}
            placeholder="初級"
            style={{ width: 50 }}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {value.tags.map((tag, idx) => (
          <span key={idx} className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
            <input
              className="bg-transparent border-none outline-none w-16"
              value={tag}
              onChange={e => handleTagChange(idx, e.target.value)}
              placeholder="標籤"
            />
            <button type="button" className="ml-1 text-gray-400 hover:text-red-400" onClick={() => handleTagRemove(idx)}><i className="ri-close-line"></i></button>
          </span>
        ))}
        <button type="button" className="px-2 py-1 text-gray-500 hover:text-primary" onClick={handleTagAdd}>
          <i className="ri-add-line"></i>
        </button>
      </div>
      {value.paragraphs.map((p, idx) => (
        <div key={idx} className="mb-4 flex items-start gap-2">
          <textarea
            className="flex-1 text-gray-700 bg-transparent border-b border-gray-200 focus:border-primary outline-none resize-none min-h-[40px]"
            value={p}
            onChange={e => handleParagraphChange(idx, e.target.value)}
            placeholder="段落內容..."
          />
          {value.paragraphs.length > 1 && (
            <button type="button" className="text-gray-400 hover:text-red-400 mt-2" onClick={() => handleParagraphRemove(idx)}><i className="ri-delete-bin-line"></i></button>
          )}
        </div>
      ))}
      <button type="button" className="mb-4 text-primary text-sm flex items-center" onClick={handleParagraphAdd}>
        <i className="ri-add-line mr-1"></i>新增段落
      </button>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-blue-500 mt-0.5">
            <i className="ri-information-line"></i>
          </div>
          <div className="ml-3 flex-1">
            <input
              className="text-sm font-medium text-blue-800 bg-transparent border-b border-blue-200 focus:border-primary outline-none mb-1"
              value={value.tipTitle}
              onChange={e => onChange({ ...value, tipTitle: e.target.value })}
              placeholder="提示標題"
            />
            <textarea
              className="mt-2 text-sm text-blue-700 bg-transparent border-b border-blue-100 focus:border-primary outline-none w-full resize-none min-h-[32px]"
              value={value.tipContent}
              onChange={e => onChange({ ...value, tipContent: e.target.value })}
              placeholder="提示內容..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ApiEditPage: React.FC = () => {
  const { id: apiId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!apiId;
  const [api, setApi] = useState<Api>(DEFAULT_API);
  const [sections, setSections] = useState<Section[]>([]);
  const [examples, setExamples] = useState<Example[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(false);

  // 取得資料
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    (async () => {
      // 1. 取得 apis
      const { data: apiData } = await supabase.from('apis').select('*').eq('id', apiId).single();
      if (apiData) setApi(apiData);
      // 2. 取得 api_sections
      const { data: sectionData } = await supabase.from('api_sections').select('*').eq('api_id', apiId).order('section_order');
      if (sectionData) setSections(sectionData);
      // 3. 取得 api_examples
      const { data: exampleData } = await supabase.from('api_examples').select('*').eq('api_id', apiId).order('order');
      if (exampleData) setExamples(exampleData);
      // 4. 取得 api_faqs
      const { data: faqData } = await supabase.from('api_faqs').select('*').eq('api_id', apiId).order('order');
      if (faqData) setFaqs(faqData);
      // 5. 取得 api_resources
      const { data: resourceData } = await supabase.from('api_resources').select('*').eq('api_id', apiId).order('order');
      if (resourceData) setResources(resourceData);
      setLoading(false);
    })();
  }, [apiId, isEdit]);

  // 儲存
  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    let api_id = apiId;
    // 1. upsert apis
    if (!isEdit) {
      const { data, error } = await supabase.from('apis').insert([{ ...api }]).select().single();
      if (error) { setMessage('API 主資料儲存失敗'); setLoading(false); return; }
      api_id = data.id;
    } else {
      const { error } = await supabase.from('apis').update(api).eq('id', api_id);
      if (error) { setMessage('API 主資料更新失敗'); setLoading(false); return; }
    }
    // 2. sections
    if (api_id) {
      await supabase.from('api_sections').delete().eq('api_id', api_id);
      const toInsertSections = sections.map(s => ({ ...s, api_id }));
      if (toInsertSections.length > 0) await supabase.from('api_sections').insert(toInsertSections);
      // 3. examples
      await supabase.from('api_examples').delete().eq('api_id', api_id);
      const toInsertExamples = examples.map(e => ({ ...e, api_id }));
      if (toInsertExamples.length > 0) await supabase.from('api_examples').insert(toInsertExamples);
      // 4. faqs
      await supabase.from('api_faqs').delete().eq('api_id', api_id);
      const toInsertFaqs = faqs.map(f => ({ ...f, api_id }));
      if (toInsertFaqs.length > 0) await supabase.from('api_faqs').insert(toInsertFaqs);
      // 5. resources
      await supabase.from('api_resources').delete().eq('api_id', api_id);
      const toInsertResources = resources.map(r => ({ ...r, api_id }));
      if (toInsertResources.length > 0) await supabase.from('api_resources').insert(toInsertResources);
    }
    setMessage('儲存成功！');
    setLoading(false);
    setTimeout(() => navigate(`/api/${api_id}`), 1000);
  };

  // 預覽視窗（簡易）
  const handlePreview = () => {
    setPreview(!preview);
  };

  // 工具列格式化（僅示意，針對 textarea 章節）
  const formatSection = (idx: number, type: string) => {
    setSections(prev => prev.map((s, i) => {
      if (i !== idx) return s;
      let content = s.content;
      if (typeof content === 'string') {
        switch (type) {
          case 'bold':
            content += ' **粗體**';
            break;
          case 'italic':
            content += ' *斜體*';
            break;
          case 'code':
            content += ' `程式碼`';
            break;
          case 'h2':
            content += '\n## 標題2';
            break;
          // ...
        }
      }
      return { ...s, content };
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-6">
        {/* 標題列 */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? '編輯 API 文檔' : '新增 API 文檔'}</h1>
          <div className={`status-indicator ${message ? 'show' : 'hide'} text-sm text-gray-500`}>{message}</div>
        </div>
        {/* API 基本資料表單 */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API 名稱</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={api.name}
              onChange={e => setApi({ ...api, name: e.target.value })}
              placeholder="請輸入 API 名稱"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分類</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={api.category}
              onChange={e => setApi({ ...api, category: e.target.value })}
              placeholder="請輸入分類"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">簡短描述</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[48px]"
              value={api.description}
              onChange={e => setApi({ ...api, description: e.target.value })}
              placeholder="請輸入 API 簡短描述"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">標籤</label>
            <div className="flex flex-wrap gap-2">
              {api.tags.map((tag, idx) => (
                <span key={idx} className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  <input
                    className="bg-transparent border-none outline-none w-16"
                    value={tag}
                    onChange={e => {
                      const tags = [...api.tags];
                      tags[idx] = e.target.value;
                      setApi({ ...api, tags });
                    }}
                    placeholder="標籤"
                  />
                  <button
                    type="button"
                    className="ml-1 text-gray-400 hover:text-red-400"
                    onClick={() => {
                      const tags = api.tags.filter((_, i) => i !== idx);
                      setApi({ ...api, tags });
                    }}
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </span>
              ))}
              <button
                type="button"
                className="px-2 py-1 text-gray-500 hover:text-primary"
                onClick={() => setApi({ ...api, tags: [...api.tags, ''] })}
              >
                <i className="ri-add-line"></i>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">難度</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={api.difficulty}
              onChange={e => setApi({ ...api, difficulty: e.target.value })}
            >
              <option value="">請選擇</option>
              <option value="beginner">初級</option>
              <option value="intermediate">中級</option>
              <option value="advanced">進階</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={api.icon}
              onChange={e => setApi({ ...api, icon: e.target.value })}
              placeholder="Remixicon class，如 ri-wifi-line"
            />
          </div>
        </div>
        {/* 章節編輯區 */}
        <div className="mb-8">
          {SECTION_TYPES.filter(t => sections.some(s => s.type === t.type)).map((t, idx) => {
            const sectionIdx = sections.findIndex(s => s.type === t.type);
            const section = sections[sectionIdx];
            return (
              <div key={section.id} className="section-item mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <div className="section-header flex items-center justify-between bg-gray-50 px-4 py-3">
                  <div className="flex items-center">
                    <div className="drag-handle w-6 h-6 flex items-center justify-center text-gray-400 mr-2">
                      <i className="ri-drag-move-line"></i>
                    </div>
                    <input
                      className="font-medium text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-primary outline-none mr-2 text-lg"
                      value={section.title}
                      onChange={e => setSections(prev => prev.map((s, i) => i === sectionIdx ? { ...s, title: e.target.value } : s))}
                    />
                    <span className="text-xs text-gray-400 ml-2">({t.label})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600" onClick={() => setSections(prev => prev.filter((_, i) => i !== sectionIdx))}>
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
                {/* 章節內容編輯元件 */}
                {section.type === 'overview' && (
                  <OverviewSectionEditor
                    value={section.content as OverviewContent}
                    onChange={v => setSections(prev => prev.map((s, i) => i === sectionIdx ? { ...s, content: v } : s))}
                  />
                )}
                {section.type === 'syntax' && (
                  <SyntaxSectionEditor
                    value={section.content as SyntaxContent}
                    onChange={v => setSections(prev => prev.map((s, i) => i === sectionIdx ? { ...s, content: v } : s))}
                  />
                )}
                {section.type === 'params' && (
                  <ParamsSectionEditor
                    value={section.content as ParamsContent}
                    onChange={v => setSections(prev => prev.map((s, i) => i === sectionIdx ? { ...s, content: v } : s))}
                  />
                )}
                {section.type === 'methods' && (
                  <MethodsSectionEditor
                    value={section.content as MethodsContent}
                    onChange={v => setSections(prev => prev.map((s, i) => i === sectionIdx ? { ...s, content: v } : s))}
                  />
                )}
                {section.type === 'examples' && (
                  <ExamplesSectionEditor
                    value={section.content as ExamplesContent}
                    onChange={v => setSections(prev => prev.map((s, i) => i === sectionIdx ? { ...s, content: v } : s))}
                  />
                )}
                {/* 其他型別後續補齊 */}
              </div>
            );
          })}
          {/* 新增章節按鈕 */}
          <div className="flex gap-2">
            {SECTION_TYPES.filter(t => !sections.some(s => s.type === t.type)).map(t => (
              <button key={t.type} className="flex items-center px-3 py-1 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-primary hover:border-primary/30 transition-colors text-sm" onClick={() => setSections(prev => ([...prev, { id: uuidv4(), type: t.type, title: t.label, content: getDefaultSectionContent(t.type), section_order: prev.length }]))}>
                <i className="ri-add-line mr-1"></i>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {/* 工具列 */}
        <div className="editor-toolbar flex flex-wrap items-center py-2 px-1 mb-6 gap-1 border-b">
          <button className="px-3 py-1.5 text-sm text-gray-700 rounded hover:bg-gray-100" onClick={() => formatSection(0, 'bold')}>
            <i className="ri-bold"></i>
          </button>
          <button className="px-3 py-1.5 text-sm text-gray-700 rounded hover:bg-gray-100" onClick={() => formatSection(0, 'italic')}>
            <i className="ri-italic"></i>
          </button>
          <button className="px-3 py-1.5 text-sm text-gray-700 rounded hover:bg-gray-100" onClick={() => formatSection(0, 'code')}>
            <i className="ri-code-line"></i>
          </button>
          <button className="px-3 py-1.5 text-sm text-gray-700 rounded hover:bg-gray-100" onClick={() => formatSection(0, 'h2')}>
            <i className="ri-h-2"></i>
          </button>
          <div className="ml-auto flex items-center">
            <button className="flex items-center px-3 py-1.5 text-sm text-gray-700 rounded hover:bg-gray-100 mr-2" onClick={handlePreview}>
              <i className="ri-eye-line mr-1"></i>
              <span>預覽</span>
            </button>
            <div className="text-xs text-gray-500">
              <span>{countWords(sections)}</span> 字
            </div>
          </div>
        </div>
        {/* FAQ 區塊 */}
        <FaqsEditor value={faqs} onChange={setFaqs} />
        {/* 資源區塊 */}
        <ResourcesEditor value={resources} onChange={setResources} />
      </main>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-4 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap mr-3" onClick={() => navigate(-1)} disabled={loading}>取消</button>
          <button className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors whitespace-nowrap" onClick={handleSave} disabled={loading}>{loading ? '儲存中...' : '儲存文檔'}</button>
        </div>
      </div>
      {/* 預覽視窗（簡易） */}
      {preview && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-primary" onClick={handlePreview}><i className="ri-close-line text-2xl"></i></button>
            <h2 className="text-xl font-bold mb-4">預覽</h2>
            <div className="space-y-6">
              {sections.map(s => (
                <div key={s.id}>
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  {isOverviewContent(s.content) ? (
                    <>
                      <div className="flex items-center mb-2">
                        <i className={`${s.content.icon} text-primary mr-2`}></i>
                        <span className="font-bold">{s.content.title}</span>
                        <span className="ml-4 text-xs text-gray-500">{s.content.usage}</span>
                        <span className="ml-2 text-xs text-green-800 bg-green-100 px-2 py-0.5 rounded-full">{s.content.level}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {s.content.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">{tag}</span>
                        ))}
                      </div>
                      {s.content.paragraphs.map((p, i) => (
                        <p key={i} className="text-gray-700 mb-2">{p}</p>
                      ))}
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mt-2">
                        <div className="flex">
                          <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-blue-500 mt-0.5">
                            <i className="ri-information-line"></i>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">{s.content.tipTitle}</h3>
                            <div className="mt-2 text-sm text-blue-700">{s.content.tipContent}</div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <pre className="bg-gray-50 rounded p-3 whitespace-pre-wrap text-gray-800">{typeof s.content === 'string' ? s.content : ''}</pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ApiEditPage; 
