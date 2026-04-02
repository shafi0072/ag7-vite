

import { ChevronRight } from "lucide-react";

const days = [
  { name: "Mon", date: 11 },
  { name: "Tue", date: 12, active: true },
  { name: "Wed", date: 13 },
  { name: "Thu", date: 14 },
  { name: "Fri", date: 15 },
  { name: "Sat", date: 16 },
];

const hours = ["8:00 am", "12:00 pm", "04:00 pm", "08:00 pm"];

const events = [
  {
    dayIndex: 1,
    hourIndex: 0,
    title: "Weekly Syn",
    subtitle: "About new project",
    avatars: ["/avatar-1.jpg", "/avatar-2.jpg"],
    accent: true,
  },
  {
    dayIndex: 3,
    hourIndex: 2,
    title: "Weekly Syn",
    subtitle: "About new project",
    avatars: ["/avatar-2.jpg", "/avatar-3.jpg"],
    accent: false,
  },
];

export default function CalendarWidget() {
  return (
    <div className="bg-black rounded-[20px] p-6  flex flex-col relative overflow-hidden h-full ">
      {/* top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[120px] bg-orange-500/20 blur-[80px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <button className="px-5 py-2 rounded-full bg-white/10 border border-white/10 text-white text-sm backdrop-blur-md">
          Last Week
        </button>

        <h3 className="text-white text-[18px] font-medium tracking-wide">
          Wednesday June 12, 13:07
        </h3>

        <button className="px-5 py-2 rounded-full bg-white/10 border border-white/10 text-white text-sm backdrop-blur-md">
          Next Week
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-[100px_repeat(6,1fr)] mb-6 relative z-10">
        <div />
        {days.map((day) => (
          <div key={day.name} className="text-center">
            <p
              className={`text-[14px] ${day.active ? "text-white" : "text-white/40"
                }`}
            >
              {day.name}
            </p>
            <p
              className={`text-[18px] font-medium ${day.active ? "text-white" : "text-white/50"
                }`}
            >
              {day.date}
            </p>
          </div>
        ))}
      </div>

      {/* Calendar body */}
      <div className="grid grid-cols-[100px_repeat(6,1fr)] relative z-10 h-[144px]">
        {/* Time column */}
        <div className="flex flex-col pr-4">
          {hours.map((hour) => (
            <div
              key={hour}
              className="text-#FFFFFF text-[13px] h-[36px] flex items-start"
            >
              {hour}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((_, dayIdx) => (
          <div
            key={dayIdx}
            className="relative border-l border-white/10 h-[144px] "
          >
            {events
              .filter((event) => event.dayIndex === dayIdx)
              .map((event, i) => (
                <div
                  key={i}
                  className={`absolute left-2 right-2 w-[240px] h-[58px] rounded-[16px] px-4 py-3 flex items-center justify-between  ${event.accent
                    ? "bg-[#FF7539] shadow-[0_0_40px_rgba(255,122,48,0.4)]"
                    : "bg-[#22201A] border border-white/10 backdrop-blur-md"
                    }`}
                  style={{
                    top: `${event.hourIndex * 36 + 2}px`,
                  }}
                >
                  <div>
                    <p className="text-white font-semibold text-[14px]">
                      {event.title}
                    </p>
                    <p className="text-white/70 text-[12px]">
                      {event.subtitle}
                    </p>
                  </div>

                  <div className="flex -space-x-3">
                    {event.avatars.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt=""
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full border-2 border-black object-cover"
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Bottom right arrow */}
      <div className="absolute bottom-5 right-5">
        <button className="w-10 h-10  flex items-center justify-center text-white">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_i_52_95)">
              <rect width="32" height="32" rx="16" fill="white" fill-opacity="0.1" />
              <path opacity="0.9" d="M13.5 11L18.1464 15.6464C18.3417 15.8417 18.3417 16.1583 18.1464 16.3536L13.5 21" stroke="white" stroke-linecap="round" />
            </g>
            <defs>
              <filter id="filter0_i_52_95" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_52_95" />
              </filter>
            </defs>
          </svg>

        </button>
      </div>
    </div>
  );
}
