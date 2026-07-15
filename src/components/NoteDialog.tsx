import { useEffect, useRef } from 'react'
import { CheckCircle2, Save, X } from 'lucide-react'
import type { CompanyResearch } from '../types/research'

type NoteDialogProps = {
  company: CompanyResearch
  note: string
  saveStatus: '已自动保存' | '保存中'
  onChange: (value: string) => void
  onClose: () => void
}

export function NoteDialog({ company, note, saveStatus, onChange, onClose }: NoteDialogProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    textareaRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="note-overlay" role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose()
    }}>
      <section className="note-dialog" role="dialog" aria-modal="true" aria-labelledby="note-title">
        <header>
          <div>
            <span>研究笔记</span>
            <h2 id="note-title">{company.ticker} · {company.shortName}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="关闭笔记">
            <X size={20} />
          </button>
        </header>
        <div className="note-context">
          <strong>核心结论</strong>
          <p>{company.oneLineThesis}</p>
        </div>
        <textarea
          ref={textareaRef}
          value={note}
          onChange={(event) => onChange(event.target.value)}
          placeholder="记录下一步验证、模型问题或电话会问题"
          aria-label={`${company.ticker} 研究笔记`}
        />
        <footer>
          <span className={saveStatus === '保存中' ? 'saving' : ''}>
            <CheckCircle2 size={14} />{saveStatus}
          </span>
          <button type="button" className="secondary-button" onClick={onClose}>取消</button>
          <button type="button" className="primary-button" onClick={onClose}>
            <Save size={15} />保存并关闭
          </button>
        </footer>
      </section>
    </div>
  )
}
