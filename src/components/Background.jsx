// Fixed decorative backdrop: faint grid and three slow-drifting grey glows.
export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-linear-to-b from-charcoal via-ink to-ink" />
      <div className="bg-grid absolute inset-0" />
      <div className="animate-drift-a absolute -left-[20%] -top-[25%] h-[44rem] w-[44rem] rounded-full bg-white/[0.07] blur-[140px]" />
      <div className="animate-drift-b absolute -right-[25%] top-[25%] h-[38rem] w-[38rem] rounded-full bg-steel/40 blur-[140px]" />
      <div className="animate-drift-a absolute -bottom-[30%] left-[15%] h-[34rem] w-[34rem] rounded-full bg-white/[0.035] blur-[140px]" />
    </div>
  );
}
