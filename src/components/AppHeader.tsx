import { useState, type FormEvent } from 'react'
import { ChevronDown, Plus, Search, UserRound, X } from 'lucide-react'
import xrMark from '../assets/xr-mark.png'
import type { CompanyResearch, Ticker, WorkspaceView } from '../types/research'

type AppHeaderProps = {
  activeView: WorkspaceView
  query: string
  searchResults: CompanyResearch[]
  onQueryChange: (query: string) => void
  onSelectCompany: (ticker: Ticker) => void
  onViewChange: (view: WorkspaceView) => void
  onCreateNote: () => void
}

const navItems: Array<{ view: WorkspaceView; label: string }> = [
  { view: 'map', label: 'AI 机会图谱' },
  { view: 'companies', label: '公司研究' },
  { view: 'catalysts', label: '催化日历' },
  { view: 'sources', label: '证据库' },
]

export function AppHeader({
  activeView,
  query,
  searchResults,
  onQueryChange,
  onSelectCompany,
  onViewChange,
  onCreateNote,
}: AppHeaderProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const first = searchResults[0]
    if (first) {
      onSelectCompany(first.ticker)
      onQueryChange('')
      setMobileSearchOpen(false)
    }
  }

  return (
    <header className="app-header">
      <div className="brand-lockup">
        <img src={xrMark} alt="XR" />
        <div>
          <strong>股票研究台</strong>
          <span>专业机构研究平台</span>
        </div>
      </div>

      <nav className="primary-nav" aria-label="主要导航">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.view}
            className={activeView === item.view ? 'primary-nav-item active' : 'primary-nav-item'}
            aria-current={activeView === item.view ? 'page' : undefined}
            onClick={() => onViewChange(item.view)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <form className={mobileSearchOpen ? 'research-search mobile-open' : 'research-search'} onSubmit={handleSubmit}>
          <Search size={16} aria-hidden="true" />
          <input
            aria-label="搜索股票代码、公司或主题"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                onQueryChange('')
                setMobileSearchOpen(false)
              }
            }}
            placeholder="搜索代码 / 名称 / 主题"
          />
          {query ? (
            <button type="button" className="search-clear" onClick={() => onQueryChange('')} aria-label="清空搜索">
              <X size={14} />
            </button>
          ) : null}

          {query ? (
            <div className="search-results" role="listbox" aria-label="搜索结果">
              {searchResults.length ? searchResults.map((company) => (
                <button
                  type="button"
                  key={company.ticker}
                  role="option"
                  aria-selected="false"
                  onClick={() => {
                    onSelectCompany(company.ticker)
                    onQueryChange('')
                    setMobileSearchOpen(false)
                  }}
                >
                  <strong>{company.ticker}</strong>
                  <span>{company.name}</span>
                  <small>{company.aiCategory}</small>
                </button>
              )) : (
                <div className="search-empty">没有匹配的公司</div>
              )}
            </div>
          ) : null}
        </form>

        <button
          type="button"
          className="mobile-search-trigger"
          onClick={() => setMobileSearchOpen((open) => !open)}
          aria-label="打开搜索"
          aria-expanded={mobileSearchOpen}
        >
          <Search size={20} />
        </button>
        <button type="button" className="new-note-button" onClick={onCreateNote}>
          <Plus size={17} />
          <span>新笔记</span>
        </button>
        <button
          type="button"
          className="account-button"
          aria-label="账户菜单"
          aria-expanded={accountOpen}
          onClick={() => setAccountOpen((open) => !open)}
        >
          <UserRound size={19} />
          <ChevronDown size={14} />
        </button>
        {accountOpen ? (
          <div className="account-menu">
            <strong>本地研究空间</strong>
            <span>公开资料 · 本地笔记</span>
          </div>
        ) : null}
      </div>
    </header>
  )
}
