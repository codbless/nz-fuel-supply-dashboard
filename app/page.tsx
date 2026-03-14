import LiveClocks from "../components/LiveClocks";

type SignalTone = "up" | "down" | "warning" | "flat";

type Market = {
  code: string;
  name: string;
  value: string;
  unit: string;
  change: string;
  status: SignalTone;
  venue: string;
  note: string;
};

type InventoryWindow = {
  label: string;
  reading: string;
  detail: string;
  status: SignalTone;
};

type PumpPrice = {
  city: string;
  regular: string;
  premium: string;
  diesel: string;
  updated: string;
};

type FlowStage = {
  step: string;
  summary: string;
  status: SignalTone;
};

type StockCover = {
  name: string;
  days: number;
  tone: "strong" | "medium" | "weak";
};

type TankerRoute = {
  vessel: string;
  short: string;
  route: string;
  destination: string;
  cargo: string;
  eta: string;
  etaBadge: string;
  days: number;
  top: string;
  left: string;
  path: string;
  tone: "amber" | "mint" | "ice" | "rose";
  align: "start" | "end";
};

type BufferMetric = {
  label: string;
  value: string;
  tag: string;
  status: SignalTone;
};

type CommunitySpread = {
  city: string;
  submissions: number;
  low: string;
  high: string;
  spread: string;
  status: SignalTone;
};

const screenSnapshot = "14 Mar 2026";

const markets: Market[] = [
  {
    code: "BRN",
    name: "Brent Crude",
    value: "82.41",
    unit: "USD/bbl",
    change: "+1.2%",
    status: "up",
    venue: "ICE",
    note: "North Sea risk premium rebuilding.",
  },
  {
    code: "WTI",
    name: "WTI Crude",
    value: "78.96",
    unit: "USD/bbl",
    change: "+0.8%",
    status: "up",
    venue: "NYMEX",
    note: "US refinery runs holding above trend.",
  },
  {
    code: "NZDUSD",
    name: "NZD / USD",
    value: "0.6082",
    unit: "spot",
    change: "-0.4%",
    status: "down",
    venue: "FX",
    note: "FX translation adds landed-cost pressure.",
  },
  {
    code: "MOGAS",
    name: "Singapore Gasoline",
    value: "96.70",
    unit: "USD/bbl",
    change: "+1.7%",
    status: "up",
    venue: "MOPS",
    note: "Prompt cracks firm on regional buying.",
  },
  {
    code: "GO10",
    name: "Singapore Gasoil",
    value: "108.35",
    unit: "USD/bbl",
    change: "+1.1%",
    status: "up",
    venue: "MOPS",
    note: "Middle distillate stocks remain tight.",
  },
];

const inventoryTrend: InventoryWindow[] = [
  {
    label: "1d",
    reading: "+0.6 sigma",
    detail: "Prompt supply tightened after refinery maintenance extensions.",
    status: "up",
  },
  {
    label: "7d",
    reading: "+1.4 sigma",
    detail: "Asian product balances continue to tighten across the week.",
    status: "up",
  },
  {
    label: "30d",
    reading: "-0.3 sigma",
    detail: "Comfort improved slightly, but cover is still below seasonal norms.",
    status: "warning",
  },
  {
    label: "90d",
    reading: "-1.1 sigma",
    detail: "Long-run resilience remains below strategic stock benchmarks.",
    status: "down",
  },
];

const flowStages: FlowStage[] = [
  {
    step: "Global markets",
    summary: "Brent and Singapore product cracks set the replacement-cost impulse.",
    status: "up",
  },
  {
    step: "Global supply",
    summary: "Refinery maintenance and tighter prompt balances keep cargo pricing firm.",
    status: "warning",
  },
  {
    step: "NZ imports",
    summary: "Softer NZD pushes imported barrels higher when translated into local terms.",
    status: "down",
  },
  {
    step: "NZ arrivals",
    summary: "Arrival timing now matters more because inbound cover is not abundant.",
    status: "warning",
  },
  {
    step: "NZ pump prices",
    summary: "Retail pass-through usually lags wholesale and shipping changes by several days.",
    status: "flat",
  },
  {
    step: "NZ storage buffer",
    summary: "A 30-day buffer leaves less room for disruption than peer strategic systems.",
    status: "warning",
  },
];

