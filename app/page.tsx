type Market = {
  name: string;
  value: string;
  change: string;
  status: "up" | "down";
  note: string;
};

type InventoryWindow = {
  label: string;
  reading: string;
  signal: string;
  status: "up" | "down" | "flat";
};

type PumpPrice = {
  city: string;
  regular: string;
  premium: string;
  diesel: string;
  updated: string;
};

type StockCover = {
  name: string;
  days: number;
  tone: "primary" | "secondary" | "muted";
};

type TankerRoute = {
  vessel: string;
  route: string;
  cargo: string;
  eta: string;
  etaBadge: string;
  days: number;
  top: string;
  left: string;
  path: string;
  tone: "amber" | "mint" | "ice" | "rose";
};

const markets: Market[] = [
  {
    name: "Brent Crude",
    value: "US$82.41/bbl",
    change: "+1.2%",
    status: "up",
    note: "North Sea risk premium rebuilding",
  },
  {
    name: "WTI Crude",
    value: "US$78.96/bbl",
    change: "+0.8%",
    status: "up",
    note: "US refinery demand back above trend",
  },
  {
    name: "NZD/USD",
    value: "0.6082",
    change: "-0.4%",
    status: "down",
    note: "FX headwind for landed fuel costs",
  },
  {
    name: "Singapore Gasoline",
    value: "US$96.70/bbl",
    change: "+1.7%",
    status: "up",
    note: "Prompt cracks firm on regional buying",
  },
  {
    name: "Singapore Gasoil",
    value: "US$108.35/bbl",
    change: "+1.1%",
    status: "up",
    note: "Middle distillate inventories still tight",
  },
];

const inventoryTrend: InventoryWindow[] = [
  {
    label: "1d",
    reading: "+0.6 sigma",
    signal: "Prompt supply tightened after refinery maintenance extensions.",
    status: "up",
  },
  {
    label: "7d",
    reading: "+1.4 sigma",
    signal: "Regional product balances continue to tighten across Asia.",
    status: "up",
  },
  {
    label: "30d",
    reading: "-0.3 sigma",
    signal: "Inventories still below seasonal comfort despite a softer month average.",
    status: "flat",
  },
  {
    label: "90d",
    reading: "-1.1 sigma",
    signal: "Storage cover remains below long-run resilience thresholds.",
    status: "down",
  },
];

const importFlow = [
  "Global markets",
  "Global supply",
  "NZ imports",
  "NZ arrivals",
  "NZ pump prices",
  "NZ storage buffer",
];

const tankerRoutes: TankerRoute[] = [
  {
    vessel: "MT Matuku",
    route: "Singapore -> Auckland",
    cargo: "Gasoline blendstock",
    eta: "Auckland arrival in 9 days",
    etaBadge: "9d",
    days: 9,
    top: "33%",
    left: "62%",
    path: "M 590 214 C 646 225, 735 287, 856 382",
    tone: "amber",
  },
  {
    vessel: "MT Waitemata",
    route: "South Korea -> Tauranga",
    cargo: "ULSD cargo",
    eta: "Tauranga arrival in 12 days",
    etaBadge: "12d",
    days: 12,
    top: "22%",
    left: "71%",
    path: "M 676 152 C 744 176, 804 248, 858 382",
    tone: "mint",
  },
  {
    vessel: "MT Southern Current",
    route: "Strait of Malacca -> Lyttelton",
    cargo: "Jet / diesel split cargo",
    eta: "Lyttelton arrival in 16 days",
    etaBadge: "16d",
    days: 16,
    top: "48%",
    left: "58%",
    path: "M 566 232 C 626 266, 720 346, 848 406",
    tone: "ice",
  },
  {
    vessel: "MT Tasman Dawn",
    route: "Tasman staging -> Marsden Point",
    cargo: "Coastal redistribution",
    eta: "Marsden Point arrival in 3 days",
    etaBadge: "3d",
    days: 3,
    top: "60%",
    left: "76%",
    path: "M 748 343 C 785 343, 822 352, 856 378",
    tone: "rose",
  },
];

