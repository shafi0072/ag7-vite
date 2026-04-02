

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const tasksByDate: Record<string, { title: string; color: string }[]> = {
  "2026-03-09": [{ title: "Fix login bug", color: "bg-blue-500" }],
  "2026-03-18": [
    { title: "Fix login bug", color: "bg-red-500" },
    { title: "Create a marketing camp...", color: "bg-blue-500" },
    { title: "Launch marketing campaign", color: "bg-green-500" },
  ],
};
// s
export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const getDateKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Calendar</h1>
          <p className="text-text-secondary text-sm mt-1">
            View completed tasks by date
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={prevMonth}
            className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-text-white  transition-colors duration-200"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-white text-lg font-bold min-w-[140px] text-center">
            {monthName} {year}
          </span>
          <button
            onClick={nextMonth}
            className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-text-white hover:text-white hover:border-white transition-colors duration-200"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-[10px]">
        {dayNames.map((d) => (
          <div
            key={d}
            className="text-text-secondary text-xs font-medium text-center py-2"
          >
            {d}
          </div>
        ))}

        {cells.map((day, i) => {
          const dateKey = day ? getDateKey(day) : "";
          const tasks = day ? tasksByDate[dateKey] || [] : [];
          const isHovered = hoveredDate === dateKey && tasks.length > 0;

          return (
            <div
              key={i}
              style={day ? { width: "174px", height: "140px", border: "1px solid #FFFFFF33", borderRadius: "8px", padding: "16px 8px 16px 8px", boxSizing: "border-box" } : {}}
              className={`relative transition-colors duration-200 ${day ? "cursor-pointer hover:border-white/30" : ""}`}
              onMouseEnter={() => day && setHoveredDate(dateKey)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              {day && (
                <>
                  <span style={{ color: "#FFFFFF", fontSize: "18px", fontFamily: "Inter", fontWeight: 400, lineHeight: "26px", letterSpacing: "0%", display: "block", textAlign: "center" }}>
                    {String(day).padStart(2, "0")}
                  </span>
                  <div className="mt-1 space-y-1">
                    {tasks.map((task, ti) => (
                      <div key={ti} className="flex items-center gap-1">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${task.color} flex-shrink-0`}
                        />
                        <span className="text-[10px] text-white truncate leading-tight">
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  {isHovered && (
                    <div className="absolute z-20 top-full left-0 mt-1 bg-surface border border-border rounded-md p-3 shadow-xl min-w-[180px]">
                      <p className="text-white text-xs font-medium mb-2">
                        {monthName} {day}
                      </p>
                      {tasks.map((task, ti) => (
                        <div
                          key={ti}
                          className="flex items-center gap-2 py-1"
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${task.color}`}
                          />
                          <span className="text-white text-xs">
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
