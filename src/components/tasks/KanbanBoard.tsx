

import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { useTranslation } from "react-i18next";

export interface Task {
  id: string;
  title: string;
  date: string;
  description?: string;
}

export interface Column {
  key: string;
  title: string;
  isDone?: boolean;
  tasks: Task[];
}

const initialColumnsData = [
  {
    key: "backlog",
    isDone: false,
    tasks: [
      { id: "1", title: "Create a marketing campaign", date: "14 Feb" },
      { id: "2", title: "Review Q2 roadmap", date: "20 Feb" },
    ],
  },
  {
    key: "todo",
    isDone: false,
    tasks: [
      { id: "3", title: "Design new onboarding flow", date: "15 Feb" },
      { id: "4", title: "Set up monitoring alerts", date: "16 Feb" },
    ],
  },
  {
    key: "inProgress",
    isDone: false,
    tasks: [
      { id: "5", title: "Create a marketing campaign", date: "14 Feb" },
      { id: "6", title: "Launch marketing campaign", date: "", description: "Resolved the critical login issue that was affecting users on..." },
    ],
  },
  {
    key: "done",
    isDone: true,
    tasks: [
      { id: "7", title: "Create a marketing campaign", date: "14 Feb" },
      { id: "8", title: "Updated API documentation", date: "", description: "Completed the full update of the API documentation for v2.0. Ad..." },
      { id: "9", title: "Fix login bug", date: "", description: "Successfully launched the Q1 marketing campaign across a..." },
    ],
  },
];

export default function KanbanBoard() {
  const { t } = useTranslation();
  const [columnsData, setColumnsData] = useState(initialColumnsData);

  const columns: Column[] = columnsData.map((col) => ({
    ...col,
    title: t(`tasks.columns.${col.key}`),
  }));
  const [draggedTask, setDraggedTask] = useState<{ task: Task; fromCol: number } | null>(null);

  function handleDragStart(task: Task, colIndex: number) {
    setDraggedTask({ task, fromCol: colIndex });
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(toColIndex: number) {
    if (!draggedTask) return;
    if (draggedTask.fromCol === toColIndex) {
      setDraggedTask(null);
      return;
    }

    setColumnsData((prev) => {
      const next = prev.map((col) => ({ ...col, tasks: [...col.tasks] }));
      next[draggedTask.fromCol].tasks = next[draggedTask.fromCol].tasks.filter(
        (task) => task.id !== draggedTask.task.id
      );
      next[toColIndex].tasks.push(draggedTask.task);
      return next;
    });
    setDraggedTask(null);
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((col, i) => (
        <KanbanColumn
          key={col.key}
          title={col.title}
          count={col.tasks.length}
          tasks={col.tasks}
          isDone={col.isDone}
          onDragStart={(task) => handleDragStart(task, i)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(i)}
        />
      ))}
    </div>
  );
}
