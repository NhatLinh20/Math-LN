import React, { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import QuestionFilter from '../QuestionFilter'
import LatexPreview from '../LatexPreview'
import { Plus, X, GripVertical, Loader2 } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Sortable item component
function SortableQuestionItem({ id, question, onRemove, index }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={`flex items-start bg-white p-3 rounded-lg border mb-2 shadow-sm ${isDragging ? 'opacity-50 ring-2 ring-blue-500' : 'hover:border-blue-300'}`}>
      <div {...attributes} {...listeners} className="mt-1 mr-3 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-semibold text-sm">Câu {index + 1}:</span>
          <span className="text-xs font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{question.question_code}</span>
          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{question.difficulty}</span>
          <span className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded uppercase">{question.question_type}</span>
        </div>
        <div className="text-sm text-gray-700 truncate max-h-12 overflow-hidden">
          <LatexPreview content={question.content} />
        </div>
      </div>
      <button onClick={() => onRemove(question.id)} className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded">
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}

interface Step2Props {
  data: any
  updateData: (updates: any) => void
}

export default function Step2Questions({ data, updateData }: Step2Props) {
  const supabase = createClientComponentClient()
  const [bankQuestions, setBankQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<any>({ grade: data.grade })
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const PAGE_SIZE = 10

  const selectedQuestions = data.questions || []

  const fetchBank = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase.from('questions_public').select('*', { count: 'exact' })

      if (filters.grade) query = query.eq('grade', filters.grade)
      if (filters.subject) query = query.eq('subject_id', filters.subject)
      if (filters.chapter) query = query.eq('chapter_id', filters.chapter)
      if (filters.lesson) query = query.eq('lesson_id', filters.lesson)
      if (filters.form) query = query.eq('form_id', filters.form)
      if (filters.difficulty?.length > 0) query = query.in('difficulty', filters.difficulty)
      if (filters.search) query = query.ilike('content', `%${filters.search}%`)

      const from = (page - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      query = query.order('id', { ascending: false }).range(from, to)

      const { data: resData, count, error } = await query
      if (error) throw error

      setBankQuestions(resData || [])
      setTotalCount(count || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [supabase, filters, page])

  useEffect(() => {
    fetchBank()
  }, [fetchBank])

  const handleAdd = (q: any) => {
    if (selectedQuestions.find((sq: any) => sq.id === q.id)) return
    updateData({ questions: [...selectedQuestions, q] })
  }

  const handleRemove = (id: string) => {
    updateData({ questions: selectedQuestions.filter((q: any) => q.id !== id) })
  }

  // DnD config
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = selectedQuestions.findIndex((q: any) => q.id === active.id)
      const newIndex = selectedQuestions.findIndex((q: any) => q.id === over.id)
      updateData({ questions: arrayMove(selectedQuestions, oldIndex, newIndex) })
    }
  }

  // Count badges
  const dCount = { N: 0, H: 0, V: 0, C: 0 }
  selectedQuestions.forEach((q: any) => {
    if (dCount[q.difficulty as keyof typeof dCount] !== undefined) {
      dCount[q.difficulty as keyof typeof dCount]++
    }
  })

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[80vh]">
      {/* Left: Bank */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Ngân hàng câu hỏi</h3>
          <span className="text-xs text-gray-500">Tìm thấy {totalCount} câu</span>
        </div>
        
        <div className="p-4 border-b">
          <QuestionFilter onFilterChange={(f) => { setFilters(f); setPage(1) }} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
          ) : bankQuestions.map(q => (
            <div key={q.id} className="border p-3 rounded-lg hover:border-blue-300 flex items-start group">
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{q.question_code}</span>
                  <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{q.difficulty}</span>
                </div>
                <div className="text-sm line-clamp-3">
                  <LatexPreview content={q.content} />
                </div>
              </div>
              <button 
                onClick={() => handleAdd(q)}
                disabled={selectedQuestions.some((sq: any) => sq.id === q.id)}
                className="flex-shrink-0 p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                title="Thêm vào đề"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Pagination minimal */}
        <div className="p-3 border-t bg-gray-50 flex justify-between items-center">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 text-sm bg-white border rounded disabled:opacity-50">Trước</button>
          <span className="text-sm text-gray-600">Trang {page} / {Math.ceil(totalCount / PAGE_SIZE) || 1}</span>
          <button disabled={page >= Math.ceil(totalCount / PAGE_SIZE)} onClick={() => setPage(p => p + 1)} className="px-3 py-1 text-sm bg-white border rounded disabled:opacity-50">Sau</button>
        </div>
      </div>

      {/* Right: Selected */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Đã chọn: {selectedQuestions.length} câu</h3>
          <div className="flex space-x-1">
            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">N:{dCount.N}</span>
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">H:{dCount.H}</span>
            <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded">V:{dCount.V}</span>
            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">C:{dCount.C}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {selectedQuestions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <p>Chưa có câu hỏi nào trong đề.</p>
              <p className="text-sm mt-1">Bấm nút (+) từ ngân hàng để thêm.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={selectedQuestions.map((q: any) => q.id)} strategy={verticalListSortingStrategy}>
                {selectedQuestions.map((q: any, index: number) => (
                  <SortableQuestionItem key={q.id} id={q.id} question={q} index={index} onRemove={handleRemove} />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  )
}
