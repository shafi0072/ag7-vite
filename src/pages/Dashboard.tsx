import CalendarWidget from "@/components/dashboard/CalendarWidget";
import AreasOfLifeCard from "@/components/dashboard/AreasOfLifeCard";
import TasksWidget from "@/components/dashboard/TasksWidget";
import TasksDoneCard from "@/components/dashboard/TasksDoneCard";
import AIAssistantCard from "@/components/dashboard/AIAssistantCard";
import ContainerPanel from "@/components/dashboard/ContainerPanel";

export default function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-12 gap-6 pb-6">
        {/* Top row */}
        <div id="tour-calendar" className="col-span-8 min-h-[320px]">
          <CalendarWidget />
        </div>
        <div id="tour-areas-of-life" className="col-span-4 min-h-[320px]">
          <AreasOfLifeCard />
        </div>

        {/* Bottom row */}
        <div className="col-span-12 flex gap-6">
          <div id="tour-tasks" style={{ flex: 1.4, height: 523 }}>
            <TasksWidget />
          </div>
          <div style={{ flex: 0.7, height: 523 }} className="flex flex-col gap-6">
            <div id="tour-container-panel" className="flex-1 min-h-0">
              <ContainerPanel />
            </div>
            <div id="tour-tasks-done" className="flex-1 min-h-0">
              <TasksDoneCard />
            </div>
          </div>
          <div id="tour-ai-assistant" style={{ width: 430, flexShrink: 0, height: 523 }}>
            <AIAssistantCard />
          </div>
        </div>
      </div>
    </>
  );
}
