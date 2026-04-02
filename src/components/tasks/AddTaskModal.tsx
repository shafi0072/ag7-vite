

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Minus, Plus, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatHeaderDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDisplayDate(date: Date) {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function CustomDatePicker({
  value,
  onChange,
}: {
  value: Date | null;
  onChange: (d: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => value ?? new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const year = view.getFullYear();
  const month = view.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const today = new Date();
  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const isSelected = (d: number) =>
    value
      ? d === value.getDate() && month === value.getMonth() && year === value.getFullYear()
      : false;

  function prevMonth() {
    setView(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setView(new Date(year, month + 1, 1));
  }
  function select(d: number) {
    const selected = new Date(year, month, d);
    onChange(selected);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      {/* Input */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 bg-[#ffffff1a] border border-[#ffffff1a] rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-[#e8612a]/50 transition-colors duration-200"
      >
        <CalendarDays size={16} className="text-[#6b6b6b] shrink-0" />
        <span className={value ? "text-white" : "text-[#6b6b6b]"}>
          {value ? formatDisplayDate(value) : "dd/mm/yyyy"}
        </span>
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute bottom-full mb-2 left-0 z-50 bg-[#1c1c1e] border border-[#ffffff1a] rounded-2xl shadow-2xl p-4 w-72">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              style={{ width: "32px", height: "32px", border: "1px solid #FFFFFF80", borderRadius: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}
              className="hover:opacity-70 transition-opacity shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.631 10.9017L13.0422 15.4905L17.631 20.0793" stroke="white" strokeWidth="1.28" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-white text-sm font-semibold">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              style={{ width: "32px", height: "32px", border: "1px solid #FFFFFF80", borderRadius: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}
              className="hover:opacity-70 transition-opacity shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.369 10.9017L18.9578 15.4905L14.369 20.0793" stroke="white" strokeWidth="1.28" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[#6b6b6b] text-xs font-medium py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((d, i) => {
              if (d === null) return <div key={`empty-${i}`} />;
              const selected = isSelected(d);
              const todayCell = isToday(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => select(d)}
                  className={`
                    mx-auto flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors duration-150
                    ${selected
                      ? "bg-[#e8612a] text-white"
                      : todayCell
                      ? "border border-[#e8612a] text-[#e8612a] hover:bg-[#e8612a]/10"
                      : "text-white hover:bg-[#1a1a1a]"
                    }
                  `}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const { t } = useTranslation();
  const [recurringOpen, setRecurringOpen] = useState(true);
  const [recurringDate, setRecurringDate] = useState<Date | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignAgent, setAssignAgent] = useState("");

  if (!isOpen) return null;

  const today = formatHeaderDate(new Date());

  const allFilled =
    title.trim() !== "" &&
    description.trim() !== "" &&
    assignAgent !== "" &&
    (!recurringOpen || recurringDate !== null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[#1A1A1ACC]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-[#1c1c1e] border border-[#2a2a2d] rounded-2xl shadow-2xl"
        style={{ width: "450px", height: "680px", display: "flex", flexDirection: "column", borderRadius: "16px", padding: "24px" }}
      >
        {/* Header */}
        <div className="pb-4">
          <h2 className="text-white text-base font-semibold">
            {t("tasks.modal.title")} - {today}
          </h2>
        </div>

        {/* Form */}
        <div className="pb-2 space-y-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
          {/* Title */}
          <div>
            <label className="text-white text-sm block mb-1.5">{t("tasks.modal.titleLabel")}</label>
            <input
              type="text"
              placeholder={t("tasks.modal.titlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#ffffff1a] border border-[#ffffff1a] rounded-lg py-2.5 px-3 text-sm text-white placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#e8612a]/50 transition-colors duration-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-white text-sm block mb-1.5">{t("tasks.modal.description")}</label>
            <textarea
              rows={4}
              placeholder={t("tasks.modal.descriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#ffffff1a] border border-[#ffffff1a] rounded-lg py-2.5 px-3 text-sm text-white placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#e8612a]/50 transition-colors duration-200 resize-none"
            />
          </div>

          {/* Column */}
          <div>
            <label className="text-white text-sm block mb-1.5">{t("tasks.modal.column")}</label>
            <div className="relative">
              <select className="w-full bg-[#ffffff1a] border border-[#ffffff1a] rounded-lg py-2.5 pl-3 pr-9 text-sm text-white focus:outline-none focus:border-[#e8612a]/50 transition-colors duration-200 appearance-none">
                <option value="backlog" style={{ backgroundColor: "#1c1c1e", color: "#ffffff" }}>{t("tasks.columns.backlog")}</option>
                <option value="todo" style={{ backgroundColor: "#1c1c1e", color: "#ffffff" }}>{t("tasks.columns.todo")}</option>
                <option value="in-progress" style={{ backgroundColor: "#1c1c1e", color: "#ffffff" }}>{t("tasks.columns.inProgress")}</option>
                <option value="done" style={{ backgroundColor: "#1c1c1e", color: "#ffffff" }}>{t("tasks.columns.done")}</option>
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]" />
            </div>
          </div>

          {/* Assign Agent */}
          <div>
            <label className="text-white text-sm block mb-1.5">
              {t("tasks.modal.assignAgent")}
            </label>
            <div className="relative">
              <select
                value={assignAgent}
                onChange={(e) => setAssignAgent(e.target.value)}
                className="w-full bg-[#ffffff1a] border border-[#ffffff1a] rounded-lg py-2.5 pl-3 pr-9 text-sm text-[#6b6b6b] focus:outline-none focus:border-[#e8612a]/50 transition-colors duration-200 appearance-none"
              >
                <option value="" disabled style={{ backgroundColor: "#1c1c1e", color: "#ffffff" }}>{t("tasks.modal.selectAgent")}</option>
                <option value="agent-1" style={{ backgroundColor: "#1c1c1e", color: "#ffffff" }}>Agent 1</option>
                <option value="agent-2" style={{ backgroundColor: "#1c1c1e", color: "#ffffff" }}>Agent 2</option>
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]" />
            </div>
          </div>

          {/* Recurring Task */}
          <div className="overflow-visible">
            <button
              type="button"
              onClick={() => setRecurringOpen((v) => !v)}
              className="w-full flex items-center justify-between py-3 text-white text-sm font-medium hover:bg-[#1a1a1a] transition-colors duration-200 rounded-lg"
            >
              <span>{t("tasks.modal.recurring")}</span>
              {recurringOpen ? (
                <Minus size={16} className="text-white" />
              ) : (
                <Plus size={16} className="text-white" />
              )}
            </button>

            {recurringOpen && (
              <div className="pb-4 space-y-3 border-t border-[#ffffff1a]">
                {/* Repeat */}
                <div className="pt-3">
                  <label className="text-white text-sm block mb-1.5">{t("tasks.modal.repeat")}</label>
                  <div className="relative">
                    <select className="w-full bg-[#ffffff1a] border border-[#ffffff1a] rounded-lg py-2.5 pl-3 pr-9 text-sm text-white focus:outline-none focus:border-[#e8612a]/50 transition-colors duration-200 appearance-none">
                      <option value="daily" style={{ backgroundColor: "#1c1c1e", color: "#ffffff" }}>{t("tasks.modal.daily")}</option>
                      <option value="weekly" style={{ backgroundColor: "#1c1c1e", color: "#ffffff" }}>{t("tasks.modal.weekly")}</option>
                      <option value="monthly" style={{ backgroundColor: "#1c1c1e", color: "#ffffff" }}>{t("tasks.modal.monthly")}</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]" />
                  </div>
                </div>

                {/* Date picker */}
                <div>
                  <label className="text-white text-sm block mb-1.5">
                    {t("tasks.modal.assignAgent")}
                  </label>
                  <CustomDatePicker
                    value={recurringDate}
                    onChange={setRecurringDate}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            style={{ width: "96px", height: "45px", background: "#ffffff1a", border: "1px solid #ffffff1a", borderRadius: "8px" }}
            className="text-white text-sm font-medium hover:opacity-80 transition-opacity duration-200 shrink-0"
          >
            {t("tasks.modal.cancel")}
          </button>
          <button
            style={
              allFilled
                ? { background: "linear-gradient(180deg, #E97334 0%, #CC4130 100%)", width: "143px", height: "45px", borderRadius: "8px", color: "#FFFFFF" }
                : { background: "#E97334", opacity: 0.6, width: "143px", height: "45px", borderRadius: "8px" }
            }
            className="flex items-center justify-center gap-1.5 text-white text-sm font-medium transition-all duration-200 shrink-0"

>
            <Plus size={15} />
            {t("tasks.modal.add")}
          </button>
        </div>
      </div>
    </div>
  );
}
