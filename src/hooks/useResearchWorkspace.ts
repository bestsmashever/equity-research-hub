import { useEffect, useReducer } from 'react'
import { companies } from '../data/research'
import type { DetailTab, Ticker, WorkspaceView } from '../types/research'

export type WorkspaceState = {
  selectedTicker: Ticker
  activeTab: DetailTab
  activeView: WorkspaceView
  query: string
  noteOpen: boolean
  settingsOpen: boolean
  showLabels: boolean
  showDepthLegend: boolean
}

type WorkspaceAction =
  | { type: 'select-company'; ticker: Ticker }
  | { type: 'set-tab'; tab: DetailTab }
  | { type: 'set-view'; view: WorkspaceView }
  | { type: 'set-query'; query: string }
  | { type: 'toggle-note'; open?: boolean }
  | { type: 'toggle-settings'; open?: boolean }
  | { type: 'toggle-labels' }
  | { type: 'toggle-depth-legend' }
  | { type: 'hydrate-url'; ticker: Ticker; tab: DetailTab; view: WorkspaceView }
  | { type: 'reset-map' }

const detailTabs: DetailTab[] = ['evidence', 'financials', 'valuation', 'competition', 'risks']
const workspaceViews: WorkspaceView[] = ['map', 'companies', 'catalysts', 'sources']

const isTicker = (value: string | null): value is Ticker =>
  companies.some((company) => company.ticker === value)

const isDetailTab = (value: string | null): value is DetailTab =>
  detailTabs.includes(value as DetailTab)

const isWorkspaceView = (value: string | null): value is WorkspaceView =>
  workspaceViews.includes(value as WorkspaceView)

const readUrlState = () => {
  const params = new URLSearchParams(window.location.search)
  const ticker = isTicker(params.get('company')) ? params.get('company') as Ticker : 'NVDA'
  const tab = isDetailTab(params.get('tab')) ? params.get('tab') as DetailTab : 'evidence'
  const view = isWorkspaceView(params.get('view')) ? params.get('view') as WorkspaceView : 'map'

  return { ticker, tab, view }
}

const initialState = (): WorkspaceState => {
  const url = readUrlState()
  return {
    selectedTicker: url.ticker,
    activeTab: url.tab,
    activeView: url.view,
    query: '',
    noteOpen: false,
    settingsOpen: false,
    showLabels: true,
    showDepthLegend: true,
  }
}

const reducer = (state: WorkspaceState, action: WorkspaceAction): WorkspaceState => {
  switch (action.type) {
    case 'select-company':
      return {
        ...state,
        selectedTicker: action.ticker,
        activeTab: 'evidence',
        settingsOpen: false,
      }
    case 'set-tab':
      return { ...state, activeTab: action.tab }
    case 'set-view':
      return { ...state, activeView: action.view, settingsOpen: false }
    case 'set-query':
      return { ...state, query: action.query }
    case 'toggle-note':
      return { ...state, noteOpen: action.open ?? !state.noteOpen, settingsOpen: false }
    case 'toggle-settings':
      return { ...state, settingsOpen: action.open ?? !state.settingsOpen }
    case 'toggle-labels':
      return { ...state, showLabels: !state.showLabels }
    case 'toggle-depth-legend':
      return { ...state, showDepthLegend: !state.showDepthLegend }
    case 'hydrate-url':
      return {
        ...state,
        selectedTicker: action.ticker,
        activeTab: action.tab,
        activeView: action.view,
      }
    case 'reset-map':
      return {
        ...state,
        selectedTicker: 'NVDA',
        activeTab: 'evidence',
        query: '',
        showLabels: true,
        showDepthLegend: true,
        settingsOpen: false,
      }
  }
}

export function useResearchWorkspace() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set('company', state.selectedTicker)
    params.set('tab', state.activeTab)
    params.set('view', state.activeView)
    const nextUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', nextUrl)
  }, [state.activeTab, state.activeView, state.selectedTicker])

  useEffect(() => {
    const handlePopState = () => {
      const url = readUrlState()
      dispatch({ type: 'hydrate-url', ...url })
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return { state, dispatch }
}
