import { useMemo, useState } from 'react'
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  Filter,
  GitBranch,
  LineChart,
  Plus,
  Search,
  Sparkles,
  Target,
} from 'lucide-react'
import './App.css'

type Priority = 'A' | 'B' | 'C'

type Idea = {
  ticker: string
  name: string
  price: string
  move: string
  marketCap: string
  sector: string
  priority: Priority
  setup: string
  timeFrame: string
  conviction: number
  whyNow: string
  variantWedge: string
  pricedIn: string
  firstRejection: string
  nextEvidence: string[]
  workflow: string
}

type Catalyst = {
  date: string
  ticker: string
  event: string
  impact: 'High' | 'Medium'
  window: string
}

type SourceRow = {
  source: string
  type: string
  reliability: number
  posture: string
  notes: string
}

const ideas: Idea[] = [
  {
    ticker: 'AMD',
    name: 'Advanced Micro Devices',
    price: '$552.05',
    move: '+5.42% 1W',
    marketCap: '$900B',
    sector: 'Semiconductors',
    priority: 'A',
    setup: 'Variant wedge',
    timeFrame: '6-18m',
    conviction: 4,
    whyNow:
      'Q1 revenue grew 38% YoY and Data Center grew 57% YoY; July AI event and Q2 print can tighten 2027 AI revenue visibility.',
    variantWedge:
      'Market may still underwrite AMD as a second-source GPU vendor, while hyperscaler diversification plus EPYC share gains can make the estimate path broader.',
    pricedIn:
      'The stock is already near the high end of its range, so the bar is not low. Orders and gross margin need to keep revising up.',
    firstRejection:
      'Data Center growth fails to prove MI and EPYC order conversion, or gross margin weakens despite revenue acceleration.',
    nextEvidence: ['Advancing AI 2026', 'Q2 Data Center revenue', 'Gross margin bridge', '2027 AI revenue framing'],
    workflow: 'Earnings preview + scenario model',
  },
  {
    ticker: 'TSLA',
    name: 'Tesla',
    price: '$416.06',
    move: '+3.21% 1M',
    marketCap: '$1.32T',
    sector: 'Autos / autonomy',
    priority: 'B',
    setup: 'Event driven watch',
    timeFrame: '3-12m',
    conviction: 3,
    whyNow:
      'Q2 deliveries were strong at 480,126 vehicles and storage deployments reached 13.5 GWh, with Q2 financials due July 22.',
    variantWedge:
      'The stock only works from here if autonomy, robotaxi, energy storage, and robotics become observable profit pools rather than narrative options.',
    pricedIn:
      'The market is paying far above a traditional automaker multiple; software and robotics expectations are already heavy.',
    firstRejection:
      'Deliveries were pulled forward or price-led while auto gross margin, free cash flow, or robotaxi evidence disappoints.',
    nextEvidence: ['Auto gross margin ex credits', 'FSD paid attach rate', 'Robotaxi operating footprint', 'Energy storage margin'],
    workflow: 'Q2 earnings deep dive',
  },
  {
    ticker: 'SPCX',
    name: 'SpaceX',
    price: '$157.04',
    move: 'IPO reset',
    marketCap: '$2.07T',
    sector: 'Space / connectivity / AI',
    priority: 'B',
    setup: 'Valuation gated',
    timeFrame: '6-18m',
    conviction: 3,
    whyNow:
      'June IPO, July Nasdaq-100 inclusion, and the first public quarter create price discovery after a major re-rating.',
    variantWedge:
      'Connectivity / Starlink is already a scaled profit pool, but the public equity now also embeds an orbital AI infrastructure option.',
    pricedIn:
      'At roughly 111x 2025 revenue, a large amount of Starlink growth, reusable launch advantage, and AI optionality is already capitalized.',
    firstRejection:
      'AI segment cash burn accelerates, Starlink ARPU or net adds soften, or post-IPO lock-up supply overwhelms index-related demand.',
    nextEvidence: ['First public earnings', 'Starlink net adds and ARPU', 'AI capex discipline', 'Lock-up schedule'],
    workflow: 'Segment SOTP + IPO supply calendar',
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA',
    price: '$195.94',
    move: '+20.34% 1M',
    marketCap: '$4.74T',
    sector: 'AI infrastructure',
    priority: 'C',
    setup: 'Benchmark',
    timeFrame: '6-12m',
    conviction: 3,
    whyNow:
      'Still the benchmark for AI compute earnings power and capex risk, but less obviously a fresh dislocation in this screen.',
    variantWedge:
      'Use as the opportunity-cost and factor exposure benchmark for AMD and broader AI infrastructure ideas.',
    pricedIn:
      'Default AI winner status is already widely owned and expectations-heavy.',
    firstRejection:
      'Product timing, gross margin, hyperscaler capex, or export restrictions break the estimate path.',
    nextEvidence: ['Next rack transition', 'Networking attach', 'Export control updates', 'Customer capex commentary'],
    workflow: 'Basket benchmark / hedge work',
  },
  {
    ticker: 'AVGO',
    name: 'Broadcom',
    price: '$373.90',
    move: '+12.51% 1M',
    marketCap: '$1.78T',
    sector: 'Custom silicon',
    priority: 'B',
    setup: 'Quality compare',
    timeFrame: '6-18m',
    conviction: 3,
    whyNow:
      'Custom silicon and networking remain high-quality AI exposure with clearer cash-flow verification than many pure optionality names.',
    variantWedge:
      'Hyperscaler ASIC growth can be more durable than a simple GPU-share story.',
    pricedIn:
      'Already a consensus large-cap AI infrastructure long, so the incremental wedge is narrower than AMD.',
    firstRejection:
      'Customer concentration or ASIC growth expectations reset lower.',
    nextEvidence: ['AI semiconductor revenue', 'Customer concentration', 'Networking demand', 'Margin durability'],
    workflow: 'Relative-value compare',
  },
  {
    ticker: 'RKLB',
    name: 'Rocket Lab',
    price: '$93.09',
    move: '+26.45% 1M',
    marketCap: '$55.7B',
    sector: 'Space systems',
    priority: 'C',
    setup: 'Theme watch',
    timeFrame: '12-24m',
    conviction: 2,
    whyNow:
      'SpaceX listing can reprice public space equities, but the exposure pathway is not a direct substitute.',
    variantWedge:
      'Neutron and space systems execution could create a non-SpaceX beneficiary path.',
    pricedIn:
      'A lot of execution already sits in the market cap; price can move on theme beta before fundamentals catch up.',
    firstRejection:
      'Launch cadence, cash burn, or Neutron milestones slip.',
    nextEvidence: ['Neutron milestones', 'Backlog mix', 'Cash runway', 'Launch cadence'],
    workflow: 'Thematic watchlist',
  },
]

