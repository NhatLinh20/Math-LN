'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { GRADES, SUBJECT_TYPES, DIFFICULTY, TAXONOMY, generateQuestionId } from '@/lib/question-taxonomy'
import LatexPreview from './LatexPreview'
import { X, Upload, Loader2, Plus, Minus } from 'lucide-react'

// Schemas
const baseSchema = z.object({
  id: z.string().optional(),
  grade: z.number().min(10).max(12),
  subject_id: z.string().min(1),
  chapter_id: z.number(),
  lesson_id: z.number(),
  form_id: z.number(),
  difficulty: z.string().min(1),
  content: z.string().min(1, 'Nội dung không được để trống'),
  solution: z.string().optional(),
  tags: z.string().optional(),
})

const mcqSchema = baseSchema.extend({
  question_type: z.literal('mcq'),
  answers: z.array(z.string().min(1, 'Nhập nội dung đáp án')).length(4),
  correct_answer: z.string().min(1, 'Chọn đáp án đúng'),
})

const tfSchema = baseSchema.extend({
  question_type: z.literal('tf'),
  answers: z.array(z.string().min(1, 'Nhập nội dung ý')).length(4),
  correct_answer: z.object({
    a: z.boolean(),
    b: z.boolean(),
    c: z.boolean(),
    d: z.boolean(),
  }),
})

const shortSchema = baseSchema.extend({
  question_type: z.literal('short'),
  correct_answer: z.array(z.string().min(1, 'Nhập đáp án chấp nhận được')).min(1),
})

const essaySchema = baseSchema.extend({
  question_type: z.literal('essay'),
})

const formSchema = z.discriminatedUnion('question_type', [
  mcqSchema, tfSchema, shortSchema, essaySchema
])

type FormData = z.infer<typeof formSchema>

interface QuestionFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingId?: string | null
}

