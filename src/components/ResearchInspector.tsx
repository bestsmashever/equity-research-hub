import { useState } from 'react'
import {
  CalendarClock,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Copy,
  ExternalLink,
  FilePlus2,
  Gauge,
  Landmark,
  MoreHorizontal,
  ShieldAlert,
  Star,
  UsersRound,
} from 'lucide-react'
import { proofStageLabels, researchDepthLabels, riskLabels } from '../data/research'
import type { CompanyResearch, DetailTab } from '../types/research'

type ResearchInspectorProps = {
  company: CompanyResearch
  activeTab: DetailTab
  bookmarked: boolean
  onTabChange: (tab: DetailTab) => void
  onToggleBookmark: () => void
  onOpenNote: () => void
}

const tabs: Array<{ id: DetailTab; label: string }> = [
  { id: 'evidence', label: '证据与论点' },
  { id: 'financials', label: '财务概览' },
  { id: 'valuation', label: '估值与预期' },
  { id: 'competition', label: '竞争格局' },
  { id: 'risks', label: '风险' },
]

const postureLabels = {
  verified: '事实',
  management: '管理层口径',
  derived: '研究推断',
  gap: '研究缺口',
} as const

function SourceList({ company }: { company: CompanyResearch }) {
  return (
    <section className="inspector-section source-section" id="source-list">
      <div className="inspector-section-heading compact">
        <div>
          <h3>证据来源 <span>（可点击查看）</span></h3>
        </div>
      </div>
      <div className="source-links">
        {company.sources.map((source, index) => (
          <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>
            <span>{index + 1}</span>
            <div>
              <strong>{source.title}</strong>
              <small>{source.publisher} · 核于 2026-07-14</small>
            </div>
            <ExternalLink size={14} />
          </a>
        ))}
      </div>
    </section>
  )
}

