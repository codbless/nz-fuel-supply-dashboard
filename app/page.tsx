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
  route: string;
  cargo: string;
  eta: string;
  top: string;
  left: string;
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
    route: "Singapore -> Auckland",
    cargo: "Gasoline blendstock",
    eta: "ETA 9 days",
    top: "22%",
    left: "20%",
  },
  {
    route: "South Korea -> Tauranga",
    cargo: "ULSD cargo",
    eta: "ETA 12 days",
    top: "34%",
    left: "35%",
  },
  {
    route: "Strait of Malacca -> Lyttelton",
    cargo: "Jet / diesel split cargo",
    eta: "ETA 16 days",
    top: "48%",
    left: "51%",
  },
  {
    route: "Tasman staging -> Marsden Point",
    cargo: "Coastal redistribution",
    eta: "ETA 3 days",
    top: "69%",
    left: "74%",
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
                <h2>Map placeholder for ships heading to NZ</h2>
              </div>
              <span className="section-tag">Illustrative vessel routes</span>
            </div>

            <div className="map-stage">
              <div className="map-ocean-label">Indian Ocean / Pacific shipping lanes</div>
              {tankerRoutes.map((route) => (
                <div
                  className="route-marker"
                  key={route.route}
                  style={{ top: route.top, left: route.left }}
                >
                  <span className="route-dot" />
                  <div className="route-card">
                    <strong>{route.route}</strong>
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
