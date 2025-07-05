import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ImportantNoteProps {
  children: string;
}

const ImportantNote: React.FC<ImportantNoteProps> = ({ children }) => (
  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg my-4">
    <div className="flex">
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-blue-500 mt-0.5">
        <i className="ri-information-line"></i>
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-blue-800 mb-2">重要提示</h3>
        <div className="text-sm text-blue-700 prose prose-blue max-w-none">
          <ReactMarkdown
            components={{
              code({ children }) {
                return (
                  <code className="code-font bg-blue-100 px-1 py-0.5 rounded text-blue-800">
                    {children}
                  </code>
                );
              },
              strong({ children }) {
                return <strong className="font-bold">{children}</strong>;
              }
            }}
          >
            {children}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  </div>
);

export default ImportantNote;
