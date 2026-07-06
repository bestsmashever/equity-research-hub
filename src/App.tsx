import { useEffect, useMemo, useState } from 'react'
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
  impact: '高' | '中'
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
    name: '超威半导体',
    price: '$552.05',
    move: '+5.42% 1W',
    marketCap: '$900B',
    sector: '半导体',
    priority: 'A',
    setup: '估计差',
    timeFrame: '6-18m',
    conviction: 4,
    whyNow:
      'Q1 收入同比增长 38%，数据中心同比增长 57%；7 月 AI 活动和 Q2 打印有机会把 2027 年 AI 收入可见度进一步坐实。',
    variantWedge:
      '市场可能仍把 AMD 当成“第二 GPU 供应商”来定价，但云厂商多供应商化和 EPYC 份额提升可能让估计上修路径更宽。',
    pricedIn:
      '股价已经接近区间高位，门槛不低。要继续走强，需要订单和毛利率一起继续上修。',
    firstRejection:
      '数据中心增长不能证明 MI/EPYC 订单兑现，或者收入加速但毛利率走弱。',
    nextEvidence: ['Advancing AI 2026', 'Q2 数据中心收入', '毛利率桥', '2027 AI 收入口径'],
    workflow: '财报预览 + 情景模型',
  },
  {
    ticker: 'TSLA',
    name: '特斯拉',
    price: '$416.06',
    move: '+3.21% 1M',
    marketCap: '$1.32T',
    sector: '汽车 / 自动驾驶',
    priority: 'B',
    setup: '事件驱动观察',
    timeFrame: '3-12m',
    conviction: 3,
    whyNow:
      'Q2 交付 480,126 辆，储能部署 13.5 GWh，Q2 财报在 7 月 22 日公布。',
    variantWedge:
      '这里往后能不能继续 work，关键是自动驾驶、robotaxi、储能和机器人能否从叙事期权变成可观察利润池。',
    pricedIn:
      '市场给的已经不是传统车企估值；软件、robotaxi、Optimus 和储能预期都已经很重。',
    firstRejection:
      '交付强是价格或一次性需求拉动，但汽车毛利率、自由现金流或 robotaxi 证据不够。',
    nextEvidence: ['扣除 credit 的汽车毛利率', 'FSD 付费渗透率', 'Robotaxi 运营范围', '储能毛利率'],
    workflow: 'Q2 财报深挖',
  },
  {
    ticker: 'SPCX',
    name: 'SpaceX',
    price: '$157.04',
    move: 'IPO 后定价',
    marketCap: '$2.07T',
    sector: '太空 / 连接 / AI',
    priority: 'B',
    setup: '估值门槛',
    timeFrame: '6-18m',
    conviction: 3,
    whyNow:
      '6 月 IPO、7 月纳入 Nasdaq-100、第一份公开季报，都会推动上市后的价格发现。',
    variantWedge:
      'Connectivity/Starlink 已经是规模化利润池，但上市后的股票还嵌入了轨道 AI 基建的远期期权。',
    pricedIn:
      '约 111x 2025 收入的市值口径下，Starlink 增长、可复用火箭优势和 AI 可选性已经提前资本化。',
    firstRejection:
      'AI 分部现金消耗加速、Starlink ARPU 或净增走弱，或 IPO 后锁定期供给压过指数需求。',
    nextEvidence: ['第一份公开财报', 'Starlink 净增与 ARPU', 'AI 资本开支纪律', '锁定期时间表'],
    workflow: '分部 SOTP + IPO 供给日历',
  },
  {
    ticker: 'NVDA',
    name: '英伟达',
    price: '$195.94',
    move: '+20.34% 1M',
    marketCap: '$4.74T',
    sector: 'AI 基建',
    priority: 'C',
    setup: '标尺',
    timeFrame: '6-12m',
    conviction: 3,
    whyNow:
      '仍是 AI 算力盈利能力和资本开支风险的基准，但这一轮不是最明显的新错位机会。',
    variantWedge:
      '作为 AMD 和 AI 基建组合的机会成本、估值和因子暴露标尺。',
    pricedIn:
      '默认 AI 赢家的地位已经被广泛持有，预期风险高。',
    firstRejection:
      '产品节奏、毛利率、云厂商资本开支或出口限制打断估计路径。',
    nextEvidence: ['下一代机柜切换', '网络产品 attach', '出口限制更新', '客户资本开支口径'],
    workflow: 'AI 组合标尺 / 对冲观察',
  },
  {
    ticker: 'AVGO',
    name: '博通',
    price: '$373.90',
    move: '+12.51% 1M',
    marketCap: '$1.78T',
    sector: '定制芯片',
    priority: 'B',
    setup: '质量对照',
    timeFrame: '6-18m',
    conviction: 3,
    whyNow:
      '定制芯片和网络产品仍是高质量 AI 暴露，相比纯可选性名字更容易用现金流验证。',
    variantWedge:
      'Hyperscaler ASIC 增长可能比简单的 GPU 份额故事更耐久。',
    pricedIn:
      '已经是共识大盘 AI 基建多头，新增估计差不如 AMD 明确。',
    firstRejection:
      '客户集中度或 ASIC 增长预期下修。',
    nextEvidence: ['AI 半导体收入', '客户集中度', '网络产品需求', '毛利韧性'],
    workflow: '相对估值对照',
  },
  {
    ticker: 'RKLB',
    name: '火箭实验室',
    price: '$93.09',
    move: '+26.45% 1M',
    marketCap: '$55.7B',
    sector: '太空系统',
    priority: 'C',
    setup: '主题观察',
    timeFrame: '12-24m',
    conviction: 2,
    whyNow:
      'SpaceX 上市会重新定价公开市场太空股，但 RKLB 不是直接替代品。',
    variantWedge:
      'Neutron 和太空系统业务执行如果超预期，可能形成非 SpaceX 受益路径。',
    pricedIn:
      '很多远期执行已经在市值里；股价可能先跟主题 beta 走，基本面随后才追上。',
    firstRejection:
      '发射节奏、现金消耗或 Neutron milestone 延后。',
    nextEvidence: ['Neutron 里程碑', 'Backlog 构成', '现金 runway', '发射节奏'],
    workflow: '主题观察池',
  },
]

