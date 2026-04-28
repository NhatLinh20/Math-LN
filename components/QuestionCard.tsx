import React, { useState } from 'react'
import LatexPreview from './LatexPreview'
import { Pencil, Trash2, Eye } from 'lucide-react'

interface QuestionCardProps {
  question: any
  mode: 'view' | 'edit' | 'exam'
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  studentAnswer?: any
  onAnswerChange?: (questionId: string, answer: any) => void
}

export default function QuestionCard({
  question,
  mode,
  onEdit,
  onDelete,
  studentAnswer,
  onAnswerChange,
}: QuestionCardProps) {
  const [showSolution, setShowSolution] = useState(false)

  const handleAnswer = (val: any) => {
    if (onAnswerChange) {
      onAnswerChange(question.id, val)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm">
            {question.question_code || 'Chưa có mã'}
          </span>
          <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
            {question.difficulty}
          </span>
        </div>
        
        {mode === 'edit' && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit && onEdit(question.id)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="Sửa"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete && onDelete(question.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
              title="Xóa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <LatexPreview content={question.content} className="mb-4" />
        
        {question.image_url && (
          <div className="mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={question.image_url} alt="Question figure" className="max-w-full h-auto rounded" />
          </div>
        )}

        {/* Answers Interaction based on Mode */}
        {mode === 'exam' ? (
          <div className="mt-4 space-y-3">
            {question.question_type === 'mcq' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['A', 'B', 'C', 'D'].map((label, idx) => (
                  <label key={label} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      value={label}
                      checked={studentAnswer === label}
                      onChange={(e) => handleAnswer(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium text-gray-700">{label}.</span>
                    <LatexPreview content={question.answers?.[idx] || ''} />
                  </label>
                ))}
              </div>
            )}

            {question.question_type === 'tf' && (
              <div className="space-y-3">
                {['a', 'b', 'c', 'd'].map((item, idx) => (
                  <div key={item} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 flex items-center space-x-2">
                      <span className="font-medium text-gray-700">{item.toUpperCase()}.</span>
                      <LatexPreview content={question.answers?.[idx] || ''} />
                    </div>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="radio"
                          name={`tf-${question.id}-${item}`}
                          checked={studentAnswer?.[item] === true}
                          onChange={() => handleAnswer({ ...studentAnswer, [item]: true })}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-sm font-medium">Đúng</span>
                      </label>
                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="radio"
                          name={`tf-${question.id}-${item}`}
                          checked={studentAnswer?.[item] === false}
                          onChange={() => handleAnswer({ ...studentAnswer, [item]: false })}
                          className="w-4 h-4 text-red-600"
                        />
                        <span className="text-sm font-medium">Sai</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {question.question_type === 'short' && (
              <div>
                <input
                  type="text"
                  placeholder="Nhập đáp án của bạn..."
                  value={studentAnswer || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {question.question_type === 'essay' && (
              <div>
                <textarea
                  rows={4}
                  placeholder="Nhập bài làm tự luận..."
                  value={studentAnswer || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        ) : (
          /* View / Edit Mode: Show Answers visually (but no correct_answer exposed) */
          <div className="mt-4">
            {question.question_type === 'mcq' && question.answers && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                {['A', 'B', 'C', 'D'].map((label, idx) => (
                  <div key={label} className="flex space-x-2">
                    <span className="font-medium">{label}.</span>
                    <LatexPreview content={question.answers[idx] || ''} />
                  </div>
                ))}
              </div>
            )}
            
            {question.question_type === 'tf' && question.answers && (
              <div className="space-y-2 text-gray-700">
                {['a', 'b', 'c', 'd'].map((label, idx) => (
                  <div key={label} className="flex space-x-2">
                    <span className="font-medium">{label.toUpperCase()}.</span>
                    <LatexPreview content={question.answers[idx] || ''} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View Mode: Solution Toggle */}
        {mode === 'view' && question.solution && (
          <div className="mt-6 border-t pt-4">
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showSolution ? 'Ẩn lời giải' : 'Xem lời giải chi tiết'}
            </button>
            
            {showSolution && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <span className="font-semibold block mb-2 text-blue-800">Lời giải chi tiết:</span>
                <LatexPreview content={question.solution} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
