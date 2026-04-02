

import { useState } from "react";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import type { Task } from "./KanbanBoard";

interface KanbanColumnProps {
  title: string;
  count: number;
  tasks: Task[];
  isDone?: boolean;
  onDragStart: (task: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
}

export default function KanbanColumn({
  title,
  count,
  tasks,
  isDone,
  onDragStart,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      className={`flex flex-col flex-1 min-w-[250px] self-start bg-[#1A1A1A]/80 rounded-card p-4 transition-colors duration-200 ${
        isOver ? "border-accent/30" : ""
      }`}
      onDragOver={(e) => {
        onDragOver(e);
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={() => {
        onDrop();
        setIsOver(false);
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-white text-sm font-semibold">{title}</h3>
          <span className="text-text-secondary text-xs">({count})</span>
        </div>
        <button className="w-5 h-5 flex items-center justify-center text-text-secondary hover:text-white transition-colors duration-200">
          <Plus size={14} />
        </button>
      </div>
      <div
        className="space-y-3 min-h-[60px]"
        onDragOver={(e) => e.preventDefault()}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            {...task}
            isDone={isDone}
            onDragStart={() => onDragStart(task)}
          />
        ))}
      </div>
    </div>
  );
}
