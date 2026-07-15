export type Ticker = 'NVDA' | 'AVGO' | 'AMD' | 'TSLA' | 'SPCX' | 'RKLB'

export type ResearchDepth = 'deep' | 'watch' | 'unproven'
export type ProofStage = 'unproven' | 'emerging' | 'scaled'
export type RiskLevel = 'medium' | 'high' | 'extreme'
export type DetailTab = 'evidence' | 'financials' | 'valuation' | 'competition' | 'risks'
export type WorkspaceView = 'map' | 'companies' | 'catalysts' | 'sources'
export type ClaimPosture = 'verified' | 'management' | 'derived' | 'gap'

export type ResearchSource = {
  id: string
  title: string
  publisher: string
  url: string
  kind: 'company-ir' | 'sec' | 'exchange' | 'market-data'
}

export type EvidenceClaim = {
  id: string
  text: string
  posture: ClaimPosture
  sourceIds: string[]
}

export type Metric = {
  label: string
  value: string
  context?: string
}

export type CompanyResearch = {
  ticker: Ticker
  name: string
  shortName: string
  price: number
  dailyChange: number
  dailyChangePercent: number
  marketCap: string
  marketCapNote?: string
  asOf: string
  sector: string
  researchDepth: ResearchDepth
  proofStage: ProofStage
  riskLevel: RiskLevel
  aiCategory: string
  matrix: {
    proofScore: number
    expectationRisk: number
    size: 'small' | 'medium' | 'large'
  }
  oneLineThesis: string
  evidence: EvidenceClaim[]
  financialMetrics: Metric[]
  financialSummary: string
  valuationSummary: string
  expectations: string[]
  competition: string[]
  risks: string[]
  falsifier: string
  nextCatalyst: {
    date: string | null
    displayDate: string
    event: string
    watch: string
  }
  sources: ResearchSource[]
}

export type Catalyst = {
  id: string
  ticker: Ticker
  date: string | null
  displayDate: string
  event: string
  status: 'scheduled' | 'pending' | 'completed'
}
