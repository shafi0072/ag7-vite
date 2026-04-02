import { useState } from "react";
import { Radio, Plus } from "lucide-react";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import { useTranslation } from "react-i18next";

export default function Tasks() {
  const { t } = useTranslation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">{t("tasks.title")}</h1>
          <p className="text-text-secondary text-sm mt-1">
            {t("tasks.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-btn text-white text-sm hover:bg-surface-hover transition-colors duration-200">
            <Radio size={14} />
            {t("tasks.liveFeed")}
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-accent rounded-btn text-white text-sm font-medium hover:bg-accent/90 transition-colors duration-200"
          >
            <Plus size={14} />
            {t("tasks.addTask")}
          </button>
        </div>
      </div>
      <KanbanBoard />

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
