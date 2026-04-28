'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save, CheckCircle, XCircle, Clock } from 'lucide-react'
import LatexPreview from '@/components/LatexPreview'

export default function GradingPage() {
  const params = useParams()
  const examId = params.id as string
  const sessionId = params.sessionId as string
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [answers, setAnswers] = useState<any[]>([])
  
  // State to hold manual grades for essays: { answerId: { score: number, is_correct: boolean } }
  const [grades, setGrades] = useState<Record<string, { score: number, is_correct: boolean }>>({})

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch session
        const { data: sessionData, error: sessionError } = await supabase
          .from('exam_sessions')
          .select('*, profiles(full_name)')
          .eq('id', sessionId)
          .single()

        if (sessionError) throw sessionError
        setSession(sessionData)

        // Fetch answers with full question data (teachers can read 'questions' directly)
        const { data: answersData, error: answersError } = await supabase
          .from('exam_answers')
          .select(`
            id, question_id, student_answer, is_correct, score,
            questions ( content, question_type, solution )
          `)
          .eq('session_id', sessionId)

        if (answersError) throw answersError
        setAnswers(answersData || [])

        // Initialize grades state for pending essay questions
        const initialGrades: Record<string, any> = {}
        answersData?.forEach((ans: any) => {
          if (ans.questions?.question_type === 'essay') {
            initialGrades[ans.id] = {
              score: ans.score || 0,
              is_correct: ans.is_correct || false
            }
          }
        })
        setGrades(initialGrades)

      } catch (err: any) {
        alert('Lỗi tải dữ liệu: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSessionData()
  }, [sessionId, supabase])

  const handleGradeChange = (ansId: string, field: 'score' | 'is_correct', value: any) => {
    setGrades(prev => ({
      ...prev,
      [ansId]: { ...prev[ansId], [field]: value }
    }))
  }

  const handleSaveGrades = async () => {
    setSaving(true)
    try {
      // 1. Update exam_answers
      const updates = Object.keys(grades).map(ansId => ({
        id: ansId,
        score: grades[ansId].score,
        is_correct: grades[ansId].is_correct
      }))

      for (const update of updates) {
        const { error } = await supabase
          .from('exam_answers')
          .update({ score: update.score, is_correct: update.is_correct })
          .eq('id', update.id)
        if (error) throw error
      }

      // 2. Recalculate total session score
      // Score = sum of all ans.score for this session
      // But we only updated the essay scores. Let's fetch all answers again or calculate locally
      let totalScore = 0
      answers.forEach(ans => {
        if (ans.questions?.question_type === 'essay') {
          totalScore += Number(grades[ans.id].score)
        } else {
          totalScore += Number(ans.score || 0)
        }
      })

      // 3. Update exam_sessions (update score and set grading_status = 'graded')
      const { error: sessionError } = await supabase
        .from('exam_sessions')
        .update({
          score: totalScore,
          grading_status: 'graded'
        })
        .eq('id', sessionId)

      if (sessionError) throw sessionError

      alert('Chấm điểm thành công!')
      router.push(`/exams/${examId}/results`)

    } catch (err: any) {
      alert('Lỗi lưu điểm: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
  }

  const essayAnswers = answers.filter(a => a.questions?.question_type === 'essay')
  const otherAnswers = answers.filter(a => a.questions?.question_type !== 'essay')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <div>
          <Link href={`/exams/${examId}/results`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại Danh sách nộp bài
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Chấm điểm: {(session?.profiles as any)?.full_name || 'Học sinh'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Trạng thái hiện tại: {session?.grading_status === 'pending' ? 'Cần chấm tự luận' : 'Đã chấm xong'}</p>
        </div>
        <button
          onClick={handleSaveGrades}
          disabled={saving || essayAnswers.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Hoàn tất chấm điểm
        </button>
      </div>

      {essayAnswers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500">
          Bài làm này không có câu hỏi tự luận nào cần chấm.
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-500" /> Phần Tự Luận
          </h2>
          {essayAnswers.map((ans, idx) => {
            const q = ans.questions
            return (
              <div key={ans.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Câu tự luận {idx + 1}</span>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 text-sm font-medium">
                      <span>Điểm số:</span>
                      <input 
                        type="number" 
                        min="0" max="10" step="0.25"
                        value={grades[ans.id]?.score || 0}
                        onChange={e => handleGradeChange(ans.id, 'score', parseFloat(e.target.value))}
                        className="w-20 px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500 text-center"
                      />
                    </label>
                    <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={grades[ans.id]?.is_correct || false}
                        onChange={e => handleGradeChange(ans.id, 'is_correct', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Đánh dấu là Đúng</span>
                    </label>
                  </div>
                </div>
                
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Question & Student Answer */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Đề bài</h3>
                    <div className="bg-gray-50 p-3 rounded mb-4 text-sm"><LatexPreview content={q.content} /></div>
                    
                    <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">Bài làm của học sinh</h3>
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg min-h-[100px] whitespace-pre-wrap text-sm text-gray-800">
                      {ans.student_answer || <span className="text-gray-400 italic">Học sinh bỏ trống</span>}
                    </div>
                  </div>

                  {/* Right: Correct Solution */}
                  <div className="border-l md:pl-6 border-gray-100">
                    <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-2">Đáp án / Bareme</h3>
                    <div className="bg-green-50/50 border border-green-100 p-4 rounded-lg min-h-[100px] text-sm text-gray-800">
                      {q.solution ? <LatexPreview content={q.solution} /> : <span className="text-gray-400 italic">Không có đáp án chi tiết</span>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Other Questions Preview */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> Trắc nghiệm (Tự động chấm)
        </h2>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Câu hỏi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Học sinh chọn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kết quả</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {otherAnswers.map((ans, idx) => (
                <tr key={ans.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Câu {idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">{ans.questions?.question_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[200px]">
                    {JSON.stringify(ans.student_answer)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ans.is_correct ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{ans.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