const pumpWatch: PumpPrice[] = [
  {
    city: "Auckland",
    regular: "$2.71",
    premium: "$2.94",
    diesel: "$1.98",
    updated: "11 min ago",
  },
  {
    city: "Wellington",
    regular: "$2.76",
    premium: "$2.99",
    diesel: "$2.02",
    updated: "17 min ago",
  },
  {
    city: "Christchurch",
    regular: "$2.69",
    premium: "$2.91",
    diesel: "$1.95",
    updated: "8 min ago",
  },
  {
    city: "Tauranga",
    regular: "$2.73",
    premium: "$2.96",
    diesel: "$1.99",
    updated: "22 min ago",
  },
  {
    city: "Dunedin",
    regular: "$2.74",
    premium: "$2.97",
    diesel: "$2.01",
    updated: "29 min ago",
  },
];

const stockCover: StockCover[] = [
  { name: "Japan", days: 160, tone: "primary" },
  { name: "USA", days: 92, tone: "secondary" },
  { name: "EU", days: 90, tone: "secondary" },
  { name: "Australia", days: 56, tone: "muted" },
  { name: "NZ", days: 30, tone: "muted" },
];

const maxDays = Math.max(...stockCover.map((entry) => entry.days));
const soonestTanker = tankerRoutes.reduce((soonest, tanker) =>
  tanker.days < soonest.days ? tanker : soonest,
);

