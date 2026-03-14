"use client";

import { useEffect, useState } from "react";

const clocks = [
  { label: "UTC", timeZone: "UTC" },
  { label: "Singapore", timeZone: "Asia/Singapore" },
  { label: "New York", timeZone: "America/New_York" },
  { label: "Auckland", timeZone: "Pacific/Auckland" },
] as const;

const formatters = clocks.map((clock) => ({
  ...clock,
  formatter: new Intl.DateTimeFormat("en-NZ", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: clock.timeZone,
  }),
}));

export default function LiveClocks() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const timestamp = new Date(now);

  return (
    <section className="live-clocks" aria-label="Live clocks">
      <div className="live-clocks-header">
        <span className="brand-code">CLOCKS</span>
        <span className="clock-live">
          <span className="clock-live-dot" aria-hidden="true" />
          LIVE
        </span>
      </div>

      <div className="live-clocks-grid">
        {formatters.map((clock) => (
          <div className="live-clock-item" key={clock.label}>
            <span className="live-clock-city">{clock.label}</span>
            <strong className="live-clock-time">
              {clock.formatter.format(timestamp)}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}
