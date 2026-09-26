// Fixed decorative backdrop: faint grid and three slow-drifting grey glows.
// The glows are radial gradients (not blurred elements) so they are cheap to paint.
export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-linear-to-b from-charcoal via-ink to-ink" />
      <div className="bg-grid absolute inset-0" />
      <div
        className="glow animate-drift-a absolute h-[62rem] w-[62rem] [--glow-color:rgb(255_255_255/0.07)]"
        style={{ left: "calc(-20% - 9rem)", top: "calc(-25% - 9rem)" }}
      />
      <div
        className="glow animate-drift-b absolute h-[54rem] w-[54rem] [--glow-color:rgb(45_49_56/0.4)]"
        style={{ right: "calc(-25% - 8rem)", top: "calc(25% - 8rem)" }}
      />
      <div
        className="glow animate-drift-a absolute h-[48rem] w-[48rem] [--glow-color:rgb(255_255_255/0.035)]"
        style={{ bottom: "calc(-30% - 7rem)", left: "calc(15% - 7rem)" }}
      />
    </div>
  );
}