import { useEffect, useState } from "react";
import { FlaskConical } from "lucide-react";
import { api, IS_DEMO } from "@/lib/api";

/** Visible marker that integrations are simulated, so demo data is never mistaken for live. */
export default function DemoBadge() {
  const [demo, setDemo] = useState(IS_DEMO);
  useEffect(() => {
    api.health().then((h) => setDemo(!!h.demo)).catch(() => {});
  }, []);
  if (!demo) return null;
  return (
    <div
      className="fixed bottom-4 right-4 z-[60] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-[11px] backdrop-blur"
      title="Database, Docker, LLM and Telegram are simulated locally"
    >
      <FlaskConical size={12} /> Demo mode · integrations simulated
    </div>
  );
}