function EvidenceTab({ company }: { company: CompanyResearch }) {
  const sourceById = Object.fromEntries(company.sources.map((source) => [source.id, source]))

  return (
    <>
      <section className="inspector-section evidence-section">
        <div className="inspector-section-heading">
          <CheckCircle2 size={18} className="semantic-icon success" />
          <div>
            <h3>核心论点</h3>
            <strong className="success-text">{company.aiCategory} / {researchDepthLabels[company.researchDepth]}</strong>
          </div>
        </div>
        <p className="thesis-summary">{company.oneLineThesis}</p>
        <ul className="claim-list">
          {company.evidence.map((claim) => (
            <li key={claim.id}>
              <div>
                <span className={`posture posture-${claim.posture}`}>{postureLabels[claim.posture]}</span>
                {claim.text}
              </div>
              <div className="claim-sources">
                {claim.sourceIds.map((sourceId) => sourceById[sourceId] ? (
                  <a href={sourceById[sourceId].url} target="_blank" rel="noreferrer" key={sourceId}>
                    {sourceById[sourceId].publisher}
                  </a>
                ) : null)}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="inspector-section">
        <div className="inspector-section-heading inline">
          <Gauge size={18} className="semantic-icon warning" />
          <h3>预期 / 估值风险</h3>
          <span className={`risk-badge risk-${company.riskLevel}`}>{riskLabels[company.riskLevel]}</span>
        </div>
        <p>{company.valuationSummary}</p>
      </section>

      <section className="inspector-section">
        <div className="inspector-section-heading inline">
          <ShieldAlert size={18} className="semantic-icon danger" />
          <h3>第一否决 / 证伪条件</h3>
        </div>
        <p>{company.falsifier}</p>
      </section>

      <section className="inspector-section">
        <div className="inspector-section-heading inline">
          <CalendarClock size={18} className="semantic-icon primary" />
          <h3>下一步催化剂</h3>
          <span className="date-badge">{company.nextCatalyst.displayDate}</span>
        </div>
        <strong className="catalyst-name">{company.nextCatalyst.event}</strong>
        <p>{company.nextCatalyst.watch}</p>
      </section>

      <section className="inspector-section metrics-section">
        <div className="inspector-section-heading compact"><h3>关键数据</h3></div>
        <div className="metric-list">
          {company.financialMetrics.map((metric) => (
            <div key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              {metric.context ? <small>{metric.context}</small> : null}
            </div>
          ))}
        </div>
      </section>

      <SourceList company={company} />
    </>
  )
}

function FinancialsTab({ company }: { company: CompanyResearch }) {
  return (
    <>
      <section className="inspector-section tab-lead">
        <div className="inspector-section-heading">
          <CircleDollarSign size={18} className="semantic-icon primary" />
          <div><h3>财务验证</h3><strong>{company.sector}</strong></div>
        </div>
        <p>{company.financialSummary}</p>
      </section>
      <section className="inspector-section metrics-section">
        <div className="metric-list large">
          {company.financialMetrics.map((metric) => (
            <div key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              {metric.context ? <small>{metric.context}</small> : null}
            </div>
          ))}
        </div>
      </section>
      <SourceList company={company} />
    </>
  )
}

function ValuationTab({ company }: { company: CompanyResearch }) {
  return (
    <>
      <section className="inspector-section tab-lead">
        <div className="inspector-section-heading">
          <Landmark size={18} className="semantic-icon warning" />
          <div><h3>估值与市场预期</h3><strong>{company.marketCap}</strong></div>
        </div>
        <p>{company.valuationSummary}</p>
        {company.marketCapNote ? <small className="method-note">{company.marketCapNote}</small> : null}
      </section>
      <section className="inspector-section">
        <div className="inspector-section-heading compact"><h3>股价需要什么成立</h3></div>
        <ol className="numbered-list">
          {company.expectations.map((item) => <li key={item}>{item}</li>)}
        </ol>
      </section>
      <section className="inspector-section inference-note">
        <strong>研究口径</strong>
        <p>估值段落属于研究推断；价格、P/E 与市值为 2026-07-14 市场快照，不是公司披露数据。</p>
      </section>
      <SourceList company={company} />
    </>
  )
}

function CompetitionTab({ company }: { company: CompanyResearch }) {
  return (
    <>
      <section className="inspector-section tab-lead">
        <div className="inspector-section-heading">
          <UsersRound size={18} className="semantic-icon primary" />
          <div><h3>竞争格局</h3><strong>{company.aiCategory}</strong></div>
        </div>
        <ul className="bullet-list">{company.competition.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <SourceList company={company} />
    </>
  )
}

function RisksTab({ company }: { company: CompanyResearch }) {
  return (
    <>
      <section className="inspector-section tab-lead risk-tab">
        <div className="inspector-section-heading">
          <ShieldAlert size={18} className="semantic-icon danger" />
          <div><h3>风险与否决条件</h3><strong>{riskLabels[company.riskLevel]}预期风险</strong></div>
        </div>
        <div className="falsifier-callout">
          <span>第一否决条件</span>
          <p>{company.falsifier}</p>
        </div>
        <ul className="bullet-list">{company.risks.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <SourceList company={company} />
    </>
  )
}

export function ResearchInspector({
  company,
  activeTab,
  bookmarked,
  onTabChange,
  onToggleBookmark,
  onOpenNote,
}: ResearchInspectorProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const positive = company.dailyChange >= 0

  const copyText = async (text: string, status: string) => {
    await navigator.clipboard?.writeText(text)
    setCopyStatus(status)
    window.setTimeout(() => setCopyStatus(''), 1600)
  }

  return (
    <aside className="research-inspector" aria-label={`${company.ticker} 研究详情`}>
      <div className="inspector-scroll">
        <div className="inspector-context">
          <span>当前选择</span>
          <span className={`depth-badge depth-${company.researchDepth}`}>
            {researchDepthLabels[company.researchDepth]}：{company.aiCategory}
          </span>
        </div>

        <div className="company-identity">
          <div>
            <div className="ticker-line">
              <h2>{company.ticker}</h2>
              <span>{company.name}</span>
            </div>
            <div className="price-line">
              <strong>${company.price.toFixed(2)}</strong>
              <span className={positive ? 'positive' : 'negative'}>
                {positive ? '+' : ''}{company.dailyChange.toFixed(2)} ({positive ? '+' : ''}{company.dailyChangePercent.toFixed(2)}%)
              </span>
            </div>
            <small>收盘价（{company.asOf}）</small>
          </div>

          <div className="identity-actions">
            <button
              type="button"
              className={bookmarked ? 'icon-button bookmarked' : 'icon-button'}
              onClick={onToggleBookmark}
              aria-label={bookmarked ? '取消收藏' : '收藏公司'}
            >
              <Star size={18} fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
            <div className="more-menu-wrap">
              <button type="button" className="icon-button" onClick={() => setMenuOpen((open) => !open)} aria-label="更多操作" aria-expanded={menuOpen}>
                <MoreHorizontal size={20} />
              </button>
              {menuOpen ? (
                <div className="more-menu">
                  <button type="button" onClick={() => void copyText(window.location.href, '研究链接已复制')}>
                    <Copy size={14} />复制研究链接
                  </button>
                  <button type="button" onClick={() => void copyText(`${company.ticker}：${company.oneLineThesis}`, '核心结论已复制')}>
                    <Check size={14} />复制核心结论
                  </button>
                  {copyStatus ? <span>{copyStatus}</span> : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className={`proof-stamp depth-${company.researchDepth}`}>
            <strong>{researchDepthLabels[company.researchDepth]}</strong>
            <span>{proofStageLabels[company.proofStage]}</span>
          </div>
        </div>

        <div className="inspector-tabs" role="tablist" aria-label={`${company.ticker} 研究维度`}>
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="inspector-tab-panel" role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          {activeTab === 'evidence' ? <EvidenceTab company={company} /> : null}
          {activeTab === 'financials' ? <FinancialsTab company={company} /> : null}
          {activeTab === 'valuation' ? <ValuationTab company={company} /> : null}
          {activeTab === 'competition' ? <CompetitionTab company={company} /> : null}
          {activeTab === 'risks' ? <RisksTab company={company} /> : null}
        </div>
      </div>

      <div className="inspector-footer">
        <span>更新：2026-07-14 · 研究层 A</span>
        <button type="button" onClick={onOpenNote}>
          <FilePlus2 size={15} />
          加入笔记
        </button>
      </div>
    </aside>
  )
}
