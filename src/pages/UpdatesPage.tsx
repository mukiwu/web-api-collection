import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/ui/Modal';

interface FileChange {
  filename: string;
  status: 'added' | 'modified' | 'removed' | 'renamed';
  html_url: string;
}

interface Update {
  id: string;
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
  baseTag: string | null;
  headTag: string;
}

const UpdateItem: React.FC<{
  update: Update;
  openDetails: string | null;
  toggleDetails: (id: string) => void;
  onShowChanges: (baseTag: string | null, headTag: string, title: string) => void;
}> = ({ update, openDetails, toggleDetails, onShowChanges }) => {
  const { id, date, type, typeColor, typeIcon, title, version, description, details, baseTag, headTag } = update;
  const isOpen = openDetails === id;

  return (
    <div className="p-6">
      <div className="flex">
        <aside className="w-32 flex-shrink-0">
          <time className="text-sm text-gray-500">{date}</time>
          <div className={`mt-1 inline-flex items-center rounded-full bg-${typeColor}-50 px-2 py-1`}>
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
            <button onClick={() => { console.log('UpdateItem baseTag:', baseTag); onShowChanges(baseTag, headTag, title); }} className="text-sm text-gray-500 hover:text-gray-700 flex items-center !rounded-button" disabled={!baseTag}>
              <div className="w-5 h-5 flex items-center justify-center mr-1">
                <i className="ri-file-text-line"></i>
              </div>
              <span className="whitespace-nowrap">變更文件</span>
            </button>
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
                </div>
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusMap: { [key: string]: { text: string; className: string } } = {
    added: { text: '新增', className: 'bg-green-100 text-green-800' },
    modified: { text: '修改', className: 'bg-blue-100 text-blue-800' },
    removed: { text: '移除', className: 'bg-red-100 text-red-800' },
    renamed: { text: '重命名', className: 'bg-yellow-100 text-yellow-800' },
  };
  const { text, className } = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };
  return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${className}`}>{text}</span>;
};


const UpdatesPage: React.FC = () => {
  const [openDetails, setOpenDetails] = useState<string | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [changedFiles, setChangedFiles] = useState<FileChange[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/mukiwu/web-api-collection/releases');
        const releases = await response.json();
        
        const formattedReleases = releases.map((release: any, index: number): Update => {
          const { name, tag_name, published_at, body } = release;
          let type = '功能更新';
          let typeColor = 'blue';
          let typeIcon = 'ri-refresh-line';

          if (name.toLowerCase().includes('feat')) {
            type = '新功能';
            typeColor = 'green';
            typeIcon = 'ri-add-line';
          } else if (name.toLowerCase().includes('fix')) {
            type = '問題修復';
            typeColor = 'purple';
            typeIcon = 'ri-tools-line';
          } else if (name.toLowerCase().includes('deprecated')) {
            type = '棄用通知';
            typeColor = 'yellow';
            typeIcon = 'ri-error-warning-line';
          }

          const previousRelease = releases[index + 1];
          const baseTag = previousRelease ? previousRelease.tag_name : null;

          return {
            id: `release-${release.id}`,
            date: new Date(published_at).toISOString().split('T')[0],
            type,
            typeColor,
            typeIcon,
            title: name,
            version: tag_name,
            description: body.split('\n')[0].replace(/#+\s*/, ''),
            details: {
              title: '更新內容：',
              items: body.split('\n').slice(1).filter((line: string) => line.trim().startsWith('* ')).map((line: string) => line.replace('* ', '')),
              code: ''
            },
            baseTag,
            headTag: tag_name,
          };
        });
        setUpdates(formattedReleases);
      } catch (error) {
        console.error("Error fetching GitHub releases:", error);
      }
    };

    fetchReleases();
  }, []);

  const toggleDetails = (id: string) => {
    setOpenDetails(openDetails === id ? null : id);
  };

  const handleShowChanges = async (baseTag: string | null, headTag: string, title: string) => {
    console.log('handleShowChanges called');
    console.log('baseTag:', baseTag, 'headTag:', headTag);

    if (!baseTag) {
      console.log('baseTag is null, exiting.');
      return;
    }
    
    setModalTitle(`「${title}」的變更文件`);
    setIsModalOpen(true);
    console.log('isModalOpen set to true');
    setIsLoadingFiles(true);
    setChangedFiles([]);

    try {
      const apiUrl = `https://api.github.com/repos/mukiwu/web-api-collection/compare/${baseTag}...${headTag}`;
      console.log('Fetching from:', apiUrl);
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log('API response:', data);
      setChangedFiles(data.files || []);
    } catch (error) {
      console.error("Error fetching commit comparison:", error);
    } finally {
      setIsLoadingFiles(false);
      console.log('Finished fetching, isLoadingFiles set to false');
    }
  };

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
                    update={update}
                    openDetails={openDetails}
                    toggleDetails={toggleDetails}
                    onShowChanges={handleShowChanges}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        {isLoadingFiles ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ul className="space-y-2">
            {changedFiles.length > 0 ? changedFiles.map(file => (
              <li key={file.filename} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                <span className="code-font text-sm text-gray-700">{file.filename}</span>
                <div className="flex items-center space-x-4">
                  <StatusBadge status={file.status} />
                  <a href={file.html_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                    查看 Diff
                  </a>
                </div>
              </li>
            )) : (
              <p className="text-center text-gray-500 py-8">沒有找到變更的文件。</p>
            )}
          </ul>
        )}
      </Modal>
    </div>
  );
};

export default UpdatesPage;
