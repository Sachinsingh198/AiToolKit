import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { checkHeading, replaceHeadingStars } from "../helper";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // Keep code blocks dark
import { Copy, Check } from "lucide-react";

// CodeBlock Component (No major changes, just ensuring background stays dark)
const CodeBlock = ({ language, code }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => { /* ... same as before ... */ };

  return (
    <div className="rounded-md overflow-hidden my-4 shadow-lg border border-gray-200 dark:border-zinc-700 bg-[#1e1e1e] max-w-[85vw] md:max-w-full">
       {/* ... same structure ... */}
       {/* Keep standard syntax highlighter logic */}
    </div>
  );
};
// Note: I skipped repeating the full CodeBlock logic above to save space, copy previous version but keep it inside this file.

// --- MAIN ANSWERS COMPONENT ---
const Answers = ({ ans, index, type }) => {
  // ... (keep state logic same) ...
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);
  
  useEffect(() => {
      if (checkHeading(ans)) { setHeading(true); setAnswer(replaceHeadingStars(ans)); }
      else { setHeading(false); setAnswer(ans); }
  }, [ans]);


  const components = {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const codeText = String(children).replace(/\n$/, "");

      return !inline && match ? (
         // Use the CodeBlock logic here (make sure to include the CodeBlock component definition above)
         <div className="rounded-md overflow-hidden my-4 shadow-md bg-[#1e1e1e] text-white">
            <div className="flex justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
                <span className="text-xs text-gray-400">{match[1]}</span>
            </div>
            <div className="overflow-x-auto">
                <SyntaxHighlighter language={match[1]} style={vscDarkPlus} PreTag="div" customStyle={{margin:0}}>
                    {codeText}
                </SyntaxHighlighter>
            </div>
         </div>
      ) : (
        <code className="px-1.5 py-0.5 mx-1 rounded-md bg-gray-200 text-pink-600 dark:bg-zinc-800 dark:text-pink-400 font-mono text-sm border border-gray-300 dark:border-zinc-700">
          {children}
        </code>
      );
    },

    // --- UPDATED STYLES FOR LIGHT/DARK MODE ---
    h1: ({ children }) => <h1 className="text-2xl font-bold my-4 text-indigo-700 dark:text-indigo-300">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-semibold my-3 text-purple-700 dark:text-purple-300">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-medium my-2 text-gray-900 dark:text-zinc-200">{children}</h3>,
    
    ul: ({ children }) => <ul className="list-disc pl-6 space-y-1 my-3 marker:text-gray-500 dark:marker:text-zinc-500">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 space-y-1 my-3 marker:text-gray-500 dark:marker:text-zinc-500">{children}</ol>,
    li: ({ children }) => <li className="pl-1 text-gray-800 dark:text-zinc-300">{children}</li>,
    
    p: ({ children }) => <p className="leading-7 mb-3 text-gray-800 dark:text-zinc-300">{children}</p>,
    
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-bold text-black dark:text-white">{children}</strong>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-4 bg-gray-100 dark:bg-zinc-800/30 rounded-r italic text-gray-600 dark:text-zinc-400">
        {children}
      </blockquote>
    ),
  };

  return (
    <div className={`text-base w-full ${type === "q" ? "pl-1 text-white" : "pl-0"}`}>
        <ReactMarkdown components={components}>{answer}</ReactMarkdown>
    </div>
  );
};

export default Answers;