function signalClass(status: "up" | "down" | "flat") {
  if (status === "up") return "positive";
  if (status === "down") return "negative";
  return "neutral";
}

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="page-ambient" />
      <section className="dashboard">
        <header className="panel hero-panel">
          <div>
            <p className="eyebrow">Bloomberg-style macro monitor / first working version</p>
            <h1>NZ Fuel Supply Dashboard</h1>
            <p className="hero-copy">
              A dark-market view of how global crude, refined products, shipping,
              and inventory pressure can cascade into New Zealand pump prices and
              storage resilience.
            </p>
          </div>

          <div className="hero-metrics">
            <div className="hero-metric">
              <span className="metric-label">Storage Buffer</span>
              <strong>~30 days</strong>
            </div>
            <div className="hero-metric">
              <span className="metric-label">Inbound Tankers</span>
              <strong>4 tracked</strong>
            </div>
            <div className="hero-metric">
              <span className="metric-label">Community Price Feed</span>
              <strong>5 cities live</strong>
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          <section className="panel span-8">
            <div className="section-header">
              <div>
                <p className="eyebrow">GLOBAL MARKETS</p>
                <h2>Cross-market pressure points</h2>
              </div>
              <span className="section-tag">Static prototype snapshot</span>
            </div>

            <div className="market-grid">
              {markets.map((market) => (
                <article className="market-card" key={market.name}>
                  <p className="market-name">{market.name}</p>
                  <div className="market-value-row">
                    <strong className="market-value">{market.value}</strong>
                    <span className={`delta ${signalClass(market.status)}`}>
                      {market.change}
                    </span>
                  </div>
                  <p className="market-note">{market.note}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel span-4">
            <div className="section-header">
              <div>
                <p className="eyebrow">GLOBAL INVENTORY TREND</p>
                <h2>1d / 7d / 30d / 90d indicators</h2>
              </div>
            </div>

            <div className="trend-grid">
              {inventoryTrend.map((item) => (
                <article className="trend-card" key={item.label}>
                  <div className="trend-topline">
                    <span className="trend-label">{item.label}</span>
                    <span className={`delta ${signalClass(item.status)}`}>
                      {item.reading}
                    </span>
                  </div>
                  <p className="trend-signal">{item.signal}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel span-7">
            <div className="section-header">
              <div>
                <p className="eyebrow">NZ IMPORT FLOW</p>
                <h2>Pressure transmission chain</h2>
              </div>
              <span className="section-tag warning">Watch landed-cost lag</span>
            </div>

            <div className="flow-wrap">
              <div className="flow-stack">
                {importFlow.map((step, index) => (
                  <div key={step}>
                    <div className="flow-step">{step}</div>
                    {index < importFlow.length - 1 ? (
                      <div className="flow-arrow" aria-hidden="true">
                        ↓
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="flow-notes">
                <div className="flow-note-card">
                  <span className="note-kicker">Current read</span>
                  <p>
                    Stronger Singapore product pricing and softer NZD are the
                    clearest near-term squeeze on imported fuel replacement cost.
                  </p>
                </div>
                <div className="flow-note-card">
                  <span className="note-kicker">Operational lens</span>
                  <p>
                    Arrival timing matters: a shipping delay can amplify margin
                    pressure before pump pricing catches up.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="panel span-5">
            <div className="section-header">
              <div>
                <p className="eyebrow">STRATEGIC STOCK COMPARISON</p>
                <h2>Days of cover</h2>
              </div>
            </div>

            <div className="stock-list">
              {stockCover.map((entry) => (
                <div className="stock-row" key={entry.name}>
                  <div className="stock-meta">
                    <span>{entry.name}</span>
                    <strong>{entry.days} days</strong>
                  </div>
                  <div className="stock-bar-track" aria-hidden="true">
                    <div
                      className={`stock-bar ${entry.tone}`}
                      style={{ width: `${(entry.days / maxDays) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel span-7">
            <div className="section-header">
              <div>
                <p className="eyebrow">NZ TANKER WATCH</p>
                <h2>World map of tankers heading to New Zealand</h2>
              </div>
              <span className="section-tag">
                Soonest ETA {soonestTanker.etaBadge} / {soonestTanker.vessel}
              </span>
            </div>

            <div className="map-stage">
              <div className="map-ocean-label">Asia-Pacific tanker approaches into NZ</div>
              <svg
                className="world-map-svg"
                viewBox="0 0 1000 520"
                role="img"
                aria-label="World map showing tanker routes and ETAs heading to New Zealand"
              >
                <g className="world-landmass">
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

                <g className="world-routes">
                  {tankerRoutes.map((route) => (
                    <path
                      key={route.route}
                      d={route.path}
                      className={`world-route ${route.tone}`}
                      pathLength={100}
                    />
                  ))}
                </g>

                <g className="world-target">
                  <circle className="world-target-pulse" cx="878" cy="407" r="22" />
                  <circle className="world-target-core" cx="878" cy="407" r="7" />
                  <text className="world-target-label" x="903" y="402">
                    NEW ZEALAND
                  </text>
                  <text className="world-target-subtitle" x="903" y="424">
                    Auckland / Tauranga / Lyttelton / Marsden Point
                  </text>
                </g>
              </svg>

              {tankerRoutes.map((route) => (
                <div
                  className={`route-marker ${route.tone}`}
                  key={route.vessel}
                  style={{ top: route.top, left: route.left }}
                >
                  <span className="route-dot" />
                  <div className="route-card">
                    <div className="route-card-header">
                      <strong>{route.vessel}</strong>
                      <span className={`eta-pill ${route.tone}`}>{route.etaBadge}</span>
                    </div>
                    <span className="route-name">{route.route}</span>
                    <span>{route.cargo}</span>
                    <span>{route.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel span-5">
            <div className="section-header">
              <div>
                <p className="eyebrow">NZ PUMP WATCH</p>
                <h2>Community fuel prices by city</h2>
              </div>
              <span className="section-tag">Regular / Premium / Diesel</span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>City</th>
                    <th>Regular</th>
                    <th>Premium</th>
                    <th>Diesel</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {pumpWatch.map((row) => (
                    <tr key={row.city}>
                      <td>{row.city}</td>
                      <td>{row.regular}</td>
                      <td>{row.premium}</td>
                      <td>{row.diesel}</td>
                      <td>{row.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <footer className="panel footer-panel">
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
