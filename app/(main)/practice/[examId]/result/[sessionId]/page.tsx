'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Loader2, ArrowLeft, RotateCcw, CheckCircle2, XCircle, MinusCircle, Clock, AlertTriangle } from 'lucide-react'
import LatexPreview from '@/components/LatexPreview'

export default function StudentResultPage() {
  const params = useParams()
  const examId = params.examId as string
  const sessionId = params.sessionId as string
  const supabase = createClientComponentClient()

  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [exam, setExam] = useState<any>(null)
  const [answers, setAnswers] = useState<any[]>([]) // from exam_answers join questions_public
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Fetch Session
        const { data: sessionData, error: sessionError } = await supabase
          .from('exam_sessions')
          .select('*')
          .eq('id', sessionId)
          .eq('user_id', user.id) // Ensure security
          .single()

        if (sessionError || !sessionData) throw new Error('Không tìm thấy kết quả hoặc không có quyền truy cập')
        setSession(sessionData)

        // 2. Fetch Exam
        const { data: examData } = await supabase
          .from('exam_sets')
          .select('title')
          .eq('id', examId)
          .single()
        setExam(examData)

        // 3. Fetch Exam Answers with Questions
        // Note: We only have access to questions_public via standard query, 
        // to show the correct answer, the PRD says "Bảng từng câu: Đáp án bạn chọn | Đáp án đúng".
        // Wait, correct_answer is hidden in questions_public. How does the student see the correct answer after submitting?
        // Ah! In Step 1 we created `questions_public` that hides correct_answer. If students want to review their exam, they can't see the correct answer unless there is another view or edge function?
        // Wait! The Edge Function `submit-exam` returns correct answers? No, it only returns score and correct_count in PRD.
        // Actually, the `exam_answers` table stores `student_answer` and `is_correct` and `score`. 
        // So they can see IF they are correct. To show the actual correct answer, we might need a function or policy. 
        // Let's check PRD: "Nút Xem lời giải (toggle, render LaTeX)". 
        // `solution` is available in `questions_public`. So they can read the `solution` to know the correct answer. We will just show their answer, whether it's correct (✓/✗), and the solution.
        
        const { data: answersData, error: answersError } = await supabase
          .from('exam_answers')
          .select(`
            question_id,
            student_answer,
            is_correct,
            score,
            questions_public (
              content, question_type, answers, solution
            )
          `)
          .eq('session_id', sessionId)

        if (answersError) throw answersError
        setAnswers(answersData || [])

      } catch (err: any) {
        alert(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [examId, sessionId, supabase])

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
  }

  if (!session) return null

  const isPending = session.grading_status === 'pending'
  
  // Stats
  const correct = answers.filter(a => a.is_correct === true).length
  const incorrect = answers.filter(a => a.is_correct === false && a.student_answer !== null).length
  const skipped = session.total_questions - correct - incorrect

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m} phút ${s} giây`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/practice" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách
        </Link>
        <Link href={`/practice/${examId}/do`} className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
          <RotateCcw className="w-4 h-4 mr-1" />
          Thi lại
        </Link>
      </div>

      {/* Main Score Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8 text-center">
        <div className="bg-blue-600 py-8 px-4 text-white">
          <h1 className="text-2xl font-bold mb-2 opacity-90">{exam?.title}</h1>
          <p className="text-blue-100 text-sm">Kết quả bài làm</p>
        </div>
        
        <div className="py-10 px-4">
          {isPending && (
            <div className="mb-6 inline-flex items-center justify-center bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium border border-orange-200">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Điểm hiện tại (Chưa bao gồm phần Tự luận đang chờ chấm)
            </div>
          )}
          <div className="flex justify-center items-end space-x-2 mb-2">
            <span className="text-7xl font-black text-blue-600 leading-none tracking-tighter">{session.score}</span>
            <span className="text-2xl font-bold text-gray-400 mb-1">/ 10</span>
          </div>
          <p className="text-gray-500 font-medium">Đã hoàn thành lúc: {new Date(session.completed_at).toLocaleString('vi-VN')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border-t divide-x divide-gray-100 bg-gray-50">
          <div className="py-4 px-2">
            <div className="flex items-center justify-center text-green-600 mb-1">
              <CheckCircle2 className="w-5 h-5 mr-1.5" /> <span className="font-bold text-lg">{correct}</span>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Trả lời đúng</p>
          </div>
          <div className="py-4 px-2">
            <div className="flex items-center justify-center text-red-600 mb-1">
              <XCircle className="w-5 h-5 mr-1.5" /> <span className="font-bold text-lg">{incorrect}</span>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Trả lời sai</p>
          </div>
          <div className="py-4 px-2">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <MinusCircle className="w-5 h-5 mr-1.5" /> <span className="font-bold text-lg">{skipped}</span>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Bỏ qua</p>
          </div>
          <div className="py-4 px-2">
            <div className="flex items-center justify-center text-purple-600 mb-1">
              <Clock className="w-5 h-5 mr-1.5" /> <span className="font-bold text-lg">{formatDuration(session.duration_seconds)}</span>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Thời gian làm</p>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <h3 className="text-xl font-bold text-gray-900 mb-4">Chi tiết bài làm</h3>
      <div className="space-y-4">
        {answers.map((ans, idx) => {
          const q = ans.questions_public
          if (!q) return null

          const isExpanded = expandedId === ans.question_id
          const isCorrect = ans.is_correct === true
          const isPendingItem = ans.is_correct === null && q.question_type === 'essay'
          
          let statusIcon = <MinusCircle className="w-6 h-6 text-gray-400" />
          let statusBg = 'bg-gray-50 border-gray-200'
          if (isCorrect) {
            statusIcon = <CheckCircle2 className="w-6 h-6 text-green-500" />
            statusBg = 'bg-green-50 border-green-200'
          } else if (ans.is_correct === false) {
            statusIcon = <XCircle className="w-6 h-6 text-red-500" />
            statusBg = 'bg-red-50 border-red-200'
          } else if (isPendingItem) {
            statusIcon = <Clock className="w-6 h-6 text-orange-500" />
            statusBg = 'bg-orange-50 border-orange-200'
          }

          return (
            <div key={ans.question_id} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-colors ${statusBg}`}>
              <div className="p-4 flex items-start">
                <div className="mr-4 mt-1 bg-white rounded-full p-0.5 shadow-sm">
                  {statusIcon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-bold text-gray-900 text-sm">Câu {idx + 1}</span>
                    <span className="text-xs bg-white/60 px-2 py-0.5 rounded text-gray-600 uppercase">{q.question_type}</span>
                    {isPendingItem && <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-medium">Chờ chấm tự luận</span>}
                  </div>
                  
                  <div className="text-gray-800 text-sm mb-4">
                    <LatexPreview content={q.content} />
                  </div>

                  {/* Student Answer */}
                  <div className="bg-white/60 p-3 rounded-lg text-sm border border-white/40 mb-3">
                    <span className="font-semibold text-gray-600 mb-1 block">Bạn đã trả lời:</span>
                    {ans.student_answer ? (
                      q.question_type === 'tf' ? (
                        <div className="flex space-x-4">
                          {['a','b','c','d'].map(opt => (
                            <div key={opt}>
                              <span className="font-medium uppercase">{opt}:</span> 
                              <span className={ans.student_answer[opt] ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                                {ans.student_answer[opt] ? 'Đúng' : 'Sai'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="font-medium">{String(ans.student_answer)}</span>
                      )
                    ) : (
                      <span className="italic text-gray-400">Không trả lời</span>
                    )}
                  </div>

                  {/* Solution Toggle */}
                  {q.solution && (
                    <div>
                      <button 
                        onClick={() => setExpandedId(isExpanded ? null : ans.question_id)}
                        className="text-blue-600 text-sm font-medium hover:underline focus:outline-none"
                      >
                        {isExpanded ? 'Ẩn lời giải' : 'Xem lời giải chi tiết'}
                      </button>
                      
                      {isExpanded && (
                        <div className="mt-3 p-4 bg-white rounded-lg border border-blue-100 text-sm text-gray-800">
                          <span className="font-bold text-blue-800 mb-2 block">Lời giải:</span>
                          <LatexPreview content={q.solution} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
