

import { Plus, MoreHorizontal, Calendar, Mic, Smile, Send } from "lucide-react";

const tasks = [
  {
    title: "Create a marketing campaign",
    date: "14 Feb",
  },
  {
    title: "Launch marketing campaign",
    description: "Resolved the critical login issue that was affecting users on...",
  },
];

export default function TasksWidget() {
  return (
    <div className="rounded-card p-5 h-full flex flex-col 
  bg-[radial-gradient(circle_at_top,_rgba(255,140,0,0.15),_transparent_40%),linear-gradient(180deg,_#0A0701,_#050301)] 
  border border-[#1a140a]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-bold">Tasks</h3>
        <button className="text-text-secondary hover:text-white transition-colors duration-200">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className=" width-[479px] height-[259px] rounded-[16px]  p-[20px] mb-[16px]"
        style={{
          backgroundColor: "rgba(26, 26, 26, 0.8)", // 80% opacity
          backdropFilter: "blur(24%)", // 24% blur
        }}>
        {/* In Progress section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium">In Progress</span>
            <span className="text-text-secondary text-xs">({tasks.length})</span>
          </div>
          <button className="text-text-secondary hover:text-white transition-colors duration-200">
            <Plus size={16} />
          </button>
        </div>
        {/* Task cards */}
        <div className="flex-1 space-y-3">
          {tasks.map((task, i) => (
            <div
              key={i}
              className="bg-white/10 border border-border rounded-btn p-3"
            >
              <div className="flex items-start gap-2">
                <div className="flex flex-col gap-0.5 mt-1.5 flex-shrink-0">
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-1 h-1 rounded-full bg-text-secondary" />
                    <div className="w-1 h-1 rounded-full bg-text-secondary" />
                    <div className="w-1 h-1 rounded-full bg-text-secondary" />
                    <div className="w-1 h-1 rounded-full bg-text-secondary" />
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white text-xs font-semibold truncate">{task.title}</p>
                    <button className="text-text-secondary hover:text-white flex-shrink-0">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                  {task.date && (
                    <div className="flex items-center gap-1 mt-1 text-text-secondary">
                      <Calendar size={10} />
                      <span className="text-[10px]">{task.date}</span>
                    </div>
                  )}
                  {task.description && (
                    <p className="text-text-secondary text-[10px] mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="mt-auto">
        <div className="bg-[rgba(26,26,26,0.8)] rounded-btn overflow-hidden w-full h-[140px] p-4 flex flex-col justify-between border border-[#FFFFFF1A]">
          <textarea
            placeholder="Type your message here..."
            className="w-full flex-1 bg-transparent text-xs text-white placeholder:text-text-secondary focus:outline-none resize-none align-top"
          />

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <button className="h-8 w-8 p-1.5 flex items-center justify-center rounded-full bg-[#FFFFFF33] text-white hover:bg-white/40 transition-all duration-200">
                <Plus size={16} />
              </button>
              <button className="text-text-white hover:text-secondary transition-colors duration-200">
                <Mic size={16} />
              </button>
              <button className="text-text-white hover:text-secondary transition-colors duration-200">
                <Smile size={16} />
              </button>
              <button className="text-text-white hover:text-secondary transition-colors duration-200">
                <MoreHorizontal size={16} />
              </button>
            </div>

            <button className="h-8 w-8 p-1.5 flex items-center justify-center rounded-full bg-[#FFFFFF33] text-white hover:bg-white/40 transition-all duration-200">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