const tankerRoutes: TankerRoute[] = [
  {
    vessel: "MT Matuku",
    short: "MAT",
    route: "Singapore -> Auckland",
    destination: "Auckland",
    cargo: "Gasoline blendstock",
    eta: "Auckland arrival in 9 days",
    etaBadge: "9d",
    days: 9,
    top: "35%",
    left: "60%",
    path: "M 590 214 C 646 225, 735 287, 856 382",
    tone: "amber",
    align: "start",
  },
  {
    vessel: "MT Waitemata",
    short: "WAI",
    route: "South Korea -> Tauranga",
    destination: "Tauranga",
    cargo: "ULSD cargo",
    eta: "Tauranga arrival in 12 days",
    etaBadge: "12d",
    days: 12,
    top: "23%",
    left: "70%",
    path: "M 676 152 C 744 176, 804 248, 858 382",
    tone: "mint",
    align: "end",
  },
  {
    vessel: "MT Southern Current",
    short: "SCR",
    route: "Strait of Malacca -> Lyttelton",
    destination: "Lyttelton",
    cargo: "Jet / diesel split cargo",
    eta: "Lyttelton arrival in 16 days",
    etaBadge: "16d",
    days: 16,
    top: "49%",
    left: "57%",
    path: "M 566 232 C 626 266, 720 346, 848 406",
    tone: "ice",
    align: "start",
  },
  {
    vessel: "MT Tasman Dawn",
    short: "TSD",
    route: "Tasman staging -> Marsden Point",
    destination: "Marsden Point",
    cargo: "Coastal redistribution",
    eta: "Marsden Point arrival in 3 days",
    etaBadge: "3d",
    days: 3,
    top: "61%",
    left: "75%",
    path: "M 748 343 C 785 343, 822 352, 856 378",
    tone: "rose",
    align: "end",
  },
];

const pumpWatch: PumpPrice[] = [
  {
    city: "Auckland",
    regular: "$2.71",
    premium: "$2.94",
    diesel: "$1.98",
    updated: "11m",
  },
  {
    city: "Wellington",
    regular: "$2.76",
    premium: "$2.99",
    diesel: "$2.02",
    updated: "17m",
  },
  {
    city: "Christchurch",
    regular: "$2.69",
    premium: "$2.91",
    diesel: "$1.95",
    updated: "8m",
  },
  {
    city: "Tauranga",
    regular: "$2.73",
    premium: "$2.96",
    diesel: "$1.99",
    updated: "22m",
  },
  {
    city: "Dunedin",
    regular: "$2.74",
    premium: "$2.97",
    diesel: "$2.01",
    updated: "29m",
  },
];

const stockCover: StockCover[] = [
  { name: "Japan", days: 160, tone: "strong" },
  { name: "USA", days: 92, tone: "medium" },
  { name: "EU", days: 90, tone: "medium" },
  { name: "Australia", days: 56, tone: "weak" },
  { name: "NZ", days: 30, tone: "weak" },
];

const bufferMetrics: BufferMetric[] = [
  { label: "Storage cover", value: "30d", tag: "Amber", status: "warning" },
  { label: "Tracked inbound", value: "4", tag: "Live", status: "flat" },
  { label: "Next berth", value: "3d", tag: "Marsden", status: "up" },
  { label: "FX drag", value: "-0.4%", tag: "NZD/USD", status: "down" },
];

const communitySpread: CommunitySpread[] = [
  {
    city: "Auckland",
    submissions: 34,
    low: "$2.69",
    high: "$2.83",
    spread: "$0.14",
    status: "warning",
  },
  {
    city: "Wellington",
    submissions: 28,
    low: "$2.72",
    high: "$2.89",
    spread: "$0.17",
    status: "warning",
  },
  {
    city: "Christchurch",
    submissions: 21,
    low: "$2.66",
    high: "$2.78",
    spread: "$0.12",
    status: "flat",
  },
  {
    city: "Tauranga",
    submissions: 19,
    low: "$2.70",
    high: "$2.84",
    spread: "$0.14",
    status: "warning",
  },
  {
    city: "Dunedin",
    submissions: 12,
    low: "$2.71",
    high: "$2.86",
    spread: "$0.15",
    status: "warning",
  },
];

const maxDays = Math.max(...stockCover.map((entry) => entry.days));
const soonestTanker = tankerRoutes.reduce((soonest, tanker) =>
  tanker.days < soonest.days ? tanker : soonest,
);

function statusClass(status: SignalTone) {
  if (status === "up") return "is-up";
  if (status === "down") return "is-down";
  if (status === "warning") return "is-warning";
  return "is-neutral";
}

function statusLabel(status: SignalTone) {
  if (status === "up") return "UP";
  if (status === "down") return "DOWN";
  if (status === "warning") return "WATCH";
  return "FLAT";
}

