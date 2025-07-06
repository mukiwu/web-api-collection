import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MainContentProps {
  children: string;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => (
  <div className="prose prose-slate max-w-none">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
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
        h2({ children, ...props }) {
          const text = String(children);
          const id = text
            .toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
            .replace(/^-+|-+$/g, '');
          return <h2 id={id} className="text-xl font-semibold text-gray-900 mt-12 mb-4" style={{ scrollMarginTop: '72px' }} {...props}>{children}</h2>;
        },
        h3({ children, ...props }) {
          const text = String(children);
          const id = text
            .toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
            .replace(/^-+|-+$/g, '');
          return <h3 id={id} className="text-lg font-medium text-gray-900 mb-3" style={{ scrollMarginTop: '72px' }} {...props}>{children}</h3>;
        },
        blockquote(props) {
          return <blockquote className="border-l-4 border-gray-300 pl-4 text-gray-700 my-4" {...props} />;
        },
        a(props) {
          return <a className="text-primary underline hover:text-primary/80" {...props} />;
        },
        ul(props) {
          return <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2" {...props} />;
        },
        ol(props) {
          return <ol className="list-decimal list-inside space-y-1 text-gray-700" {...props} />;
        },
        li(props) {
          return <li className="mb-1" {...props} />;
        },
        table({ children, ...props }) {
          return (
            <table className="min-w-full border border-gray-200 rounded-lg" {...props}>
              {children}
            </table>
          );
        },
        thead({ children }) {
          return <thead className="bg-gray-50">{children}</thead>;
        },
        tbody({ children }) {
          return <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
        },
        tr({ children }) {
          return <tr>{children}</tr>;
        },
        th({ children, ...props }) {
          return <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-gray-200 border-b" {...props}>{children}</th>;
        },
        td({ children, ...props }) {
          return <td className="px-4 py-3 text-sm text-gray-700 border-gray-200 border-r" {...props}>{children}</td>;
        },
        p(props) {
          return <p className="text-gray-700 mb-4" {...props} />;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  </div>
);

export default MainContent;
