import { proofStageLabels, researchDepthLabels, riskLabels } from '../data/research'
import type { CompanyResearch, Ticker } from '../types/research'

type CompanyComparisonTableProps = {
  companies: CompanyResearch[]
  selectedTicker: Ticker
  onSelect: (ticker: Ticker) => void
}

export function CompanyComparisonTable({ companies, selectedTicker, onSelect }: CompanyComparisonTableProps) {
  const sorted = [...companies].sort((left, right) => right.matrix.proofScore - left.matrix.proofScore)

  return (
    <section className="comparison-panel" id="company-comparison" aria-labelledby="comparison-title">
      <div className="comparison-title-row">
        <h2 id="comparison-title">公司对比 <span>（按变现证据强度排序）</span></h2>
        <small>各公司价格日期见详情</small>
      </div>
      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>代码</th>
              <th>公司</th>
              <th>价格</th>
              <th>市值</th>
              <th>预期 / 估值风险</th>
              <th>AI 变现证据强度</th>
              <th>研究分层</th>
              <th>核心结论一句话</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((company) => {
              const filledDots = Math.max(1, Math.round(company.matrix.proofScore / 20))
              return (
                <tr key={company.ticker} className={company.ticker === selectedTicker ? 'selected' : ''}>
                  <td>
                    <button type="button" className="table-company-button" onClick={() => onSelect(company.ticker)}>
                      {company.ticker}
                    </button>
                  </td>
                  <td>{company.name}</td>
                  <td className="numeric">${company.price.toFixed(2)}</td>
                  <td className="numeric" title={company.marketCapNote}>{company.marketCap}</td>
                  <td><span className={`risk-text risk-${company.riskLevel}`}>{riskLabels[company.riskLevel]}</span></td>
                  <td>
                    <div className="proof-score" aria-label={`证据强度 ${company.matrix.proofScore}/100`}>
                      <div className="proof-dots" aria-hidden="true">
                        {Array.from({ length: 5 }, (_, index) => <i className={index < filledDots ? 'filled' : ''} key={index} />)}
                      </div>
                      <span>{proofStageLabels[company.proofStage]}</span>
                    </div>
                  </td>
                  <td><span className={`depth-badge depth-${company.researchDepth}`}>{researchDepthLabels[company.researchDepth]}</span></td>
                  <td title={company.oneLineThesis}>{company.oneLineThesis}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
