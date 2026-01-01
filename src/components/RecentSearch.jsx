import React from "react";
import { MessageSquare, Plus, Trash2, Sun, Moon } from "lucide-react"; 

function RecentSearch({ recentHistory, setRecentHistory, setSelectedHistory, darkMode, setDarkMode }) {
  const clearHistory = () => {
    if (window.confirm("Clear all history?")) {
      localStorage.removeItem("history");
      setRecentHistory([]);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      {/* New Chat Button */}
      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-md shadow-indigo-500/20 mb-6"
      >
        <Plus size={20} />
        <span className="font-medium">New Chat</span>
      </button>

      <div className="flex items-center justify-between px-2 mb-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider">Recent</span>
        {recentHistory.length > 0 && (
            <button onClick={clearHistory} className="text-gray-400 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 p-1">
                <Trash2 size={14} />
            </button>
        )}
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-1">
        {recentHistory && recentHistory.length > 0 ? (
          recentHistory.map((item, index) => (
            <button
              onClick={() => setSelectedHistory(item)}
              key={index}
              className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg text-sm truncate transition-all
                text-gray-600 hover:bg-gray-100 hover:text-gray-900 
                dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100"
            >
              <MessageSquare size={16} className="shrink-0 opacity-50" />
              <span className="truncate">{item}</span>
            </button>
          ))
        ) : (
            <div className="text-center mt-10 text-gray-400 dark:text-zinc-600 text-sm italic">
                No recent history
            </div>
        )}
      </div>
      
      {/* FOOTER: User Profile + Theme Toggle */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500"></div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-200">User</span>
                <span className="text-xs text-gray-500 dark:text-zinc-500">Pro Plan</span>
            </div>
          </div>
          
          {/* Theme Toggle Button */}
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 transition-colors"
            title="Toggle Theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
      </div>
    </div>
  );
}

export default RecentSearch;