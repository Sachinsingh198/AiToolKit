import React, { useEffect, useRef, useState } from "react";
import { Send, Menu, X, Sun, Moon } from "lucide-react"; 
import { URL } from "./constants";
import RecentSearch from "./components/RecentSearch";
import QuestionAndAnswer from "./components/QuestionAndAnswer";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollToAnswer = useRef(null);
  const [loader, setLoader] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // --- THEME STATE ---
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "light" ? false : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  // -------------------

  const askQuestion = async () => {
    if (!question && !selectedHistory) return false;
    setSidebarOpen(false);

    let currentQuestion = question;
    
    if (question) {
      let history = JSON.parse(localStorage.getItem("history")) || [];
      history = [question, ...history];
      localStorage.setItem("history", JSON.stringify(history));
      setRecentHistory(history);
    } else {
        currentQuestion = selectedHistory;
    }

    // ... (rest of payload logic is same)
    const payloadData = currentQuestion;
    const payload = {
      model: "sonar",
      messages: [
        { role: "system", content: "Be precise and helpful." },
        { role: "user", content: payloadData },
      ],
      temperature: 0.2,
    };

    setLoader(true);
    setResult((prev) => [...prev, { type: "q", text: currentQuestion }]);
    setQuestion("");

    try {
        let response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify(payload),
        });

        const data = await response.json();
        let dataString = data.choices[0].message.content;
        dataString = dataString.replace(/\[\d+\]/g, "");

        setResult((prev) => [...prev, { type: "a", text: dataString }]);
    } catch (error) {
        setResult((prev) => [...prev, { type: "a", text: "Sorry, something went wrong." }]);
    }
    setLoader(false);
  };

  useEffect(() => {
    if (scrollToAnswer.current) {
      scrollToAnswer.current.scrollTop = scrollToAnswer.current.scrollHeight;
    }
  }, [result]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.ctrlKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  useEffect(() => {
    if (selectedHistory) askQuestion();
  }, [selectedHistory]);

  return (
    // Main Container: Switch between dark/light backgrounds
    <div className="flex h-screen bg-gray-50 dark:bg-[#0f0f12] text-zinc-800 dark:text-zinc-100 font-sans overflow-hidden transition-colors duration-300">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        ></div>
      )}

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 dark:bg-[#0f0f12]/90 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 z-20 backdrop-blur">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-zinc-600 dark:text-zinc-400">
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <span className="ml-4 font-semibold text-zinc-800 dark:text-zinc-200">AI Assistant</span>
          </div>
          
          {/* Mobile Theme Toggle */}
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-zinc-600 dark:text-zinc-400">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
      </div>

      {/* SIDEBAR */}
      <div className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-[#18181b] border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative md:flex
      `}>
        <RecentSearch
          recentHistory={recentHistory}
          setRecentHistory={setRecentHistory}
          setSelectedHistory={(item) => {
             setSelectedHistory(item);
             setSidebarOpen(false);
          }}
          // Pass theme props
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col relative w-full h-full pt-14 md:pt-0">
        
        <div ref={scrollToAnswer} className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar p-4">
          {result.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
               <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                  <Send className="text-white w-8 h-8 md:w-10 md:h-10" />
               </div>
               <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                  Hello, Human.
               </h1>
            </div>
          ) : (
             <div className="max-w-3xl mx-auto w-full pb-32 pt-4 md:pt-8">
               {result.map((item, index) => (
                 <QuestionAndAnswer key={index} item={item} index={index} />
               ))}
               {loader && (
                   <div className="animate-pulse flex gap-2 items-center text-gray-500 dark:text-zinc-500 mt-4 pl-2">
                       <span className="text-xs font-mono">Thinking...</span>
                   </div>
               )}
             </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-gray-50 via-gray-50 dark:from-[#0f0f12] dark:via-[#0f0f12] to-transparent pt-10 pb-4 md:pb-6 px-4">
          <div className="max-w-3xl mx-auto relative">
             <div className="relative flex items-end bg-white dark:bg-[#1e1e22] rounded-xl border border-gray-200 dark:border-zinc-700/50 shadow-xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5 focus-within:ring-indigo-500/50 transition-all">
                <textarea
                  className="w-full bg-transparent text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 px-4 py-3 md:py-4 max-h-32 md:max-h-48 min-h-[50px] outline-none resize-none text-sm md:text-base"
                  value={question}
                  onChange={(e) => {
                      setQuestion(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  rows={1}
                />
                <button
                  disabled={!question || loader}
                  onClick={askQuestion}
                  className="mb-1.5 mr-1.5 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-zinc-700 transition-all"
                >
                  <Send size={18} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;