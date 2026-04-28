'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Loader2, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'

export default function PracticeHistoryPage() {
  const supabase = createClientComponentClient()
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('exam_sessions')
          .select(`
            id, exam_set_id, score, correct_count, total_questions, duration_seconds, grading_status, completed_at,
            exam_sets ( title, grade )
          `)
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })

        if (error) throw error
        setSessions(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [supabase])

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}p ${s}s`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Lịch sử Luyện thi</h1>
        <p className="text-sm text-gray-500 mt-1">Xem lại tất cả các bài thi bạn đã hoàn thành</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">Bạn chưa hoàn thành bài thi nào.</p>
            <Link href="/practice" className="text-blue-600 font-medium hover:underline">
              Vào danh sách đề thi
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên đề thi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày nộp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm / 10</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((s) => {
                  const exam = s.exam_sets // Assuming it returns object because it's many-to-one
                  
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{exam?.title || 'Đề đã bị xóa'}</div>
                        <div className="text-xs text-gray-500">Lớp {exam?.grade}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(s.completed_at).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {s.grading_status === 'pending' ? (
                          <span className="px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Chờ chấm tự luận
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Đã chấm
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-black text-blue-600">{s.score}</div>
                        <div className="text-xs text-gray-500">{s.correct_count}/{s.total_questions} đúng</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center mt-2">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDuration(s.duration_seconds)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/practice/${s.exam_set_id}/result/${s.id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-900"
                        >
                          Xem chi tiết <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
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
