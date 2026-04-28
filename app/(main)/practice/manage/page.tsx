'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus, Edit, BarChart2, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function PracticeManagePage() {
  const supabase = createClientComponentClient()
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchExams = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('exam_sets')
        .select(`
          id, title, grade, duration_minutes, is_published, created_at,
          exam_set_questions(count),
          exam_sessions(count)
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setExams(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExams()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa đề luyện thi này? Tất cả kết quả của học sinh sẽ bị mất.')) return
    try {
      const { error } = await supabase.from('exam_sets').delete().eq('id', id)
      if (error) throw error
      fetchExams()
    } catch (err: any) {
      alert('Lỗi: ' + err.message)
    }
  }

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('exam_sets').update({ is_published: !currentStatus }).eq('id', id)
      if (error) throw error
      fetchExams()
    } catch (err: any) {
      alert('Lỗi: ' + err.message)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đề luyện thi</h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách đề luyện thi do bạn quản lý</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/practice"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Về trang luyện thi
          </Link>
          <Link
            href="/practice/create"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" /> Tạo đề mới
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
        ) : exams.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Chưa có đề luyện thi nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số câu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lượt làm</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exams.map((exam) => {
                  const qCount = exam.exam_set_questions[0]?.count || 0
                  const sessionCount = exam.exam_sessions[0]?.count || 0

                  return (
                    <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                        <div className="text-xs text-gray-500">{exam.duration_minutes} phút</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Lớp {exam.grade}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => togglePublish(exam.id, exam.is_published)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                            exam.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {exam.is_published ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                          {exam.is_published ? 'Public' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sessionCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <Link href={`/exams/${exam.id}/results`} className="text-blue-600 hover:text-blue-900 inline-flex items-center" title="Kết quả HS">
                          <BarChart2 className="w-5 h-5" />
                        </Link>
                        <button onClick={() => handleDelete(exam.id)} className="text-red-400 hover:text-red-600 inline-flex items-center" title="Xóa">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
