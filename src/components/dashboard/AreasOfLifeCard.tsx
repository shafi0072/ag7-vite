


const areas = [
  { name: "Dev", dotLeft: false, dotRight: true },
  { name: "Fitness", dotLeft: true, dotRight: false },
  { name: "Life balance", dotLeft: false, dotRight: false },
];

export default function AreasOfLifeCard() {
  return (
    <div
      className="rounded-[2rem] h-full relative overflow-hidden"
      style={{
        background:
          "linear-gradient(145deg, #e8622b 0%, #d14f24 25%, #b84220 50%, #8c3219 75%, #5c1f0e 100%)",
        boxShadow: "0 0 0 1px #1a1a1a, 0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Profile image — full card, anchored left */}
      <div className="absolute inset-0">
        <img
          src="/profile-side.png"
          alt="Profile"
          className="absolute inset-0 w-full h-full object-cover object-[15%_top] grayscale brightness-[0.3] contrast-[1.1]"
          style={{ opacity: 0.85, mixBlendMode: "luminosity" }}
        />
      </div>

      {/* Left-edge darkening vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(255, 255, 255, 0.1) 10%, transparent 45%)",
        }}
      />

      {/* ── Floating glass overlay panel — gap from top, bottom, right ── */}
      <div
        className="absolute flex flex-col justify-between rounded-[1.5rem]"
        style={{
          top: "14px",
          bottom: "14px",
          right: "14px",
          left: "30%",
          background: "linear-gradient(to right, #FFFFFF1A 10%, transparent 45%)",
          backdropFilter: "blur(68%)",
          WebkitBackdropFilter: "blur(68%)", // for Safari support
          padding: "1.25rem 1.1rem 1.25rem 1.1rem",
        }}
      >
        {/* Title */}
        <div className="text-right pr-1">
          <h3 className="leading-tight" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)" }}>
            <span className="font-bold text-white tracking-tight">Areas</span>{" "}
            <span
              className="font-light tracking-wide"
              style={{ color: "rgba(255,255,255,0.58)" }}
            >
              of life
            </span>
          </h3>
        </div>

        {/* Area rows */}
        <div className="flex flex-col gap-[0.85rem]">
          {areas.map((area) => (
            <div key={area.name} className="flex items-center w-full">
              {/* Left segment */}
              <div className="flex items-center flex-1 min-w-0">
                {area.dotLeft ? (
                  <>
                    <div
                      className="h-px flex-1"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(255,255,255,0.0), rgba(255,255,255,0.32))",
                      }}
                    />
                    <div
                      className="flex-shrink-0 w-[7px] h-[7px] rounded-full mx-[2px]"
                      style={{
                        background: "rgba(255,255,255,0.78)",
                        boxShadow: "0 0 6px rgba(255,255,255,0.45)",
                      }}
                    />
                  </>
                ) : (
                  <div
                    className="h-px flex-1"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(255,255,255,0.0), rgba(255,255,255,0.32))",
                    }}
                  />
                )}
              </div>

              {/* Pill */}
              <button
                className="flex-shrink-0 text-white font-medium rounded-full border"
                style={{
                  fontSize: "0.8rem",
                  letterSpacing: "0.025em",
                  padding: "0.42rem 1.4rem",
                  minWidth: "112px",
                  background: "rgba(255,255,255,0.09)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderColor: "rgba(255,255,255,0.28)",
                  boxShadow:
                    "0 1px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.11)",
                }}
              >
                {area.name}
              </button>

              {/* Right segment */}
              <div className="flex items-center flex-1 min-w-0">
                {area.dotRight ? (
                  <>
                    <div
                      className="flex-shrink-0 w-[7px] h-[7px] rounded-full mx-[2px]"
                      style={{
                        background: "rgba(255,255,255,0.78)",
                        boxShadow: "0 0 6px rgba(255,255,255,0.45)",
                      }}
                    />
                    <div
                      className="h-px flex-1"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(255,255,255,0.32), rgba(255,255,255,0.0))",
                      }}
                    />
                  </>
                ) : (
                  <div
                    className="h-px flex-1"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(255,255,255,0.32), rgba(255,255,255,0.0))",
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
