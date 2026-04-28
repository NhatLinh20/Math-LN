import React from 'react'
import QuestionCard from '../QuestionCard'

interface Step3Props {
  data: any
  updateData: (updates: any) => void
}

export default function Step3Preview({ data, updateData }: Step3Props) {
  const questions = data.questions || []

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{data.title || 'Chưa có tiêu đề'}</h2>
        {data.description && <p className="text-gray-600 mb-4">{data.description}</p>}
        
        <div className="flex justify-center items-center space-x-6 text-sm text-gray-500 font-medium">
          <span className="bg-gray-100 px-3 py-1 rounded-full">Lớp: {data.grade || 10}</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">Thời gian: {data.duration_minutes || 45} phút</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">Số câu: {questions.length}</span>
        </div>

        {data.requires_access_code && data.access_code && (
          <div className="mt-6 inline-block bg-blue-50 border border-blue-200 text-blue-800 px-6 py-3 rounded-lg">
            <span className="block text-xs uppercase tracking-wider mb-1 font-semibold">Mã truy cập đề thi</span>
            <span className="text-3xl font-mono font-bold tracking-widest">{data.access_code}</span>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h3 className="font-semibold text-lg">Cấu hình xuất bản</h3>
          <label className="flex items-center space-x-3 cursor-pointer">
            <span className={`font-medium ${data.is_published ? 'text-green-600' : 'text-gray-500'}`}>
              {data.is_published ? 'Đã xuất bản (Học sinh có thể thấy)' : 'Bản nháp (Đang ẩn)'}
            </span>
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.is_published ? 'bg-green-500' : 'bg-gray-300'}`}>
              <input
                type="checkbox"
                className="sr-only"
                checked={data.is_published || false}
                onChange={(e) => updateData({ is_published: e.target.checked })}
              />
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.is_published ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </label>
        </div>

        <div className="space-y-6">
          <h3 className="font-semibold text-lg">Xem trước nội dung đề</h3>
          {questions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có câu hỏi nào.</p>
          ) : (
            questions.map((q: any, idx: number) => (
              <div key={q.id} className="relative">
                <div className="absolute -left-3 top-3 w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold shadow-sm z-10 border-2 border-white">
                  {idx + 1}
                </div>
                <div className="ml-4">
                  <QuestionCard question={q} mode="exam" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
