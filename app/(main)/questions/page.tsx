'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import QuestionFilter from '@/components/QuestionFilter'
import QuestionCard from '@/components/QuestionCard'
import QuestionFormModal from '@/components/QuestionFormModal'
import { Plus, Upload, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function QuestionsPage() {
  const supabase = createClientComponentClient()
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'admin' | null>(null)
  
  // Filter & Pagination
  const [filters, setFilters] = useState<any>({})
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const PAGE_SIZE = 20

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').select('role').eq('id', user.id).single()
          .then(({ data }) => setUserRole(data?.role))
      }
    })
  }, [supabase])

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    try {
      // Use questions_public for safe reading
      let query = supabase.from('questions_public').select('*', { count: 'exact' })

      if (filters.grade) query = query.eq('grade', filters.grade)
      if (filters.subject) query = query.eq('subject_id', filters.subject)
      if (filters.chapter) query = query.eq('chapter_id', filters.chapter)
      if (filters.lesson) query = query.eq('lesson_id', filters.lesson)
      if (filters.form) query = query.eq('form_id', filters.form)
      
      if (filters.difficulty?.length > 0) {
        query = query.in('difficulty', filters.difficulty)
      }

      if (filters.search) {
        // Simple text search using ILIKE
        query = query.ilike('content', `%${filters.search}%`)
      }

      const from = (page - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      query = query.order('id', { ascending: false }).range(from, to)

      const { data, count, error } = await query

      if (error) throw error
      setQuestions(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase, filters, page])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa câu hỏi này?')) return
    try {
      const { error } = await supabase.from('questions').delete().eq('id', id)
      if (error) throw error
      fetchQuestions()
    } catch (error: any) {
      alert('Lỗi khi xóa: ' + error.message)
    }
  }

  const openEditModal = (id: string) => {
    setEditingId(id)
    setIsModalOpen(true)
  }

  const openCreateModal = () => {
    setEditingId(null)
    setIsModalOpen(true)
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const isTeacher = userRole === 'teacher' || userRole === 'admin'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ngân hàng câu hỏi</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng cộng {totalCount} câu hỏi public</p>
        </div>
        
        {isTeacher && (
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link 
              href="/questions/import"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import file
            </Link>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm câu hỏi
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 flex-shrink-0">
          <div className="sticky top-6">
            <QuestionFilter onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">Không tìm thấy câu hỏi nào phù hợp.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  mode={isTeacher ? 'edit' : 'view'}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm mt-8">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Trước
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Đang xem trang <span className="font-medium">{page}</span> / <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <QuestionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchQuestions}
        editingId={editingId}
      />
    </div>
  )
}
