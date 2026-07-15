import {
  BarChart3,
  Building2,
  CalendarDays,
  FileText,
  Grid2X2,
  Library,
  ShieldCheck,
  Star,
} from 'lucide-react'
import type { WorkspaceView } from '../types/research'

type ResearchSidebarProps = {
  activeView: WorkspaceView
  onViewChange: (view: WorkspaceView) => void
  onCreateNote: () => void
}

const primaryItems = [
  { view: 'map' as const, label: 'AI 机会图谱', icon: Grid2X2 },
  { view: 'companies' as const, label: '公司研究', icon: Building2 },
  { view: 'catalysts' as const, label: '催化日历', icon: CalendarDays },
  { view: 'sources' as const, label: '证据库', icon: Library },
]

export function ResearchSidebar({ activeView, onViewChange, onCreateNote }: ResearchSidebarProps) {
  return (
    <>
      <aside className="research-sidebar" aria-label="研究导航">
        <div className="sidebar-section-label">研究视图</div>
        <nav className="sidebar-nav">
          {primaryItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                type="button"
                key={item.view}
                className={activeView === item.view ? 'sidebar-item active' : 'sidebar-item'}
                onClick={() => onViewChange(item.view)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-divider" />
        <div className="sidebar-section-label">我的研究</div>
        <div className="sidebar-nav secondary">
          <button type="button" className="sidebar-item" onClick={onCreateNote}>
            <FileText size={18} />
            <span>我的笔记</span>
          </button>
          <button type="button" className="sidebar-item" onClick={() => onViewChange('companies')}>
            <Star size={18} />
            <span>收藏列表</span>
          </button>
          <button type="button" className="sidebar-item" onClick={() => onViewChange('companies')}>
            <ShieldCheck size={18} />
            <span>自选组合</span>
          </button>
          <button type="button" className="sidebar-item" onClick={() => onViewChange('map')}>
            <BarChart3 size={18} />
            <span>数据看板</span>
          </button>
        </div>

        <div className="sidebar-disclaimer">
          <p>本页面为研究层展示，结论基于公开信息与研究假设。</p>
          <strong>不构成投资建议。</strong>
          <span>数据截至 2026-07-14 收盘</span>
        </div>
      </aside>

      <nav className="mobile-bottom-nav" aria-label="移动端研究导航">
        {primaryItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              type="button"
              key={item.view}
              className={activeView === item.view ? 'active' : ''}
              onClick={() => onViewChange(item.view)}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
