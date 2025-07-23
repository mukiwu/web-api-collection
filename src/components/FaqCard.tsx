import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

function FaqCard({ faq }: { faq: { id: string; question: string; answer: string } }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(faq.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <button
        className="flex items-center w-full text-left focus:outline-none hover:cursor-pointer"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <i className="ri-question-line text-lg text-primary mr-3"></i>
        <span className="text-lg font-medium text-gray-900 flex-1">{faq.question}</span>
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
                strong({ children }) {
                  return <strong className="font-bold">{children}</strong>;
                }
              }}
            >{faq.answer.replace(/\\n/g, '\n')}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default FaqCard; 
