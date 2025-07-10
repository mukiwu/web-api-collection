import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

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
            <ReactMarkdown>{faq.answer}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default FaqCard; 