const catalysts: Catalyst[] = [
  { date: '2026-07-07', ticker: 'SPCX', event: '纳入 Nasdaq-100', impact: '中', window: '资金流催化' },
  { date: '2026-07-22', ticker: 'TSLA', event: 'Q2 财报', impact: '高', window: '毛利验证' },
  { date: '2026-07-22/23', ticker: 'AMD', event: 'Advancing AI 2026', impact: '高', window: '路线图 / 客户' },
  { date: '7 月底 / 8 月', ticker: 'SPCX', event: '第一份公开季报', impact: '高', window: '价格发现' },
]

const sources: SourceRow[] = [
  { source: '公司披露', type: '一手', reliability: 5, posture: '事实', notes: '10-Q、S-1、财报公告' },
  { source: '公司 IR', type: '一手', reliability: 4, posture: '管理层口径', notes: '指引、deck、活动日历' },
  { source: '市场数据', type: '公开', reliability: 3, posture: '快照', notes: 'Google Finance / MarketWatch' },
  { source: '分析师模型', type: '缺失', reliability: 1, posture: '缺口', notes: '本轮未接 Bloomberg、FactSet、CapIQ' },
]

const navItems = [
  { label: '观察池', icon: LineChart },
  { label: '想法库', icon: Sparkles },
  { label: '研究笔记', icon: FileText },
  { label: '催化日历', icon: CalendarDays },
  { label: '来源', icon: ClipboardList },
]

const priorityLabel: Record<Priority, string> = {
  A: 'A - 立刻深挖',
  B: 'B - 等触发',
  C: 'C - 仅观察',
}

