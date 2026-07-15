import { Info, RotateCcw, Settings2 } from 'lucide-react'
import type { CSSProperties } from 'react'
import { researchDepthLabels } from '../data/research'
import type { CompanyResearch, ResearchDepth, Ticker } from '../types/research'

type OpportunityMatrixProps = {
  companies: CompanyResearch[]
  selectedTicker: Ticker
  matchingTickers: Set<Ticker>
  showLabels: boolean
  showDepthLegend: boolean
  settingsOpen: boolean
  onSelect: (ticker: Ticker) => void
  onToggleSettings: () => void
  onToggleLabels: () => void
  onToggleDepthLegend: () => void
  onReset: () => void
}

const depthDescriptions: Record<ResearchDepth, string> = {
  deep: '已兑现直接 AI 收入',
  watch: '具可选性，需要更多证据',
  unproven: '证据不足',
}

const gridCells = Array.from({ length: 9 }, (_, index) => index)

export function OpportunityMatrix({
  companies,
  selectedTicker,
  matchingTickers,
  showLabels,
  showDepthLegend,
  settingsOpen,
  onSelect,
  onToggleSettings,
  onToggleLabels,
  onToggleDepthLegend,
  onReset,
}: OpportunityMatrixProps) {
  return (
    <section className="opportunity-section" id="opportunity-map" aria-labelledby="opportunity-title">
      <div className="opportunity-heading">
        <div>
          <div className="title-with-info">
            <h1 id="opportunity-title">AI 机会图谱</h1>
            <button
              type="button"
              className="icon-button quiet"
              aria-label="图谱说明"
              title="横轴为 AI 商业化证据强度；纵轴为当前预期与估值风险。坐标为研究判断，不是公司披露数据。"
            >
              <Info size={15} />
            </button>
          </div>
          <p>二维定位：纵轴 = 预期 / 估值风险 ｜ 横轴 = AI 变现证据强度</p>
        </div>

        <div className="map-settings-wrap">
          <button
            type="button"
            className="map-settings-button"
            onClick={onToggleSettings}
            aria-expanded={settingsOpen}
          >
            <Settings2 size={16} />
            图谱设置
          </button>
          {settingsOpen ? (
            <div className="map-settings-popover">
              <label>
                <input type="checkbox" checked={showLabels} onChange={onToggleLabels} />
                显示公司标签
              </label>
              <label>
                <input type="checkbox" checked={showDepthLegend} onChange={onToggleDepthLegend} />
                显示研究层级
              </label>
              <button type="button" onClick={onReset}>
                <RotateCcw size={14} />
                重置图谱
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {showDepthLegend ? (
        <div className="depth-legend" aria-label="研究层级图例">
          {(['deep', 'watch', 'unproven'] as const).map((depth) => {
            const count = companies.filter((company) => company.researchDepth === depth).length
            return (
              <div className={`legend-item depth-${depth}`} key={depth}>
                <i aria-hidden="true" />
                <span><strong>{researchDepthLabels[depth]}：</strong>{depthDescriptions[depth]} ({count})</span>
              </div>
            )
          })}
        </div>
      ) : null}

      <div className="matrix-frame">
        <div className="matrix-y-axis">
          <strong>预期 / 估值风险</strong>
          <div className="y-label high"><b>高</b><span>高预期 / 高估值风险</span></div>
          <div className="y-label medium"><b>中</b><span>中等预期 / 中等风险</span></div>
          <div className="y-label low"><b>低</b><span>低预期 / 低估值风险</span></div>
        </div>

        <div className="matrix-main">
          <div className="matrix-plot" role="group" aria-label="AI 变现证据与预期风险二维图">
            <div className="matrix-grid" aria-hidden="true">
              {gridCells.map((cell) => <i key={cell} className={`matrix-cell cell-${cell}`} />)}
            </div>

            {companies.map((company) => {
              const selected = company.ticker === selectedTicker
              const matching = matchingTickers.has(company.ticker)
              const style = {
                '--node-x': `${Math.min(94, Math.max(6, company.matrix.proofScore))}%`,
                '--node-y': `${Math.min(92, Math.max(8, company.matrix.expectationRisk))}%`,
              } as CSSProperties
              const edgeClass = company.matrix.proofScore > 77 ? 'right-edge' : ''

              return (
                <button
                  type="button"
                  key={company.ticker}
                  style={style}
                  className={`company-node depth-${company.researchDepth} size-${company.matrix.size} ${edgeClass} ${selected ? 'selected' : ''} ${matching ? '' : 'dimmed'}`}
                  onClick={() => onSelect(company.ticker)}
                  aria-pressed={selected}
                  aria-label={`${company.ticker}，${company.aiCategory}，预期风险${company.riskLevel}`}
                >
                  <span className="node-dot" aria-hidden="true" />
                  {showLabels || selected ? (
                    <span className="node-label">
                      <strong>{company.ticker}</strong>
                      <small>{company.shortName}</small>
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="matrix-x-labels" aria-hidden="true">
            <div><strong>未证实</strong><span>仅概念 / 无披露</span></div>
            <div><strong>已披露</strong><span>有披露但规模有限</span></div>
            <div><strong>已规模化</strong><span>直接 AI 收入已规模化</span></div>
          </div>
          <div className="matrix-x-title">AI 变现证据强度</div>
        </div>
      </div>
    </section>
  )
}
