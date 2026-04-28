'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase/client'
import QuestionCard from '@/components/QuestionCard'
import CountdownTimer from '@/components/CountdownTimer'
import ExamNavigationPanel from '@/components/ExamNavigationPanel'
import { Loader2, Lock, Flag } from 'lucide-react'

export default function DoExamPage() {
  const params = useParams()
  const examId = params.examId as string
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [loading, setLoading] = useState(true)
  const [examInfo, setExamInfo] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [accessCodeState, setAccessCodeState] = useState<'checking' | 'required' | 'granted'>('checking')
  const [inputCode, setInputCode] = useState('')
  const [codeError, setCodeError] = useState('')
  
  // Test Session State
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [flagged, setFlagged] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Initial Fetch
  useEffect(() => {
    const fetchInit = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login?redirect=/practice/' + examId + '/do')
          return
        }

        const { data: exam, error } = await supabase
          .from('exam_sets')
          .select('id, title, duration_minutes, access_code')
          .eq('id', examId)
          .single()

        if (error) throw error
        setExamInfo(exam)

        if (exam.access_code) {
          setAccessCodeState('required')
        } else {
          setAccessCodeState('granted')
          loadQuestions()
        }
      } catch (err: any) {
        alert('Lỗi: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchInit()
  }, [examId, supabase, router]) // eslint-disable-line react-hooks/exhaustive-deps

  // 2. Load Questions
  const loadQuestions = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('exam_set_questions')
        .select(`
          order_index,
          questions_public (*)
        `)
        .eq('exam_set_id', examId)
        .order('order_index', { ascending: true })

      if (error) throw error

      const qList = (data || []).map(d => d.questions_public).filter(Boolean)
      setQuestions(qList)

      // Restore local storage if exists
      const savedProgress = localStorage.getItem(`exam_progress_${examId}`)
      if (savedProgress) {
        if (confirm('Bạn có bài thi đang làm dở. Bạn có muốn tiếp tục không?')) {
          const parsed = JSON.parse(savedProgress)
          setAnswers(parsed.answers || {})
          setFlagged(parsed.flagged || [])
        } else {
          localStorage.removeItem(`exam_progress_${examId}`)
        }
      }
    } catch (err: any) {
      alert('Không thể tải câu hỏi: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [examId, supabase])

  // 3. Verify Access Code
  const handleVerifyCode = async () => {
    if (!inputCode) return
    setIsSubmitting(true)
    setCodeError('')
    try {
      // Calling Edge Function
      const { data, error } = await supabase.functions.invoke('verify-access-code', {
        body: { exam_set_id: examId, access_code: inputCode }
      })

      if (error || !data?.valid) {
        throw new Error(data?.error || 'Mã không hợp lệ hoặc lỗi kết nối')
      }

      setAccessCodeState('granted')
      loadQuestions()
    } catch (err: any) {
      setCodeError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 4. Handle auto-save
  const handleAutoSave = useCallback(() => {
    if (accessCodeState === 'granted' && questions.length > 0) {
      localStorage.setItem(`exam_progress_${examId}`, JSON.stringify({ answers, flagged }))
    }
  }, [examId, answers, flagged, accessCodeState, questions.length])

  // 5. Submit Exam
  const handleSubmit = async (isTimeUp = false) => {
    const answeredCount = Object.keys(answers).length
    if (!isTimeUp && answeredCount < questions.length) {
      if (!confirm(`Bạn còn ${questions.length - answeredCount} câu chưa làm. Bạn có chắc chắn muốn nộp bài?`)) {
        return
      }
    }

    setIsSubmitting(true)
    try {
      const { data: { session }, error: authErr } = await supabase.auth.getSession()
      if (authErr || !session) throw new Error('Mất phiên đăng nhập')

      const { data, error } = await supabase.functions.invoke('submit-exam', {
        body: {
          exam_set_id: examId,
          answers: answers,
          duration_seconds: examInfo.duration_minutes * 60 // Mocking for now. In real app, track start time.
        }
      })

      if (error) throw error

      // Clean local storage
      localStorage.removeItem(`exam_progress_${examId}`)
      
      // Redirect to results
      router.push(`/practice/${examId}/result/${data.session_id}`)

    } catch (err: any) {
      alert('Lỗi nộp bài: ' + err.message)
      setIsSubmitting(false)
    }
  }

  // Navigation panel handlers
  const handleNavigate = (qId: string) => {
    const el = document.getElementById(`question-${qId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const toggleFlag = (qId: string) => {
    setFlagged(prev => prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId])
  }

  if (loading && accessCodeState === 'checking') {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
  }

  // RENDER MODAL ACCESS CODE
  if (accessCodeState === 'required') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đề thi có mã bảo vệ</h2>
          <p className="text-gray-500 mb-6 text-sm">Vui lòng nhập mã truy cập (Access Code) do giáo viên cung cấp để bắt đầu làm bài.</p>
          
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="Nhập mã (VD: MATH24)"
            className="w-full text-center text-2xl font-mono tracking-widest px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 mb-2 uppercase"
          />
          {codeError && <p className="text-red-500 text-sm font-medium mb-4">{codeError}</p>}
          
          <button
            onClick={handleVerifyCode}
            disabled={!inputCode || isSubmitting}
            className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            Xác nhận & Bắt đầu
          </button>
        </div>
      </div>
    )
  }

  // RENDER EXAM
  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900 line-clamp-1">{examInfo?.title}</h1>
          <p className="text-xs text-gray-500">Lớp {examInfo?.grade} • {questions.length} câu</p>
        </div>
        <CountdownTimer 
          initialSeconds={(examInfo?.duration_minutes || 45) * 60} 
          onTimeUp={() => handleSubmit(true)}
          onAutoSave={handleAutoSave}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: Questions List */}
        <div className="flex-1 space-y-6 w-full">
          {questions.map((q, index) => {
            const isFlagged = flagged.includes(q.id)
            return (
              <div key={q.id} id={`question-${q.id}`} className="relative bg-white rounded-xl shadow-sm border border-gray-200 pt-10">
                {/* Custom header inside the card absolute */}
                <div className="absolute top-0 left-0 right-0 bg-gray-50 border-b rounded-t-xl px-4 py-2 flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-sm">Câu {index + 1}</span>
                  <button 
                    onClick={() => toggleFlag(q.id)}
                    className={`flex items-center text-xs font-medium px-2 py-1 rounded transition-colors ${
                      isFlagged ? 'bg-yellow-100 text-yellow-800' : 'text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 mr-1 ${isFlagged ? 'fill-current' : ''}`} />
                    {isFlagged ? 'Đã đánh dấu' : 'Đánh dấu xem lại'}
                  </button>
                </div>

                <div className="border-t-0 -mt-10 rounded-xl overflow-hidden">
                   {/* We wrap it in a div that resets margin and uses QuestionCard */}
                  <QuestionCard 
                    question={q} 
                    mode="exam" 
                    studentAnswer={answers[q.id]}
                    onAnswerChange={(qId, val) => setAnswers(prev => ({ ...prev, [qId]: val }))}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Right: Navigation Panel (Sticky) */}
        <div className="w-full lg:w-72 lg:sticky lg:top-24 flex-shrink-0">
          <div className="h-[calc(100vh-120px)] lg:h-[600px]">
            <ExamNavigationPanel
              totalQuestions={questions.length}
              answeredQuestions={Object.keys(answers)}
              flaggedQuestions={flagged}
              questionsOrder={questions.map(q => q.id)}
              onSubmit={() => handleSubmit(false)}
              onNavigate={handleNavigate}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