const catalysts: Catalyst[] = [
  { date: 'Jul 07, 2026', ticker: 'SPCX', event: 'Nasdaq-100 inclusion', impact: 'Medium', window: 'Flow catalyst' },
  { date: 'Jul 22, 2026', ticker: 'TSLA', event: 'Q2 earnings', impact: 'High', window: 'Margin proof' },
  { date: 'Jul 22-23, 2026', ticker: 'AMD', event: 'Advancing AI 2026', impact: 'High', window: 'Roadmap / customers' },
  { date: 'Late Jul / Aug', ticker: 'SPCX', event: 'First public quarter', impact: 'High', window: 'Price discovery' },
]

const sources: SourceRow[] = [
  { source: 'Company filings', type: 'Primary', reliability: 5, posture: 'Fact', notes: '10-Q, S-1, earnings releases' },
  { source: 'Company IR', type: 'Primary', reliability: 4, posture: 'Management claim', notes: 'Guides, decks, event calendars' },
  { source: 'Market data', type: 'Public', reliability: 3, posture: 'Snapshot', notes: 'Google Finance / MarketWatch' },
  { source: 'Analyst model', type: 'Missing', reliability: 1, posture: 'Gap', notes: 'No Bloomberg, FactSet, or CapIQ in this pass' },
]

