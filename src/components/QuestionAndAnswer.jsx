import React from "react";
import Answers from "./Answers";
import { User, Bot } from "lucide-react";

const QuestionAndAnswer = ({ item, index }) => {
  const isUser = item.type === "q";

  return (
    <div className={`flex w-full mb-6 md:mb-8 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex w-full md:max-w-[85%] gap-3 md:gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        
        {/* Avatar */}
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 hidden md:flex shadow-sm ${
            isUser 
            ? "bg-indigo-600 text-white" 
            : "bg-white border border-gray-200 text-indigo-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-teal-400"
        }`}>
            {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Content Bubble */}
        <div className={`relative px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl overflow-hidden max-w-full ${
            isUser 
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10" // User bubble always indigo
            : "bg-white border border-gray-100 text-gray-800 dark:bg-transparent dark:border-transparent dark:text-zinc-300 -mt-2 shadow-sm dark:shadow-none" // AI bubble white in light mode
        }`}>
            <Answers ans={item.text} index={index} type={item.type} />
        </div>

      </div>
    </div>
  );
};

export default QuestionAndAnswer;