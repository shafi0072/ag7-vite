


export default function TimeSavedCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl px-5 flex items-center justify-between
      bg-[#0A0701] h-[123px] shrink-0">

      {/* Content */}
      <div className="relative z-10">
        <p className="text-gray-300 text-sm font-medium mb-1">
          Time Saved
        </p>
        <p className="text-white text-5xl font-bold tracking-tight leading-none">
          2309
        </p>
      </div>

      {/* Decorative Image — top-right corner, partially cropped */}
      <img
        src="/golden-sphere.png"
        alt="Time"
        width={130}
        height={130}
        className="absolute right-[-20px] top-[-20px] opacity-90 object-cover pointer-events-none rounded-xl"
      />

      {/* Subtle warm glow behind image */}
      <div className="absolute top-0 right-0 w-40 h-full bg-[radial-gradient(circle,rgba(200,120,30,0.15),transparent_70%)]" />
    </div>
  );
}
