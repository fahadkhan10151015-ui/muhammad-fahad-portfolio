/**
 * Coded mini-preview of each project (drawn with HTML/CSS, no screenshots).
 * If a project has `image`, that screenshot is shown instead.
 */
function Lines({ n = 3, w = ["90%", "75%", "55%"] }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="h-[3px] rounded-full bg-white/15" style={{ width: w[i % w.length] }} />
      ))}
    </div>
  );
}

function Visual({ id }) {
  switch (id) {
    case "perfume-point":
      return (
        <div className="relative flex h-full items-end justify-center gap-2 pb-2">
          {[44, 62, 50].map((h, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-2.5 w-3 rounded-t-sm bg-gradient-to-b from-gold-2 to-gold-3" />
              <div
                className="w-9 rounded-md border border-gold/40 bg-gradient-to-b from-[#3a2a10] via-[#1b140a] to-black shadow-[0_0_18px_rgba(230,176,74,0.25)]"
                style={{ height: h }}
              >
                <div className="mx-auto mt-3 h-1 w-5 rounded bg-gold/70" />
              </div>
            </div>
          ))}
          <div className="absolute bottom-0 h-6 w-32 rounded-[50%] bg-gold/20 blur-md" />
        </div>
      );
    case "bikaflora":
      return (
        <div className="relative h-full">
          {[
            [18, 22, 30],
            [46, 10, 38],
            [70, 30, 26],
            [36, 46, 24],
            [62, 58, 20],
          ].map(([l, t, s], i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${l}%`,
                top: `${t}%`,
                width: s,
                height: s,
                background: `radial-gradient(circle at 50% 50%, #ffe39a 0 18%, ${i % 2 ? "#e6b04a" : "#ff9a3c"} 20% 62%, transparent 64%)`,
                boxShadow: "0 0 16px rgba(255,170,70,0.35)",
              }}
            />
          ))}
          <div className="absolute bottom-1 right-2 flex items-center gap-1 rounded-full bg-[#1f3a22] px-2 py-0.5 text-[6px] text-white/90">
            ● WhatsApp
          </div>
        </div>
      );
    case "medibill-pro":
      return (
        <div className="flex h-full gap-1.5">
          <div className="w-6 space-y-1.5 rounded bg-white/5 p-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-1.5 rounded ${i === 1 ? "bg-gold" : "bg-white/15"}`} />
            ))}
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="grid grid-cols-3 gap-1">
              {["Sales", "Stock", "Expiry"].map((t) => (
                <div key={t} className="rounded border border-white/10 bg-white/[0.03] p-1">
                  <div className="text-[5px] text-white/50">{t}</div>
                  <div className="mt-0.5 h-1.5 w-6 rounded bg-gold/70" />
                </div>
              ))}
            </div>
            <div className="flex h-12 items-end gap-[3px] rounded border border-white/10 bg-white/[0.02] p-1">
              {[40, 65, 35, 80, 55, 90, 60, 75].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-gold-3 to-gold-2" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      );
    case "allied-spare-solutions":
      return (
        <div className="grid h-full grid-cols-3 gap-1.5">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center justify-center rounded border border-white/10 bg-white/[0.03]">
              <div
                className="h-5 w-5 rounded-full border-2 border-dashed"
                style={{ borderColor: i % 2 ? "rgba(230,176,74,0.7)" : "rgba(255,255,255,0.35)" }}
              />
            </div>
          ))}
        </div>
      );
    case "course-evaluation":
      return (
        <div className="flex h-full items-center justify-center">
          <div className="h-[92%] w-16 rounded-[10px] border border-white/25 bg-black p-1.5">
            <div className="mx-auto mb-1.5 h-1 w-5 rounded-full bg-white/20" />
            <div className="text-[5px] text-white/60">Data Structures</div>
            <div className="mt-1 text-[8px] tracking-[1px] text-gold">★★★★☆</div>
            <div className="mt-1.5 space-y-1">
              <div className="h-1 rounded bg-white/15" />
              <div className="h-1 w-3/4 rounded bg-white/15" />
            </div>
            <div className="mt-2 h-2.5 rounded bg-gold" />
          </div>
        </div>
      );
    case "complaint-management":
      return (
        <div className="space-y-1 rounded border border-white/10 bg-white/[0.02] p-1.5">
          {["Open", "Assigned", "Resolved", "Open"].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
              <div className="h-1 flex-1 rounded bg-white/15" />
              <span className={`rounded px-1 text-[5px] ${s === "Resolved" ? "bg-gold/80 text-black" : "bg-white/10 text-white/70"}`}>{s}</span>
            </div>
          ))}
        </div>
      );
    default:
      return (
        <div className="space-y-1.5 rounded border border-white/10 bg-white/[0.03] p-2">
          {["Student", "Course", "Section"].map((f) => (
            <div key={f}>
              <div className="text-[5px] text-white/50">{f}</div>
              <div className="h-2 rounded border border-white/15 bg-black/40" />
            </div>
          ))}
          <div className="mt-1 h-2 w-10 rounded bg-gold" />
        </div>
      );
  }
}

export default function ProjectPreview({ project }) {
  if (project.image) {
    return <img src={project.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />;
  }
  const { headline, accent } = project.preview;
  return (
    <div aria-hidden className="relative h-full w-full overflow-hidden bg-[radial-gradient(120%_90%_at_80%_20%,#1e1708_0%,#0b0b0e_55%)] p-3.5">
      {/* browser bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full border border-gold/70" />
          <span className="text-[7px] font-semibold tracking-wide text-white/85">{project.title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[3px] w-3 rounded-full bg-white/20" />
          ))}
          <span className="ml-1 rounded-sm border border-white/20 px-1 text-[5px] text-white/70">Contact</span>
        </div>
      </div>
      <div className="mt-3 grid h-[calc(100%-1.75rem)] grid-cols-[1.05fr_1fr] gap-3">
        <div className="flex flex-col justify-center">
          <div className="font-display text-[12.5px] font-semibold leading-[1.12] text-white">
            {headline.map((l, i) => (
              <span key={l} className={`block ${i === accent ? "text-gold" : ""}`}>
                {l}
              </span>
            ))}
          </div>
          <div className="mt-2">
            <Lines />
          </div>
          <div className="mt-2.5 flex gap-1.5">
            <span className="h-3 w-10 rounded-sm bg-gold" />
            <span className="h-3 w-8 rounded-sm border border-white/25" />
          </div>
        </div>
        <Visual id={project.id} />
      </div>
    </div>
  );
}
