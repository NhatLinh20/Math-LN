'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Users, Target, Clock, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts'

export default function ExamResultsPage() {
  const params = useParams()
  const examId = params.id as string
  const supabase = createClientComponentClient()
  
  const [exam, setExam] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // 1. Fetch exam info
        const { data: examData, error: examError } = await supabase
          .from('exam_sets')
          .select('title, grade, duration_minutes')
          .eq('id', examId)
          .single()

        if (examError) throw examError
        setExam(examData)

        // 2. Fetch sessions
        const { data: sessionData, error: sessionError } = await supabase
          .from('exam_sessions')
          .select(`
            id, score, correct_count, total_questions, duration_seconds, grading_status, completed_at,
            users:user_id ( id ),
            profiles:user_id ( full_name )
          `)
          .eq('exam_set_id', examId)
          .order('score', { ascending: false })

        if (sessionError) throw sessionError
        setSessions(sessionData || [])

      } catch (err: any) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (examId) fetchResults()
  }, [examId, supabase])

  if (loading) {
    return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
  }

  if (!exam) return <div className="text-center py-12">Không tìm thấy dữ liệu đề thi.</div>

  // Statistics
  const totalStudents = sessions.length
  const pendingGrading = sessions.filter(s => s.grading_status === 'pending').length
  const avgScore = totalStudents > 0 
    ? (sessions.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalStudents).toFixed(2) 
    : 0

  // Chart Data preparation
  const distribution = [
    { range: '0-2', count: 0, color: '#ef4444' }, // Red
    { range: '2-4', count: 0, color: '#f97316' }, // Orange
    { range: '4-6', count: 0, color: '#eab308' }, // Yellow
    { range: '6-8', count: 0, color: '#3b82f6' }, // Blue
    { range: '8-10', count: 0, color: '#22c55e' }, // Green
  ]

  sessions.forEach(s => {
    const score = s.score || 0
    if (score < 2) distribution[0].count++
    else if (score < 4) distribution[1].count++
    else if (score < 6) distribution[2].count++
    else if (score < 8) distribution[3].count++
    else distribution[4].count++
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/exams/manage" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại Quản lý
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
        <p className="text-sm text-gray-500 mt-1">Lớp {exam.grade} • {exam.duration_minutes} phút</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg"><Users className="w-6 h-6 text-blue-600" /></div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Lượt làm bài</p>
            <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center">
          <div className="p-3 bg-green-100 rounded-lg"><Target className="w-6 h-6 text-green-600" /></div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Điểm trung bình</p>
            <p className="text-2xl font-bold text-gray-900">{avgScore}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center">
          <div className="p-3 bg-purple-100 rounded-lg"><Clock className="w-6 h-6 text-purple-600" /></div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Thời gian TB</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalStudents > 0 ? Math.floor(sessions.reduce((a,c)=>a+(c.duration_seconds||0),0)/totalStudents/60) : 0} p
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center">
          <div className="p-3 bg-orange-100 rounded-lg"><AlertTriangle className="w-6 h-6 text-orange-600" /></div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Cần chấm tay</p>
            <p className="text-2xl font-bold text-gray-900">{pendingGrading}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Phổ điểm</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="range" tick={{fontSize: 12}} />
                <YAxis allowDecimals={false} tick={{fontSize: 12}} />
                <RechartsTooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Danh sách kết quả</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Học sinh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nộp lúc</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tỉ lệ đúng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm / 10</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-500">Chưa có ai nộp bài.</td></tr>
                ) : sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {/* supabase query returns an array for profiles when joining if it's 1-to-many, but user_id is PK in profiles so it's an object or array of 1 */}
                      {Array.isArray(s.profiles) ? s.profiles[0]?.full_name : (s.profiles?.full_name || 'Khách')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(s.completed_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {s.grading_status === 'pending' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Cần chấm tự luận</span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Đã chấm</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {s.correct_count} / {s.total_questions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {s.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
