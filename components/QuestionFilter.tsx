import React, { useState, useEffect } from 'react'
import { GRADES, SUBJECT_TYPES, DIFFICULTY, TAXONOMY } from '@/lib/question-taxonomy'
import { Search, Filter } from 'lucide-react'

interface FilterState {
  grade?: number
  subject?: string
  chapter?: number
  lesson?: number
  form?: number
  difficulty: string[]
  search?: string
}

interface QuestionFilterProps {
  onFilterChange: (filters: FilterState) => void
}

export default function QuestionFilter({ onFilterChange }: QuestionFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    difficulty: [],
  })

  // When filters change locally, emit to parent
  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  // Get available taxonomy based on current selections
  const availableSubjects = filters.grade ? Object.keys(TAXONOMY[filters.grade] || {}) : []
  const availableChapters = (filters.grade && filters.subject) ? (TAXONOMY[filters.grade]?.[filters.subject] || []) : []
  const selectedChapterObj = availableChapters.find(c => c.id === filters.chapter)
  const availableLessons = selectedChapterObj?.lessons || []
  const selectedLessonObj = availableLessons.find(l => l.id === filters.lesson)
  const availableForms = selectedLessonObj?.forms || []

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value }
      
      // Reset cascading children
      if (key === 'grade') {
        next.subject = undefined; next.chapter = undefined; next.lesson = undefined; next.form = undefined;
      }
      if (key === 'subject') {
        next.chapter = undefined; next.lesson = undefined; next.form = undefined;
      }
      if (key === 'chapter') {
        next.lesson = undefined; next.form = undefined;
      }
      if (key === 'lesson') {
        next.form = undefined;
      }

      return next
    })
  }

  const toggleDifficulty = (d: string) => {
    setFilters(prev => {
      const isSelected = prev.difficulty.includes(d)
      const nextDiff = isSelected
        ? prev.difficulty.filter(x => x !== d)
        : [...prev.difficulty, d]
      return { ...prev, difficulty: nextDiff }
    })
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <div className="flex items-center space-x-2 pb-4 border-b border-gray-100">
        <Filter className="w-5 h-5 text-gray-500" />
        <h3 className="font-semibold text-gray-900">Bộ lọc câu hỏi</h3>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm nội dung..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Grade */}
      <div>
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Khối lớp</label>
        <div className="flex flex-wrap gap-2">
          {GRADES.map(g => (
            <button
              key={g}
              onClick={() => updateFilter('grade', filters.grade === g ? undefined : g)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                filters.grade === g 
                  ? 'bg-blue-50 border-blue-600 text-blue-700 font-medium' 
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Lớp {g}
            </button>
          ))}
        </div>
      </div>

      {/* Cascading Selects */}
      <div className="space-y-3">
        {filters.grade && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Môn học</label>
            <select 
              value={filters.subject || ''} 
              onChange={e => updateFilter('subject', e.target.value || undefined)}
              className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              {availableSubjects.map(s => (
                <option key={s} value={s}>{SUBJECT_TYPES[s as keyof typeof SUBJECT_TYPES]}</option>
              ))}
            </select>
          </div>
        )}

        {filters.subject && availableChapters.length > 0 && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Chương</label>
            <select 
              value={filters.chapter || ''} 
              onChange={e => updateFilter('chapter', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              {availableChapters.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {filters.chapter && availableLessons.length > 0 && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Bài học</label>
            <select 
              value={filters.lesson || ''} 
              onChange={e => updateFilter('lesson', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              {availableLessons.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        )}

        {filters.lesson && availableForms.length > 0 && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Dạng bài</label>
            <select 
              value={filters.form || ''} 
              onChange={e => updateFilter('form', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              {availableForms.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Mức độ</label>
        <div className="space-y-2">
          {Object.entries(DIFFICULTY).map(([code, label]) => (
            <label key={code} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.difficulty.includes(code)}
                onChange={() => toggleDifficulty(code)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