const navItems = [
  { label: 'Watchlist', icon: LineChart },
  { label: 'Ideas', icon: Sparkles },
  { label: 'Research Notes', icon: FileText },
  { label: 'Catalysts', icon: CalendarDays },
  { label: 'Sources', icon: ClipboardList },
]

const priorityLabel: Record<Priority, string> = {
  A: 'A - Deep work',
  B: 'B - Watch / trigger',
  C: 'C - Screen flag',
}

function App() {
  const [selectedTicker, setSelectedTicker] = useState('AMD')
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All')
  const [query, setQuery] = useState('')
  const [activity, setActivity] = useState('Workspace ready')

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesPriority = priorityFilter === 'All' || idea.priority === priorityFilter
      const search = query.trim().toLowerCase()
      const matchesQuery =
        !search ||
        idea.ticker.toLowerCase().includes(search) ||
        idea.name.toLowerCase().includes(search) ||
        idea.sector.toLowerCase().includes(search)
      return matchesPriority && matchesQuery
    })
  }, [priorityFilter, query])

  const selectedIdea = ideas.find((idea) => idea.ticker === selectedTicker) ?? ideas[0]

  const exportSummary = () => {
    const lines = [
      'Equity Research Hub export',
      `Selected idea: ${selectedIdea.ticker}`,
      `Priority: ${priorityLabel[selectedIdea.priority]}`,
      `Variant wedge: ${selectedIdea.variantWedge}`,
      `First rejection: ${selectedIdea.firstRejection}`,
      `Next evidence: ${selectedIdea.nextEvidence.join(', ')}`,
    ]
    navigator.clipboard?.writeText(lines.join('\n'))
    setActivity(`Copied ${selectedIdea.ticker} research brief`)
  }

  const createNote = () => {
    setActivity(`Started research note for ${selectedIdea.ticker}`)
  }

  return (
    <div className="workspace">
      <aside className="sidebar" aria-label="Research navigation">
        <div className="brand">
          <div className="brand-mark">
            <LineChart size={19} />
          </div>
          <div>
            <strong>Equity Research Hub</strong>
            <span>Data. Notes. Edge.</span>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button className={item.label === 'Watchlist' ? 'nav-item active' : 'nav-item'} key={item.label}>
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-section">
          <span className="sidebar-title">Portfolios</span>
          <button>Core longs <strong>6</strong></button>
          <button>High conviction <strong>3</strong></button>
          <button>Speculative <strong>7</strong></button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-title">Tools</span>
          <button>Screener</button>
          <button>Market map</button>
          <button>Scenario lab</button>
        </div>

        <div className="user-strip">
          <div className="avatar">XR</div>
          <div>
            <strong>Xiaoran D.</strong>
            <span>Analyst</span>
          </div>
        </div>
      </aside>

      <div className="app-shell">
        <header className="topbar">
          <div className="repo-meta">
            <GitBranch size={18} />
            <div>
              <strong>equity-research-hub</strong>
              <span>main / updated today</span>
            </div>
          </div>
          <div className="deploy-card">
            <span>Vercel</span>
            <strong><CheckCircle2 size={14} /> Ready to deploy</strong>
          </div>
          <div className="actions">
            <button onClick={createNote}>
              <Plus size={17} />
              New note
            </button>
            <button onClick={exportSummary}>
              <Download size={17} />
              Export
            </button>
          </div>
        </header>

        <main className="main-grid">
          <section className="watchlist">
            <div className="section-heading">
              <div>
                <h1>Watchlist</h1>
                <p>{filteredIdeas.length} symbols / US large-cap growth and space-AI adjacencies</p>
              </div>
              <div className="search-box">
                <Search size={17} />
                <input
                  aria-label="Search symbols"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search symbols..."
                />
              </div>
            </div>

            <div className="toolbar">
              {(['All', 'A', 'B', 'C'] as const).map((priority) => (
                <button
                  className={priorityFilter === priority ? 'filter active' : 'filter'}
                  key={priority}
                  onClick={() => setPriorityFilter(priority)}
                >
                  <Filter size={14} />
                  {priority === 'All' ? 'All priorities' : priorityLabel[priority]}
                </button>
              ))}
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Move</th>
                    <th>Market Cap</th>
                    <th>Priority</th>
                    <th>Setup / View</th>
                    <th>Next Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIdeas.map((idea) => (
                    <tr
                      className={selectedIdea.ticker === idea.ticker ? 'selected' : ''}
                      key={idea.ticker}
                      onClick={() => setSelectedTicker(idea.ticker)}
                    >
                      <td><strong className="ticker">{idea.ticker}</strong></td>
                      <td>{idea.name}</td>
                      <td>{idea.price}</td>
                      <td className={idea.move.startsWith('+') ? 'positive' : ''}>{idea.move}</td>
                      <td>{idea.marketCap}</td>
                      <td><span className={`priority priority-${idea.priority}`}>{priorityLabel[idea.priority]}</span></td>
                      <td>{idea.setup}</td>
                      <td>{idea.nextEvidence[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lower-grid">
              <section className="panel">
                <div className="panel-title">
                  <CalendarDays size={18} />
                  <h2>Catalyst Calendar</h2>
                </div>
                <div className="mini-table">
                  {catalysts.map((item) => (
                    <div className="mini-row" key={`${item.date}-${item.ticker}`}>
                      <span>{item.date}</span>
                      <strong>{item.ticker}</strong>
                      <em>{item.event}</em>
                      <mark className={item.impact === 'High' ? 'risk-high' : 'risk-medium'}>{item.impact}</mark>
                      <small>{item.window}</small>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel">
                <div className="panel-title">
                  <ClipboardList size={18} />
                  <h2>Source Quality & Notes</h2>
                </div>
                <div className="source-list">
                  {sources.map((source) => (
                    <div className="source-row" key={source.source}>
                      <span>{source.source}</span>
                      <strong>{source.type}</strong>
                      <div className="dots" aria-label={`${source.reliability} out of 5 reliability`}>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <i className={index < source.reliability ? 'filled' : ''} key={index} />
                        ))}
                      </div>
                      <em>{source.posture}</em>
                      <small>{source.notes}</small>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>

          <aside className="detail-panel" aria-label={`${selectedIdea.ticker} research detail`}>
            <div className="detail-head">
              <div>
                <h2>{selectedIdea.ticker}</h2>
                <span>{selectedIdea.name}</span>
              </div>
              <strong>{selectedIdea.price}</strong>
            </div>

            <div className="metric-row">
              <span>Market Cap <strong>{selectedIdea.marketCap}</strong></span>
              <span>Sector <strong>{selectedIdea.sector}</strong></span>
            </div>

            <div className="quick-stats">
              <div>
                <span>Research Priority</span>
                <strong>{priorityLabel[selectedIdea.priority]}</strong>
              </div>
              <div>
                <span>Setup</span>
                <strong>{selectedIdea.setup}</strong>
              </div>
              <div>
                <span>Timeframe</span>
                <strong>{selectedIdea.timeFrame}</strong>
              </div>
              <div>
                <span>Conviction</span>
                <div className="dots">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <i className={index < selectedIdea.conviction ? 'filled' : ''} key={index} />
                  ))}
                </div>
              </div>
            </div>

            <section className="detail-block">
              <h3><Target size={16} /> Why now</h3>
              <p>{selectedIdea.whyNow}</p>
            </section>

            <section className="detail-block">
              <h3><Sparkles size={16} /> Variant Wedge</h3>
              <p>{selectedIdea.variantWedge}</p>
            </section>

            <section className="detail-block">
              <h3><BarChart3 size={16} /> What is priced in</h3>
              <p>{selectedIdea.pricedIn}</p>
            </section>

            <section className="detail-block danger">
              <h3>First Rejection</h3>
              <p>{selectedIdea.firstRejection}</p>
            </section>

            <section className="detail-block">
              <h3>Next Evidence</h3>
              <ul>
                {selectedIdea.nextEvidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <div className="workflow">
              <span>Next workflow</span>
              <strong>{selectedIdea.workflow}</strong>
            </div>

            <div className="activity">{activity}</div>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default App
