'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Clock, HelpCircle, Lock, Loader2, PlayCircle, RotateCcw } from 'lucide-react'

export default function PracticePage() {
  const supabase = createClientComponentClient()
  const [exams, setExams] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterGrade, setFilterGrade] = useState<number | 'all'>('all')
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'admin' | null>(null)

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
          setUserRole(profile?.role)
        }

        // 1. Fetch exams (RLS will automatically handle published + own drafts)
        let query = supabase.from('exam_sets').select(`
          *,
          profiles:created_by (full_name),
          exam_set_questions(count)
        `).order('created_at', { ascending: false })

        if (filterGrade !== 'all') {
          query = query.eq('grade', filterGrade)
        }

        const { data: examData, error } = await query
        if (error) throw error
        setExams(examData || [])

        // 2. Fetch user's best sessions if logged in
        if (user && examData && examData.length > 0) {
          const examIds = examData.map(e => e.id)
          const { data: sessionData } = await supabase
            .from('exam_sessions')
            .select('exam_set_id, score')
            .eq('user_id', user.id)
            .in('exam_set_id', examIds)

          // Get best score per exam
          const bestSessions = (sessionData || []).reduce((acc: any, curr) => {
            if (!acc[curr.exam_set_id] || acc[curr.exam_set_id].score < curr.score) {
              acc[curr.exam_set_id] = curr
            }
            return acc
          }, {})
          
          setSessions(Object.values(bestSessions))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [supabase, filterGrade])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Luyện thi trực tuyến</h1>
          <p className="text-sm text-gray-500 mt-1">Hàng trăm đề thi chất lượng cao được biên soạn kỹ lưỡng.</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {(userRole === 'teacher' || userRole === 'admin') && (
            <div className="flex space-x-2 mr-4 border-r pr-4">
              <Link href="/practice/manage" className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">
                Quản lý đề
              </Link>
              <Link href="/practice/create" className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                Tạo đề mới
              </Link>
            </div>
          )}
          
          <div className="flex space-x-2">
            {['all', 10, 11, 12].map((g) => (
              <button
                key={g}
                onClick={() => setFilterGrade(g as any)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
                  filterGrade === g 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {g === 'all' ? 'Tất cả' : `Lớp ${g}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : exams.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">Chưa có đề thi nào trong danh mục này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {exams.map((exam) => {
            const qCount = exam.exam_set_questions[0]?.count || 0
            const teacherName = exam.profiles?.full_name || 'Admin'
            const userSession = sessions.find(s => s.exam_set_id === exam.id)
            const hasAccessCode = exam.access_code !== null

            return (
              <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">Lớp {exam.grade}</span>
                    <div className="flex space-x-2">
                      {!exam.is_published && <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Bản nháp</span>}
                      {hasAccessCode && <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full flex items-center"><Lock className="w-3 h-3 mr-1"/> Mã bảo vệ</span>}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{exam.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{exam.description || 'Không có mô tả'}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 font-medium">
                    <div className="flex items-center"><HelpCircle className="w-4 h-4 mr-1 text-gray-400" /> {qCount} câu</div>
                    <div className="flex items-center"><Clock className="w-4 h-4 mr-1 text-gray-400" /> {exam.duration_minutes} phút</div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">GV: <span className="font-medium text-gray-700">{teacherName}</span></div>
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
                  {userSession ? (
                    <>
                      <div className="font-semibold text-gray-900">
                        Điểm cao nhất: <span className="text-blue-600">{userSession.score}</span> / 10
                      </div>
                      <Link href={`/practice/${exam.id}/do`} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                        <RotateCcw className="w-4 h-4 mr-1" /> Thi lại
                      </Link>
                    </>
                  ) : (
                    <Link href={`/practice/${exam.id}/do`} className="w-full flex items-center justify-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors">
                      <PlayCircle className="w-5 h-5 mr-2" /> Bắt đầu thi
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
