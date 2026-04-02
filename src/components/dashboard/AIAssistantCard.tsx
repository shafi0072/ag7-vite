
// UI2
import { MoreHorizontal } from "lucide-react";

const workflows = [
  { num: 1, name: "Establish a workflow", status: "done", badge: "bg-[#22C55E33] text-[#22C55E]" },
  { num: 2, name: "Fitness", status: "in progress", badge: "bg-[#3B82F6]/30 text-[#3B82F6]" },
  { num: 3, name: "Establish a workflow", status: "closed", badge: "bg-[#EF4444]/20 text-[#EF4444]" },
];

// Dot grid: 3 groups, each 3×3. Values represent how many dots per group are orange.
const dotGroups = [9, 6, 3];

export default function AIAssistantCard() {
  return (
    <div
      className="rounded-2xl p-5 h-full relative overflow-hidden flex flex-col"
      style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-1 relative z-10">
        <div>
          <h3 className="text-white text-xl font-bold">AI Assistant</h3>
          <p className="text-gray-400 text-sm mt-0.5 leading-snug">
            I&apos;m your personalised agent<br />specialised in generating leads
          </p>
        </div>
        <button className="text-gray-500 hover:text-white transition-colors flex-shrink-0 mt-1">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Productivity + Robot row */}
      <div className="flex relative z-10 mt-3">
        {/* Left: stats */}
        <div className="flex-1">
          {/* Productivity badge */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-white text-base font-bold">Productivity</span>
            <span
              className="px-3 py-1 text-white text-xs font-semibold rounded-full"
              style={{ background: "#FF6B1A" }}
            >
              24 ↗
            </span>
          </div>

          {/* Large percentage */}
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-white font-bold leading-none" style={{ fontSize: "72px" }}>
              88
            </span>
            <span className="text-white text-2xl font-semibold">%</span>
            <span className="text-gray-400 text-sm ml-1">in one week</span>
          </div>

          {/* Dot grid */}
          <div className="flex gap-4">
            {dotGroups.map((filledCount, gi) => (
              <div key={gi} className="grid grid-cols-3 gap-[5px]">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background:
                        i < filledCount
                          ? i % 2 === 0
                            ? "#F97316"
                            : "#E1AD2A"
                          : "#3a3a3a",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Robot image */}
        <div className="absolute right-[-380px] top-[-20px] w-[900px] h-[900px] pointer-events-none">
          <img
            src="/Robot.png"
            alt="AI Robot"
            className="absolute inset-0 w-full h-full object-contain object-top"
          />
          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-full"
            style={{ background: "linear-gradient(to top, #0d0d0d 0%, #0d0d0d 15%, rgba(13,13,13,0.6) 45%, transparent 100%)" }}
          />
        </div>
      </div>

      {/* Workflow list */}
      <div className="space-y-2 relative z-10 pt-[30px]">
        {workflows.map((wf) => (
          <div
            key={wf.num}
            className="flex items-center"
            style={{
              width: "100%",
              height: 50,
              justifyContent: "space-between",
              borderRadius: 12,
              border: "1px solid #FFFFFF0D",
              padding: 8,
              background: "#161616",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center text-gray-400 text-xs font-semibold flex-shrink-0"
                style={{
                  width: 42,
                  height: 34,
                  borderRadius: 4,
                  padding: "8px 4px",
                  background: "#FFFFFF1A",
                }}
              >
                {wf.num}
              </span>
              <span className="text-white text-sm font-medium">{wf.name}</span>
            </div>
            <span
              className={`${wf.badge} text-[11px] w-[110px] py-1 rounded-[4px] font-medium text-center inline-block`}
            >
              {wf.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
