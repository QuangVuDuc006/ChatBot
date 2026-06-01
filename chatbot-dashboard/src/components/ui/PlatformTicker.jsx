import React from "react";

const defaultItems = ["GPT-5", "Claude", "Gemini", "DeepSeek", "File Analysis", "Research Workspace", "Multi-Model AI"];

export function PlatformTicker({ items = defaultItems, className = "" }) {
  const tickerItems = [...items, ...items];

  return (
    <div className={`platform-ticker relative w-full overflow-hidden ${className}`} aria-label="Platform capabilities">
      <div className="platform-ticker-track flex w-max items-center gap-3">
        {tickerItems.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="rounded-[7px] border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-semibold text-mist-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