function ResearchHub() {
  const [selectedTicker, setSelectedTicker] = useState('AMD')
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All')
  const [query, setQuery] = useState('')
  const [activity, setActivity] = useState('研究台已就绪')

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

  useEffect(() => {
    if (filteredIdeas.length > 0 && !filteredIdeas.some((idea) => idea.ticker === selectedTicker)) {
      setSelectedTicker(filteredIdeas[0].ticker)
    }
  }, [filteredIdeas, selectedTicker])

  const selectedIdea = ideas.find((idea) => idea.ticker === selectedTicker) ?? ideas[0]

  const exportSummary = () => {
    const lines = [
      '股票研究台导出',
      `当前股票：${selectedIdea.ticker}`,
      `优先级：${priorityLabel[selectedIdea.priority]}`,
      `估计差：${selectedIdea.variantWedge}`,
      `第一否决：${selectedIdea.firstRejection}`,
      `下一步证据：${selectedIdea.nextEvidence.join('、')}`,
    ]
    navigator.clipboard?.writeText(lines.join('\n'))
    setActivity(`已复制 ${selectedIdea.ticker} 研究摘要`)
  }

  const createNote = () => {
    setActivity(`已开始 ${selectedIdea.ticker} 研究笔记`)
  }

  return (
    <div className="workspace">
      <aside className="sidebar" aria-label="研究导航">
        <div className="brand">
          <div className="brand-mark">
            <LineChart size={19} />
          </div>
          <div>
            <strong>股票研究台</strong>
            <span>数据、笔记、估计差。</span>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button className={item.label === '观察池' ? 'nav-item active' : 'nav-item'} key={item.label}>
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-section">
          <span className="sidebar-title">组合</span>
          <button>核心多头 <strong>6</strong></button>
          <button>高信心 <strong>3</strong></button>
          <button>投机观察 <strong>7</strong></button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-title">工具</span>
          <button>筛选器</button>
          <button>市场地图</button>
          <button>情景实验室</button>
        </div>

        <div className="user-strip">
          <div className="avatar">XR</div>
          <div>
            <strong>Xiaoran D.</strong>
            <span>研究</span>
          </div>
        </div>
      </aside>

      <div className="app-shell">
        <header className="topbar">
          <div className="repo-meta">
            <GitBranch size={18} />
            <div>
              <strong>股票研究台</strong>
              <span>main / 今日更新</span>
            </div>
          </div>
          <div className="deploy-card">
            <span>Vercel</span>
            <strong><CheckCircle2 size={14} /> 已部署</strong>
          </div>
          <div className="actions">
            <button onClick={createNote}>
              <Plus size={17} />
              新笔记
            </button>
            <button onClick={exportSummary}>
              <Download size={17} />
              导出
            </button>
          </div>
        </header>

        <main className="main-grid">
          <section className="watchlist">
            <div className="section-heading">
              <div>
                <h1>观察池</h1>
                <p>{filteredIdeas.length} 个标的 / 美股大盘成长、太空与 AI 相关机会</p>
              </div>
              <div className="search-box">
                <Search size={17} />
                <input
                  aria-label="搜索股票"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索股票、公司、板块..."
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
                  {priority === 'All' ? '全部优先级' : priorityLabel[priority]}
                </button>
              ))}
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>代码</th>
                    <th>名称</th>
                    <th>价格</th>
                    <th>近期表现</th>
                    <th>市值</th>
                    <th>优先级</th>
                    <th>判断</th>
                    <th>下一步证据</th>
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
                  <h2>催化日历</h2>
                </div>
                <div className="mini-table">
                  {catalysts.map((item) => (
                    <div className="mini-row" key={`${item.date}-${item.ticker}`}>
                      <span>{item.date}</span>
                      <strong>{item.ticker}</strong>
                      <em>{item.event}</em>
                      <mark className={item.impact === '高' ? 'risk-high' : 'risk-medium'}>{item.impact}</mark>
                      <small>{item.window}</small>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel">
                <div className="panel-title">
                  <ClipboardList size={18} />
                  <h2>来源质量与笔记</h2>
                </div>
                <div className="source-list">
                  {sources.map((source) => (
                    <div className="source-row" key={source.source}>
                      <span>{source.source}</span>
                      <strong>{source.type}</strong>
                      <div className="dots" aria-label={`来源可靠度 ${source.reliability}/5`}>
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

          <aside className="detail-panel" aria-label={`${selectedIdea.ticker} 研究详情`}>
            <div className="detail-head">
              <div>
                <h2>{selectedIdea.ticker}</h2>
                <span>{selectedIdea.name}</span>
              </div>
              <strong>{selectedIdea.price}</strong>
            </div>

            <div className="metric-row">
              <span>市值 <strong>{selectedIdea.marketCap}</strong></span>
              <span>板块 <strong>{selectedIdea.sector}</strong></span>
            </div>

            <div className="quick-stats">
              <div>
                <span>研究优先级</span>
                <strong>{priorityLabel[selectedIdea.priority]}</strong>
              </div>
              <div>
                <span>判断</span>
                <strong>{selectedIdea.setup}</strong>
              </div>
              <div>
                <span>周期</span>
                <strong>{selectedIdea.timeFrame}</strong>
              </div>
              <div>
                <span>信心</span>
                <div className="dots">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <i className={index < selectedIdea.conviction ? 'filled' : ''} key={index} />
                  ))}
                </div>
              </div>
            </div>

            <section className="detail-block">
              <h3><Target size={16} /> 为什么现在</h3>
              <p>{selectedIdea.whyNow}</p>
            </section>

            <section className="detail-block">
              <h3><Sparkles size={16} /> 估计差</h3>
              <p>{selectedIdea.variantWedge}</p>
            </section>

            <section className="detail-block">
              <h3><BarChart3 size={16} /> 已经计价了什么</h3>
              <p>{selectedIdea.pricedIn}</p>
            </section>

            <section className="detail-block danger">
              <h3>第一否决条件</h3>
              <p>{selectedIdea.firstRejection}</p>
            </section>

            <section className="detail-block">
              <h3>下一步证据</h3>
              <ul>
                {selectedIdea.nextEvidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <div className="workflow">
              <span>下一步工作流</span>
              <strong>{selectedIdea.workflow}</strong>
            </div>

            <div className="activity">{activity}</div>
          </aside>
        </main>
      </div>
    </div>
  )
}

function App() {
  const isHubRoute = window.location.pathname === '/hub'

  useEffect(() => {
    if (!isHubRoute) {
      window.location.replace('/equity_idea_triage_2026-07-06.html')
    }
  }, [isHubRoute])

  if (isHubRoute) {
    return <ResearchHub />
  }

  return (
    <div className="report-redirect">
      <a href="/equity_idea_triage_2026-07-06.html">打开股票机会初筛报告</a>
    </div>
  )
}

export default App
