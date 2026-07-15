import { CalendarDays, Rocket } from 'lucide-react'
import { SiAmd, SiBroadcom, SiNvidia, SiSpacex, SiTesla } from 'react-icons/si'
import { catalysts } from '../data/research'
import type { Ticker } from '../types/research'

type CatalystStripProps = {
  selectedTicker: Ticker
  onSelect: (ticker: Ticker) => void
  onOpenCalendar: () => void
}

function CompanyMark({ ticker }: { ticker: Ticker }) {
  if (ticker === 'TSLA') return <SiTesla size={23} aria-hidden="true" />
  if (ticker === 'AMD') return <SiAmd size={26} aria-hidden="true" />
  if (ticker === 'NVDA') return <SiNvidia size={25} aria-hidden="true" />
  if (ticker === 'AVGO') return <SiBroadcom size={24} aria-hidden="true" />
  if (ticker === 'SPCX') return <SiSpacex size={30} aria-hidden="true" />
  return <Rocket size={24} aria-hidden="true" />
}

export function CatalystStrip({ selectedTicker, onSelect, onOpenCalendar }: CatalystStripProps) {
  return (
    <section className="catalyst-strip" id="catalyst-strip" aria-labelledby="catalyst-title">
      <div className="catalyst-strip-heading">
        <div>
          <CalendarDays size={17} />
          <h2 id="catalyst-title">近期关键催化剂</h2>
        </div>
        <button type="button" onClick={onOpenCalendar}>
          查看完整催化日历
        </button>
      </div>
      <div className="catalyst-cards">
        {catalysts.map((catalyst) => (
          <button
            type="button"
            key={catalyst.id}
            className={`catalyst-card brand-${catalyst.ticker} ${selectedTicker === catalyst.ticker ? 'selected' : ''}`}
            onClick={() => onSelect(catalyst.ticker)}
          >
            <span className="catalyst-brand"><CompanyMark ticker={catalyst.ticker} /></span>
            <span className="catalyst-copy">
              <strong><b>{catalyst.ticker}</b>{catalyst.event}</strong>
              <small>{catalyst.displayDate}</small>
            </span>
            <i className={`catalyst-status status-${catalyst.status}`}>{catalyst.status === 'pending' ? '待确认' : '已排期'}</i>
          </button>
        ))}
      </div>
    </section>
  )
}
