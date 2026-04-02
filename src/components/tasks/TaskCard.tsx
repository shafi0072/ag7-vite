

import { MoreHorizontal, Calendar } from "lucide-react";

interface TaskCardProps {
  title: string;
  date: string;
  description?: string;
  isDone?: boolean;
  onDragStart?: () => void;
}

function DragDots() {
  return (
    <div className="grid grid-cols-2 gap-[3px] flex-shrink-0 mt-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-[3px] h-[3px] rounded-full bg-text-secondary/50" />
      ))}
    </div>
  );
}

export default function TaskCard({
  title,
  date,
  description,
  isDone,
  onDragStart,
}: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-[#FFFFFF1A]/10 border border-border rounded-btn p-3 hover:border-border/80 transition-all duration-200 cursor-grab active:cursor-grabbing active:opacity-60"
    >
      <div className="flex items-start gap-2">
        <DragDots />
        <div
          className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
            isDone ? "bg-blue-400" : "bg-accent"
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-white text-xs font-semibold truncate">{title}</p>
            <button className="text-text-secondary hover:text-white transition-colors duration-200 flex-shrink-0">
              <MoreHorizontal size={14} />
            </button>
          </div>
          {date && !description && (
            <div className="flex items-center gap-1 mt-1 text-text-secondary">
              <Calendar size={10} />
              <span className="text-[10px]">{date}</span>
            </div>
          )}
          {description && (
            <p className="text-text-secondary text-[10px] mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
