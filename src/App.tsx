import { useEffect, useMemo, useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { CatalystStrip } from './components/CatalystStrip'
import { CompanyComparisonTable } from './components/CompanyComparisonTable'
import { NoteDialog } from './components/NoteDialog'
import { OpportunityMatrix } from './components/OpportunityMatrix'
import { ResearchInspector } from './components/ResearchInspector'
import { ResearchSidebar } from './components/ResearchSidebar'
import { companies, companyByTicker } from './data/research'
import { useResearchNotes } from './hooks/useResearchNotes'
import { useResearchWorkspace } from './hooks/useResearchWorkspace'
import type { DetailTab, Ticker, WorkspaceView } from './types/research'
import './App.css'

const scrollTargets: Record<WorkspaceView, string> = {
  map: 'opportunity-map',
  companies: 'company-comparison',
  catalysts: 'catalyst-strip',
  sources: 'source-list',
}

function App() {
  const { state, dispatch } = useResearchWorkspace()
  const { notes, saveStatus, updateNote } = useResearchNotes()
  const [bookmarks, setBookmarks] = useState<Set<Ticker>>(() => new Set(['NVDA', 'AVGO', 'AMD']))
  const [toast, setToast] = useState('')

  const selectedCompany = companyByTicker[state.selectedTicker]
  const normalizedQuery = state.query.trim().toLowerCase()
  const searchResults = useMemo(() => companies.filter((company) => {
    if (!normalizedQuery) return true
    return [company.ticker, company.name, company.shortName, company.sector, company.aiCategory]
      .some((value) => value.toLowerCase().includes(normalizedQuery))
  }), [normalizedQuery])
  const matchingTickers = useMemo(() => new Set(searchResults.map((company) => company.ticker)), [searchResults])

  useEffect(() => {
    document.title = `${selectedCompany.ticker} · AI 机会图谱 · 股票研究台`
  }, [selectedCompany.ticker])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 1800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const selectCompany = (ticker: Ticker) => {
    dispatch({ type: 'select-company', ticker })
    if (window.matchMedia('(max-width: 760px)').matches) {
      window.setTimeout(() => document.querySelector('.research-inspector')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    }
  }

  const changeView = (view: WorkspaceView) => {
    dispatch({ type: 'set-view', view })
    if (view === 'sources') dispatch({ type: 'set-tab', tab: 'evidence' })
    window.setTimeout(() => {
      document.getElementById(scrollTargets[view])?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const changeTab = (tab: DetailTab) => dispatch({ type: 'set-tab', tab })

  const openNote = () => {
    if (!notes[selectedCompany.ticker]) {
      updateNote(
        selectedCompany.ticker,
        `${selectedCompany.ticker} 研究笔记\n\n待验证事项：\n- ${selectedCompany.nextCatalyst.watch}\n- ${selectedCompany.falsifier}\n\n初步判断：\n`,
      )
    }
    dispatch({ type: 'toggle-note', open: true })
  }

  const toggleBookmark = () => {
    setBookmarks((current) => {
      const next = new Set(current)
      if (next.has(selectedCompany.ticker)) {
        next.delete(selectedCompany.ticker)
        setToast(`${selectedCompany.ticker} 已移出收藏`)
      } else {
        next.add(selectedCompany.ticker)
        setToast(`${selectedCompany.ticker} 已加入收藏`)
      }
      return next
    })
  }

  return (
    <div className="research-app">
      <AppHeader
        activeView={state.activeView}
        query={state.query}
        searchResults={searchResults}
        onQueryChange={(query) => dispatch({ type: 'set-query', query })}
        onSelectCompany={selectCompany}
        onViewChange={changeView}
        onCreateNote={openNote}
      />

      <ResearchSidebar activeView={state.activeView} onViewChange={changeView} onCreateNote={openNote} />

      <main className="research-workspace">
        <OpportunityMatrix
          companies={companies}
          selectedTicker={state.selectedTicker}
          matchingTickers={matchingTickers}
          showLabels={state.showLabels}
          showDepthLegend={state.showDepthLegend}
          settingsOpen={state.settingsOpen}
          onSelect={selectCompany}
          onToggleSettings={() => dispatch({ type: 'toggle-settings' })}
          onToggleLabels={() => dispatch({ type: 'toggle-labels' })}
          onToggleDepthLegend={() => dispatch({ type: 'toggle-depth-legend' })}
          onReset={() => dispatch({ type: 'reset-map' })}
        />

        <CompanyComparisonTable
          companies={normalizedQuery ? searchResults : companies}
          selectedTicker={state.selectedTicker}
          onSelect={selectCompany}
        />
      </main>

      <ResearchInspector
        company={selectedCompany}
        activeTab={state.activeTab}
        bookmarked={bookmarks.has(selectedCompany.ticker)}
        onTabChange={changeTab}
        onToggleBookmark={toggleBookmark}
        onOpenNote={openNote}
      />

      <CatalystStrip
        selectedTicker={state.selectedTicker}
        onSelect={selectCompany}
        onOpenCalendar={() => changeView('catalysts')}
      />

      {state.noteOpen ? (
        <NoteDialog
          company={selectedCompany}
          note={notes[selectedCompany.ticker] ?? ''}
          saveStatus={saveStatus}
          onChange={(value) => updateNote(selectedCompany.ticker, value)}
          onClose={() => dispatch({ type: 'toggle-note', open: false })}
        />
      ) : null}

      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </div>
  )
}

export default App
