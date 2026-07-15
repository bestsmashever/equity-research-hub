import { useEffect, useState } from 'react'
import type { Ticker } from '../types/research'

const STORAGE_KEY = 'xr-stock-research:notes:v1'
type NotesByTicker = Partial<Record<Ticker, string>>

const loadNotes = (): NotesByTicker => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) as NotesByTicker : {}
  } catch {
    return {}
  }
}

export function useResearchNotes() {
  const [notes, setNotes] = useState<NotesByTicker>(loadNotes)
  const [saveStatus, setSaveStatus] = useState<'已自动保存' | '保存中'>('已自动保存')

  useEffect(() => {
    setSaveStatus('保存中')
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
      setSaveStatus('已自动保存')
    }, 320)

    return () => window.clearTimeout(timer)
  }, [notes])

  const updateNote = (ticker: Ticker, value: string) => {
    setNotes((current) => ({ ...current, [ticker]: value }))
  }

  return { notes, saveStatus, updateNote }
}
