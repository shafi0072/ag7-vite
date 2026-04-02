

import { useTranslation } from "react-i18next";

export default function TasksDoneCard() {
  const { t } = useTranslation();
  const done = 350;
  const total = 365;

  const r = 80;
  const circumference = 2 * Math.PI * r; // ≈ 502.65

  // 270° arc, gap centered at bottom
  const arcAngle = 270;
  const arcLength = (arcAngle / 360) * circumference; // ≈ 376.99

  // Progress fill length
  const progressLength = (done / total) * arcLength; // ≈ 361.5

  return (
    <div
      className="rounded-2xl p-4 flex flex-col items-center relative overflow-hidden h-full"
      style={{
        background:
          "radial-gradient(ellipse at 50% 10%, #3a1f0a 0%, #1a0c04 40%, #0f0703 100%)",
        border: "1px solid #2a1500",
      }}
    >
      {/* Title */}
      <p className="text-white text-sm font-bold mb-2">{t("dashboard.tasksDone.title")}</p>

      {/* Gauge */}
      <div className="relative w-[120px] h-[120px] mb-2">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          style={{ transform: "rotate(135deg)" }}
        >
          {/* Track arc */}
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="#3a1f08"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
          />
          {/* Progress arc */}
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="#F5C200"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${progressLength} ${circumference}`}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white text-2xl font-bold leading-none">{done}</span>
          <span className="text-gray-400 text-[10px] mt-0.5">{t("dashboard.tasksDone.outOf")} {total}</span>
          <p className="text-white text-xs font-semibold mt-0.5">{t("dashboard.tasksDone.excellent")}</p>
        </div>
      </div>

      {/* Details button */}
      <button
        className="w-[223px] py-2 rounded-xl text-sm font-bold mt-auto"
        style={{
          background: "linear-gradient(135deg, #FF6B1A, #E8520A)",
          color: "#1a0800",
        }}
      >
        {t("dashboard.tasksDone.details")}
      </button>
    </div>
  );
}
