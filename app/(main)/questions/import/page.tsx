'use client'

import React, { useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import { Upload, FileJson, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ImportQuestionsPage() {
  const supabase = createClientComponentClient()
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ success: number; failed: number; errors: any[] } | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)
    setResult(null)
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        if (Array.isArray(json)) {
          setPreviewData(json.slice(0, 10)) // Preview top 10
        } else {
          alert('File JSON phải chứa một mảng các câu hỏi.')
        }
      } catch (err) {
        alert('File không đúng định dạng JSON.')
      }
    }
    reader.readAsText(selected)
  }

  const handleImport = async () => {
    if (!file) return
    setIsProcessing(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Chưa đăng nhập')

      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string)
          if (!Array.isArray(json)) throw new Error('Format error')

          let successCount = 0
          let failedCount = 0
          const errors = []

          // We should ideally insert in bulk, but to capture individual errors for feedback
          // and to ensure unique question_code generation logic if needed, we might do chunking.
          // For simplicity and to follow PRD directly, we bulk insert.
          
          const payloads = json.map((q: any) => ({
            ...q,
            created_by: user.id,
            is_published: q.is_published ?? true,
            is_inline: q.is_inline ?? false,
          }))

          // Perform bulk insert
          const { data, error } = await supabase.from('questions').insert(payloads).select('id')
          
          if (error) {
            failedCount = payloads.length
            errors.push(error.message)
          } else {
            successCount = data?.length || 0
          }

          setResult({ success: successCount, failed: failedCount, errors })
        } catch (err: any) {
          setResult({ success: 0, failed: 1, errors: [err.message] })
        } finally {
          setIsProcessing(false)
        }
      }
      reader.readAsText(file)
    } catch (err: any) {
      alert('Lỗi hệ thống: ' + err.message)
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <Link href="/questions" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại Ngân hàng
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Import Câu hỏi (JSON)</h1>
        <p className="text-sm text-gray-500 mt-1">Hàng loạt câu hỏi từ file JSON có cấu trúc chuẩn.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {!result ? (
          <>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
              <FileJson className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-sm text-gray-600 mb-4">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Chọn file JSON</span>
                  <input type="file" accept=".json" className="sr-only" onChange={handleFileSelect} />
                </label>
                <p className="pl-1 mt-1">hoặc kéo thả vào đây</p>
              </div>
              {file && <p className="text-sm text-green-600 font-medium">Đã chọn: {file.name}</p>}
            </div>

            {previewData.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Preview (10 dòng đầu)</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã CH</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData.map((q, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 whitespace-nowrap font-mono text-gray-500">{q.question_code || 'Tự động'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-900">{q.grade}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-500 uppercase">{q.question_type}</td>
                          <td className="px-4 py-3 text-gray-900 truncate max-w-xs">{q.content}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleImport}
                    disabled={isProcessing}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang Import...</>
                    ) : (
                      <><Upload className="w-5 h-5 mr-2" /> Import tất cả</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Hoàn Tất</h2>
            <div className="inline-block text-left bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <p className="text-green-700 font-medium">✅ Thành công: {result.success} câu hỏi</p>
              {result.failed > 0 && (
                <p className="text-red-600 font-medium mt-2">❌ Lỗi: {result.failed} câu hỏi</p>
              )}
            </div>
            
            {result.errors.length > 0 && (
              <div className="text-left bg-red-50 p-4 rounded-lg text-sm text-red-600 overflow-auto max-h-40 mb-6">
                <p className="font-semibold flex items-center mb-2"><AlertCircle className="w-4 h-4 mr-1" /> Chi tiết lỗi:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {result.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}

            <button
              onClick={() => { setResult(null); setFile(null); setPreviewData([]) }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Tiếp tục Import
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