export default function QuestionFormModal({ isOpen, onClose, onSuccess, editingId }: QuestionFormModalProps) {
  const supabase = createClientComponentClient()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question_type: 'mcq',
      grade: 10,
      subject_id: 'D',
      answers: ['', '', '', ''],
      correct_answer: 'A',
    } as any
  })

  const { fields: shortAnswerFields, append: appendShort, remove: removeShort } = useFieldArray({
    control,
    name: 'correct_answer' as never,
  })

  const watchedData = watch()

  // Fetch data if editing
  useEffect(() => {
    if (isOpen && editingId) {
      setIsLoading(true)
      supabase.from('questions').select('*').eq('id', editingId).single()
        .then(({ data }) => {
          if (data) {
            let parsedAnswers = data.answers
            let parsedCorrect = data.correct_answer

            const formData: any = {
              id: data.id,
              question_type: data.question_type,
              grade: data.grade,
              subject_id: data.subject_id,
              chapter_id: data.chapter_id,
              lesson_id: data.lesson_id,
              form_id: data.form_id,
              difficulty: data.difficulty,
              content: data.content,
              solution: data.solution || '',
              tags: data.tags ? data.tags.join(', ') : '',
            }

            if (data.question_type === 'mcq') {
              formData.answers = parsedAnswers || ['', '', '', '']
              formData.correct_answer = parsedCorrect || 'A'
            } else if (data.question_type === 'tf') {
              formData.answers = parsedAnswers || ['', '', '', '']
              formData.correct_answer = parsedCorrect || { a: true, b: false, c: false, d: false }
            } else if (data.question_type === 'short') {
              formData.correct_answer = parsedCorrect || ['']
            }

            reset(formData)
            setExistingImageUrl(data.image_url)
          }
          setIsLoading(false)
        })
    } else if (isOpen) {
      // Reset for create
      reset({
        question_type: 'mcq',
        grade: 10,
        subject_id: 'D',
        answers: ['', '', '', ''],
        correct_answer: 'A',
      } as any)
      setImageFile(null)
      setExistingImageUrl(null)
    }
  }, [isOpen, editingId, reset, supabase])

  // Clear children when parent changes
  useEffect(() => {
    setValue('chapter_id', 0)
    setValue('lesson_id', 0)
    setValue('form_id', 0)
  }, [watchedData.grade, watchedData.subject_id, setValue])

  useEffect(() => {
    setValue('lesson_id', 0)
    setValue('form_id', 0)
  }, [watchedData.chapter_id, setValue])

  useEffect(() => {
    setValue('form_id', 0)
  }, [watchedData.lesson_id, setValue])


  if (!isOpen) return null

  // Taxonomy logic
  const availableChapters = (watchedData.grade && watchedData.subject_id) ? (TAXONOMY[watchedData.grade]?.[watchedData.subject_id] || []) : []
  const selectedChapterObj = availableChapters.find(c => c.id === watchedData.chapter_id)
  const availableLessons = selectedChapterObj?.lessons || []
  const selectedLessonObj = availableLessons.find(l => l.id === watchedData.lesson_id)
  const availableForms = selectedLessonObj?.forms || []

  const previewCode = generateQuestionId(
    watchedData.grade,
    watchedData.subject_id,
    watchedData.chapter_id,
    watchedData.difficulty,
    watchedData.lesson_id,
    watchedData.form_id
  )

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Chưa đăng nhập')

      let imageUrl = existingImageUrl

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('question-images')
          .upload(filePath, imageFile)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('question-images')
          .getPublicUrl(filePath)
        
        imageUrl = publicUrlData.publicUrl
      }

      const tagsArray = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : []

      const payload: any = {
        question_type: data.question_type,
        grade: data.grade,
        subject_id: data.subject_id,
        chapter_id: data.chapter_id,
        lesson_id: data.lesson_id,
        form_id: data.form_id,
        difficulty: data.difficulty,
        content: data.content,
        solution: data.solution,
        tags: tagsArray,
        image_url: imageUrl,
        is_published: true, // Auto publish for now
        is_inline: false,
        question_code: previewCode, // Only used when insert, we might need a better logic for sequence
      }

      if (data.question_type === 'mcq') {
        payload.answers = data.answers
        payload.correct_answer = data.correct_answer
      } else if (data.question_type === 'tf') {
        payload.answers = data.answers
        payload.correct_answer = data.correct_answer
      } else if (data.question_type === 'short') {
        payload.correct_answer = data.correct_answer
      }

      if (editingId) {
        // Exclude unique question_code from update to avoid collision if unchanged
        delete payload.question_code
        const { error } = await supabase.from('questions').update(payload).eq('id', editingId)
        if (error) throw error
      } else {
        // When inserting, we need to handle question_code collision (append -1, -2, etc)
        // Simplified for this version: let Postgres handle unique constraint and catch it
        payload.created_by = user.id
        
        // Count existing to generate suffix
        const { count } = await supabase.from('questions')
          .select('*', { count: 'exact', head: true })
          .like('question_code', `${previewCode}%`)
        
        if (count !== null) {
          payload.question_code = `${previewCode}-${count + 1}`
        } else {
          payload.question_code = `${previewCode}-1`
        }

        const { error } = await supabase.from('questions').insert(payload)
        if (error) throw error
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      alert('Lỗi: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5">
            <form id="question-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* SECTION A: Phân loại & Nội dung */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">A. Phân loại & Nội dung</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Khối lớp</label>
                    <select {...register('grade', { valueAsNumber: true })} className="w-full p-2 border rounded-md">
                      {GRADES.map(g => <option key={g} value={g}>Lớp {g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Môn học</label>
                    <select {...register('subject_id')} className="w-full p-2 border rounded-md">
                      {Object.keys(SUBJECT_TYPES).map(s => <option key={s} value={s}>{SUBJECT_TYPES[s as keyof typeof SUBJECT_TYPES]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Chương</label>
                    <select {...register('chapter_id', { valueAsNumber: true })} className="w-full p-2 border rounded-md">
                      <option value={0}>Chọn chương...</option>
                      {availableChapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bài học</label>
                    <select {...register('lesson_id', { valueAsNumber: true })} className="w-full p-2 border rounded-md">
                      <option value={0}>Chọn bài...</option>
                      {availableLessons.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Dạng bài</label>
                    <select {...register('form_id', { valueAsNumber: true })} className="w-full p-2 border rounded-md">
                      <option value={0}>Chọn dạng...</option>
                      {availableForms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mức độ</label>
                    <select {...register('difficulty')} className="w-full p-2 border rounded-md">
                      {Object.entries(DIFFICULTY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Loại câu hỏi</label>
                    <select {...register('question_type')} className="w-full p-2 border rounded-md font-semibold text-blue-700 bg-blue-50">
                      <option value="mcq">Trắc nghiệm (MCQ)</option>
                      <option value="tf">Đúng/Sai (TF)</option>
                      <option value="short">Trả lời ngắn</option>
                      <option value="essay">Tự luận</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg text-sm border flex items-center justify-between">
                  <span className="text-gray-600">Mã xem trước (Prefix):</span>
                  <span className="font-mono font-bold text-gray-900">{previewCode}-X</span>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nội dung câu hỏi</label>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <textarea 
                      {...register('content')} 
                      rows={5} 
                      className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm" 
                      placeholder="Nhập nội dung (hỗ trợ $LaTeX$)..."
                    />
                    <div className="p-3 border rounded-md bg-gray-50 overflow-y-auto max-h-[140px]">
                      <div className="text-xs text-gray-400 mb-2 font-semibold">PREVIEW:</div>
                      <LatexPreview content={watchedData.content || ''} />
                    </div>
                  </div>
                  {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
                </div>
              </div>

              {/* SECTION B: Đáp án */}
              {watchedData.question_type !== 'essay' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">B. Đáp án</h3>
                  
                  {watchedData.question_type === 'mcq' && (
                    <div className="space-y-3">
                      {['A', 'B', 'C', 'D'].map((opt, idx) => (
                        <div key={opt} className="flex items-start space-x-3">
                          <input 
                            type="radio" 
                            {...register('correct_answer' as any)} 
                            value={opt} 
                            className="mt-3 w-4 h-4" 
                          />
                          <span className="mt-2 font-bold">{opt}.</span>
                          <textarea 
                            {...register(`answers.${idx}` as any)} 
                            rows={1}
                            className="flex-1 p-2 border rounded-md font-mono text-sm" 
                            placeholder={`Nội dung ${opt}...`}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {watchedData.question_type === 'tf' && (
                    <div className="space-y-3">
                      {['a', 'b', 'c', 'd'].map((opt, idx) => (
                        <div key={opt} className="flex items-center space-x-3">
                          <span className="font-bold w-6">{opt.toUpperCase()}.</span>
                          <input 
                            {...register(`answers.${idx}` as any)} 
                            className="flex-1 p-2 border rounded-md font-mono text-sm" 
                            placeholder={`Nội dung ý ${opt}...`}
                          />
                          <select {...register(`correct_answer.${opt}` as any)} className="p-2 border rounded-md">
                            <option value="true">Đúng</option>
                            <option value="false">Sai</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  )}

                  {watchedData.question_type === 'short' && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Thêm các cách viết đáp án được chấp nhận (vd: "1/2", "0.5")</p>
                      {shortAnswerFields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-2">
                          <input
                            {...register(`correct_answer.${index}` as any)}
                            className="flex-1 p-2 border rounded-md"
                            placeholder="Nhập đáp án đúng..."
                          />
                          <button type="button" onClick={() => removeShort(index)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => appendShort('')} className="flex items-center text-blue-600 text-sm mt-2 font-medium">
                        <Plus className="w-4 h-4 mr-1" /> Thêm đáp án chấp nhận
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION C: Mở rộng */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">C. Lời giải & Hình ảnh</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Lời giải chi tiết</label>
                  <textarea 
                    {...register('solution')} 
                    rows={4} 
                    className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm" 
                    placeholder="Nhập lời giải..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ảnh minh họa</label>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Upload className="w-4 h-4 mr-2" />
                      Tải ảnh lên
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    </label>
                    {imageFile && <span className="text-sm text-blue-600">{imageFile.name}</span>}
                    {!imageFile && existingImageUrl && (
                      <div className="flex items-center">
                        <span className="text-sm text-green-600 mr-2">Đã có ảnh</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={existingImageUrl} alt="Preview" className="h-10 w-auto rounded border" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tags (cách nhau dấu phẩy)</label>
                  <input {...register('tags')} className="w-full p-2 border rounded-md" placeholder="vd: thi_thu, hk1..." />
                </div>
              </div>

            </form>
          </div>
        )}

        <div className="p-5 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 font-medium">
            Hủy
          </button>
          <button 
            type="submit" 
            form="question-form"
            disabled={isSubmitting || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            Lưu câu hỏi
          </button>
        </div>
      </div>
    </div>
  )
}
