'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase/client'
import Step1Config from '@/components/ExamBuilder/Step1Config'
import Step2Questions from '@/components/ExamBuilder/Step2Questions'
import Step3Preview from '@/components/ExamBuilder/Step3Preview'
import { Check, ChevronLeft, ChevronRight, Loader2, Save } from 'lucide-react'

export default function CreateExamPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [step, setStep] = useState(1)
  const [examData, setExamData] = useState<any>({
    title: '',
    description: '',
    grade: 10,
    duration_minutes: 45,
    requires_access_code: false,
    access_code: null,
    is_published: false,
    questions: [],
  })
  
  const [isSaving, setIsSaving] = useState(false)

  const updateData = (updates: any) => {
    setExamData((prev: any) => ({ ...prev, ...updates }))
  }

  const handleSave = async (publish: boolean) => {
    if (!examData.title) {
      alert('Vui lòng nhập tiêu đề đề thi')
      setStep(1)
      return
    }

    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Chưa đăng nhập')

      // 1. Insert exam_set
      const { data: newExam, error: examError } = await supabase.from('exam_sets').insert({
        title: examData.title,
        description: examData.description,
        grade: examData.grade,
        duration_minutes: examData.duration_minutes,
        access_code: examData.requires_access_code ? examData.access_code : null,
        is_published: publish,
        created_by: user.id
      }).select().single()

      if (examError) throw examError

      // 2. Insert exam_set_questions
      if (examData.questions.length > 0) {
        const esqPayload = examData.questions.map((q: any, index: number) => ({
          exam_set_id: newExam.id,
          question_id: q.id,
          order_index: index,
          score: 1, // Default 1 point per question
        }))

        const { error: esqError } = await supabase.from('exam_set_questions').insert(esqPayload)
        if (esqError) throw esqError
      }

      router.push('/exams/manage')
    } catch (error: any) {
      alert('Lỗi lưu đề thi: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const steps = [
    { id: 1, name: 'Cấu hình chung' },
    { id: 2, name: 'Chọn câu hỏi' },
    { id: 3, name: 'Xem trước & Xuất bản' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo đề thi mới</h1>
          <p className="text-sm text-gray-500 mt-1">Xây dựng đề thi từ ngân hàng câu hỏi</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Lưu nháp
          </button>
        </div>
      </div>

      {/* Stepper */}
      <nav aria-label="Progress" className="mb-8 flex-shrink-0">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((s) => (
            <li key={s.name} className="md:flex-1">
              <button
                onClick={() => setStep(s.id)}
                className={`group flex w-full flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                  step === s.id 
                    ? 'border-blue-600' 
                    : step > s.id 
                      ? 'border-green-600' 
                      : 'border-gray-200'
                }`}
              >
                <span className={`text-sm font-medium ${
                  step === s.id ? 'text-blue-600' : step > s.id ? 'text-green-600' : 'text-gray-500'
                }`}>
                  Bước {s.id}
                </span>
                <span className="text-sm font-medium text-gray-900">{s.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {step === 1 && <Step1Config data={examData} updateData={updateData} />}
        {step === 2 && <Step2Questions data={examData} updateData={updateData} />}
        {step === 3 && <Step3Preview data={examData} updateData={updateData} />}
      </div>

      {/* Footer Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Quay lại
          </button>
          
          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Tiếp tục
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          ) : (
            <button
              onClick={() => handleSave(examData.is_published)}
              disabled={isSaving}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Check className="w-5 h-5 mr-2" />}
              {examData.is_published ? 'Lưu & Xuất bản' : 'Lưu Đề Thi'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
