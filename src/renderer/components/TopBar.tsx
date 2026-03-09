export default function TopBar() {
  return (
    <div
      className="w-full h-10 bg-[#57463D]"
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}>
      <div className="flex items-center ml-[16px] h-full">
        <span className="text-2xl font-kodchasanMed font-weight-[400] text-[#EEDFD1]">
          Nomadsync
        </span>
      </div>
    </div>
  );
}