function priceDirection(status: SignalTone) {
  if (status === "down") return "▼";
  if (status === "up") return "▲";
  if (status === "warning") return "■";
  return "•";
}

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="page-grid-overlay" />
      <section className="dashboard">
        <header className="top-strip panel">
          <div className="market-ribbon">
            <div className="ribbon-label-block">
              <span className="brand-code">LIVE MKT</span>
              <strong className="ribbon-heading">{screenSnapshot}</strong>
            </div>

            <div className="market-ribbon-track" aria-label="Global market ticker">
              {markets.map((market) => (
                <article className="ribbon-item" key={market.code}>
                  <div className="ribbon-symbol">
                    <span className="ticker-code">{market.code}</span>
                    <span className="ribbon-name">{market.name}</span>
                  </div>
                  <div className="ribbon-quote">
                    <strong className="ribbon-last">{market.value}</strong>
                    <span className="ribbon-unit">{market.unit}</span>
                  </div>
                  <span className={`ribbon-change ${statusClass(market.status)}`}>
                    <span aria-hidden="true">{priceDirection(market.status)}</span>
                    {market.change}
                  </span>
                </article>
              ))}
            </div>
          </div>

          <div className="top-console">
            <div className="screen-brand">
              <span className="brand-code">NZFSD / LIVE MONITOR</span>
              <div className="brand-copy">
                <h1>NZ Fuel Supply Dashboard</h1>
                <p>
                  Global markets {"->"} global supply {"->"} NZ imports {"->"} NZ
                  arrivals {"->"} NZ pump prices {"->"} NZ storage buffer
                </p>
              </div>
            </div>

            <LiveClocks />

            <div className="strip-meta">
              <div className="meta-row">
                <span>Snapshot</span>
                <strong>{screenSnapshot}</strong>
              </div>
              <div className="meta-row">
                <span>Mode</span>
                <strong>Live Screen</strong>
              </div>
              <div className="meta-row">
                <span>Alert</span>
                <strong className="warning-text">NZ buffer 30d</strong>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          <section className="panel span-5">
            <div className="panel-header">
              <div>
                <p className="section-code">GLOBAL MARKETS</p>
                <h2 className="panel-title">Terminal watchlist</h2>
              </div>
              <span className="market-tag is-neutral">5 symbols</span>
            </div>

            <div className="table-wrap">
              <table className="terminal-table">
                <thead>
                  <tr>
                    <th>Instrument</th>
                    <th>Last</th>
                    <th>Chg</th>
                    <th>Venue</th>
                    <th>Readthrough</th>
                  </tr>
                </thead>
                <tbody>
                  {markets.map((market) => (
                    <tr key={market.code}>
                      <td>
                        <div className="symbol-cell">
                          <strong>{market.code}</strong>
                          <span>{market.name}</span>
                        </div>
                      </td>
                      <td className="mono-value">
                        {market.value}
                        <span className="inline-unit"> {market.unit}</span>
                      </td>
                      <td>
                        <span className={`change-value ${statusClass(market.status)}`}>
                          {market.change}
                        </span>
                      </td>
                      <td className="mono-soft">{market.venue}</td>
                      <td className="table-note">{market.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel span-3">
            <div className="panel-header">
              <div>
                <p className="section-code">GLOBAL INVENTORY TREND</p>
                <h2 className="panel-title">1d / 7d / 30d / 90d</h2>
              </div>
              <span className="market-tag is-warning">Inventory bias</span>
            </div>

            <div className="inventory-grid">
              {inventoryTrend.map((item) => (
                <article className="signal-tile" key={item.label}>
                  <div className="signal-meta">
                    <span className="signal-label">{item.label}</span>
                    <span className={`market-tag ${statusClass(item.status)}`}>
                      {statusLabel(item.status)}
                    </span>
                  </div>
                  <strong className="signal-value">{item.reading}</strong>
                  <p className="signal-detail">{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel span-4">
            <div className="panel-header">
              <div>
                <p className="section-code">NZ PUMP WATCH</p>
                <h2 className="panel-title">Community fuel prices by city</h2>
              </div>
              <span className="market-tag is-neutral">Retail feed</span>
            </div>

            <div className="table-wrap">
              <table className="terminal-table">
                <thead>
                  <tr>
                    <th>City</th>
                    <th>Regular</th>
                    <th>Premium</th>
                    <th>Diesel</th>
                    <th>Upd</th>
                  </tr>
                </thead>
                <tbody>
                  {pumpWatch.map((row) => (
                    <tr key={row.city}>
                      <td>{row.city}</td>
                      <td className="mono-value">{row.regular}</td>
                      <td className="mono-value">{row.premium}</td>
                      <td className="mono-value">{row.diesel}</td>
                      <td className="mono-soft">{row.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel span-4">
            <div className="panel-header">
              <div>
                <p className="section-code">NZ IMPORT FLOW</p>
                <h2 className="panel-title">Pressure transmission chain</h2>
              </div>
              <span className="market-tag is-warning">Lag 2-5d</span>
            </div>

            <div className="flow-list">
              {flowStages.map((stage, index) => (
                <div className="flow-row" key={stage.step}>
                  <div className="flow-index">{index + 1}</div>
                  <div className="flow-copy">
                    <strong>{stage.step}</strong>
                    <p>{stage.summary}</p>
                  </div>
                  <span className={`market-tag ${statusClass(stage.status)}`}>
                    {statusLabel(stage.status)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel span-8">
            <div className="panel-header">
              <div>
                <p className="section-code">NZ TANKER WATCH</p>
                <h2 className="panel-title">World map of inbound tankers</h2>
              </div>
              <span className="market-tag is-warning">
                Soonest ETA {soonestTanker.etaBadge}
              </span>
            </div>

            <div className="tanker-layout">
              <div className="map-stage">
                <div className="map-caption">Asia-Pacific tanker approaches into NZ</div>
                <div className="map-region-label label-indian">INDIAN OCEAN</div>
                <div className="map-region-label label-pacific">PACIFIC</div>
                <div className="map-region-label label-australia">AUSTRALIA</div>
                <svg
                  className="world-map-svg"
                  viewBox="0 0 1000 520"
                  role="img"
                  aria-label="World map showing tanker routes and ETAs heading to New Zealand"
                >
                  <g>
                    <path
                      className="world-land"
                      d="M73 111l44-27 53-9 48 16 30 39 42 8 28 29-12 31-39 17-22 31-43 11-27 47-33-8-14-45-31-34-46-7-34-37 10-42 29-20-7-40 24-20z"
                    />
                    <path
                      className="world-land"
                      d="M275 301l39-19 34 16 24 47-17 61-32 61-27 14-23-30-7-46 10-46-22-27 21-31z"
                    />
                    <path
                      className="world-land"
                      d="M430 111l34-18 35 3 25 25-10 21-34 7-25-11-25 9-18-18 18-18z"
                    />
                    <path
                      className="world-land"
                      d="M428 149l27 8 36 1 35 14 52-1 35 17 40-7 36 19 42-4 77 22 48 38-15 25-40 17-47 0-21 22-39 6-30 42-46 19-38-6-33-41-25-4-34 23-24-15 0-39-22-35-38-52-17-58 7-51 34-18z"
                    />
                    <path
                      className="world-land"
                      d="M492 253l31 23 10 45 16 38-9 56-39 32-45-18-28-56-8-45 22-35 11-40 39 0z"
                    />
                    <path
                      className="world-land"
                      d="M748 347l42-7 44 13 31 31-10 26-53 3-34-15-28-25 8-26z"
                    />
                    <path
                      className="world-land"
                      d="M870 390l18 9 10 18-13 18-22-6-1-17 8-22z"
                    />
                    <path
                      className="world-land"
                      d="M896 423l9 7-4 11-12 1-2-10 9-9z"
                    />
                  </g>

                  <g>
                    {tankerRoutes.map((route) => (
                      <path
                        key={route.vessel}
                        d={route.path}
                        className={`world-route ${route.tone}`}
                        pathLength={100}
                      />
                    ))}
                  </g>

                  <g>
                    <circle className="world-target-pulse" cx="878" cy="407" r="18" />
                    <circle className="world-target-core" cx="878" cy="407" r="5" />
                    <text className="world-target-label" x="900" y="405">
                      NEW ZEALAND
                    </text>
                  </g>
                </svg>

                {tankerRoutes.map((route) => (
                  <div
                    className={`route-marker ${route.tone} ${route.align}`}
                    key={route.vessel}
                    style={{ top: route.top, left: route.left }}
                  >
                    <span className="route-dot" />
                    <div className="route-callout">
                      <div className="route-callout-head">
                        <strong>{route.vessel}</strong>
                        <span className="route-eta-badge">{route.etaBadge}</span>
                      </div>
                      <span className="route-callout-destination">
                        {route.destination} / {route.short}
                      </span>
                      <span className="route-callout-meta">{route.cargo}</span>
                      <span className="route-callout-eta">{route.eta}</span>
                    </div>
                  </div>
                ))}

                <div className="map-summary-strip">
                  <div className="map-summary-item">
                    <span>Tracked vessels</span>
                    <strong>{tankerRoutes.length}</strong>
                  </div>
                  <div className="map-summary-item">
                    <span>Closest berth</span>
                    <strong>{soonestTanker.destination}</strong>
                  </div>
                  <div className="map-summary-item">
                    <span>Nearest ETA</span>
                    <strong>{soonestTanker.etaBadge}</strong>
                  </div>
                </div>
              </div>

              <div className="table-wrap tanker-ledger">
                <table className="terminal-table">
                  <thead>
                    <tr>
                      <th>Vessel</th>
                      <th>To</th>
                      <th>Cargo</th>
                      <th>ETA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tankerRoutes.map((route) => (
                      <tr key={route.vessel}>
                        <td>
                          <div className="symbol-cell">
                            <strong>{route.vessel}</strong>
                            <span>{route.route}</span>
                          </div>
                        </td>
                        <td className="mono-soft">{route.destination}</td>
                        <td>{route.cargo}</td>
                        <td className="mono-value">{route.etaBadge}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="panel span-4">
            <div className="panel-header">
              <div>
                <p className="section-code">STRATEGIC STOCK COMPARISON</p>
                <h2 className="panel-title">Peer days of cover</h2>
              </div>
              <span className="market-tag is-warning">NZ at 30d</span>
            </div>

            <div className="table-wrap">
              <table className="terminal-table">
                <thead>
                  <tr>
                    <th>Market</th>
                    <th>Cover</th>
                    <th>Relative</th>
                  </tr>
                </thead>
                <tbody>
                  {stockCover.map((entry) => (
                    <tr key={entry.name}>
                      <td className="mono-soft">{entry.name}</td>
                      <td className="mono-value">{entry.days}d</td>
                      <td>
                        <div className="stock-bar-track" aria-hidden="true">
                          <div
                            className={`stock-bar ${entry.tone}`}
                            style={{ width: `${(entry.days / maxDays) * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel span-4">
            <div className="panel-header">
              <div>
                <p className="section-code">NZ STRATEGIC FUEL BUFFER</p>
                <h2 className="panel-title">Current estimate: ~30 days</h2>
              </div>
              <span className="market-tag is-warning">~30d est</span>
            </div>

            <div className="buffer-panel">
              <div className="buffer-hero">
                <span className="buffer-hero-label">NZ Strategic Fuel Buffer</span>
                <strong>~30 DAYS</strong>
                <p>
                  Current estimate: approximately 30 days of supply cover under
                  current operating assumptions.
                </p>
              </div>

              <div className="buffer-alert">
                <span className="buffer-alert-label">Supply stress test</span>
                <p>If tanker arrivals stopped today</p>
                <strong>NZ supply would begin declining immediately.</strong>
              </div>

              <div className="buffer-metrics">
                {bufferMetrics.map((metric) => (
                  <div className="buffer-card" key={metric.label}>
                    <div className="buffer-card-top">
                      <span className="buffer-card-label">{metric.label}</span>
                      <span className={`market-tag ${statusClass(metric.status)}`}>
                        {metric.tag}
                      </span>
                    </div>
                    <strong className="buffer-card-value">{metric.value}</strong>
                  </div>
                ))}
              </div>

              <div className="arrival-list">
                <div className="arrival-list-head">
                  <span>Next arrivals</span>
                  <span>ETA</span>
                </div>
                {tankerRoutes.slice(0, 3).map((route) => (
                  <div className="arrival-row" key={route.vessel}>
                    <span>{route.destination}</span>
                    <span>{route.etaBadge}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="panel span-4">
            <div className="panel-header">
              <div>
                <p className="section-code">COMMUNITY PRICES</p>
                <h2 className="panel-title">Crowd spread by city</h2>
              </div>
              <span className="market-tag is-neutral">User-submitted</span>
            </div>

            <div className="table-wrap">
              <table className="terminal-table">
                <thead>
                  <tr>
                    <th>City</th>
                    <th>Subs</th>
                    <th>Low</th>
                    <th>High</th>
                    <th>Spread</th>
                  </tr>
                </thead>
                <tbody>
                  {communitySpread.map((row) => (
                    <tr key={row.city}>
                      <td>{row.city}</td>
                      <td className="mono-soft">{row.submissions}</td>
                      <td className="mono-value">{row.low}</td>
                      <td className="mono-value">{row.high}</td>
                      <td>
                        <span className={`change-value ${statusClass(row.status)}`}>
                          {row.spread}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <footer className="footer-strip">
          <pre>{`-------------------------------------
Built in 10 minutes.
Just following the numbers.
NZ Fuel Supply Dashboard
-------------------------------------`}</pre>
        </footer>
      </section>
    </main>
  );
}
