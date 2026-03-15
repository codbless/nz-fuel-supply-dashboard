"use client";

import { useEffect, useRef, useState } from "react";

const widgetScriptSrc =
  "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";

const tickerConfig = {
  symbols: [
    {
      description: "OIL_BRENT",
      proName: "TVC:UKOIL",
    },
    {
      description: "USOIL",
      proName: "TVC:USOIL",
    },
    {
      description: "USDNZD",
      proName: "FX_IDC:USDNZD",
    },
  ],
  showSymbolLogo: false,
  colorTheme: "dark",
  isTransparent: true,
  displayMode: "compact",
  locale: "en",
};

export default function TradingViewTickerTape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    setIsReady(false);
    container.innerHTML = "";

    const widgetRoot = document.createElement("div");
    widgetRoot.className = "tradingview-widget-container__widget";
    container.appendChild(widgetRoot);

    const script = document.createElement("script");
    script.src = widgetScriptSrc;
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify(tickerConfig);
    script.onload = () => setIsReady(true);
    script.onerror = () => setIsReady(false);
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="tradingview-ticker">
      <div
        className={`tradingview-loading ${isReady ? "is-hidden" : ""}`}
        aria-hidden={isReady}
      >
        <span>OIL_BRENT</span>
        <span>USOIL</span>
        <span>USDNZD</span>
        <strong>Connecting live market feed...</strong>
      </div>

      <div ref={containerRef} className="tradingview-widget-container" />

      <a
        className="tradingview-attribution"
        href="https://www.tradingview.com/markets/?utm_source=nz-fuel-supply-dashboard&utm_medium=widget&utm_campaign=ticker_tape"
        rel="noopener noreferrer nofollow"
        target="_blank"
      >
        Market data by TradingView
      </a>
    </div>
  );
}
