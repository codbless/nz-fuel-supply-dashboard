"use client";

import Script from "next/script";
import { createElement, useState } from "react";

const widgetScriptSrc = "https://www.tradingview-widget.com/w/en/tv-ticker-tape.js";

const tickerSymbols = ["OIL_BRENT", "USOIL", "USDNZD"];

export default function TradingViewTickerTape() {
  const [hasScriptError, setHasScriptError] = useState(false);

  return (
    <div className="tradingview-ticker">
      <Script
        id="tradingview-ticker-tape"
        src={widgetScriptSrc}
        strategy="afterInteractive"
        type="module"
        onReady={() => setHasScriptError(false)}
        onError={() => setHasScriptError(true)}
      />

      {createElement(
        "tv-ticker-tape",
        {
          className: "tradingview-tape-element",
          symbols: tickerSymbols.join(","),
          theme: "dark",
          transparent: "",
          "item-size": "compact",
        },
        <div
          className={`tradingview-loading ${hasScriptError ? "is-error" : ""}`}
          aria-live="polite"
        >
          {tickerSymbols.map((symbol) => (
            <span key={symbol}>{symbol}</span>
          ))}
          <strong>
            {hasScriptError
              ? "Live market feed unavailable."
              : "Connecting live market feed..."}
          </strong>
        </div>,
      )}

      <a
        className="tradingview-attribution"
        href="https://www.tradingview.com/widget-docs/widgets/tickers/ticker-tape/"
        rel="noopener noreferrer nofollow"
        target="_blank"
      >
        Market data by TradingView
      </a>
    </div>
  );
}
