import React from 'react'

interface ExamNavigationPanelProps {
  totalQuestions: number
  answeredQuestions: string[] // Array of question IDs that have been answered
  flaggedQuestions: string[]  // Array of question IDs that are flagged
  questionsOrder: string[]    // The ordered array of question IDs
  onSubmit: () => void
  onNavigate: (questionId: string) => void
  isSubmitting?: boolean
}

export default function ExamNavigationPanel({
  totalQuestions,
  answeredQuestions,
  flaggedQuestions,
  questionsOrder,
  onSubmit,
  onNavigate,
  isSubmitting = false
}: ExamNavigationPanelProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
      <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Danh sách câu hỏi</h3>
      
      <div className="flex-1 overflow-y-auto mb-6">
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {questionsOrder.map((qId, index) => {
            const isAnswered = answeredQuestions.includes(qId)
            const isFlagged = flaggedQuestions.includes(qId)
            const num = index + 1

            let baseClass = "w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors border cursor-pointer hover:opacity-80"
            
            if (isFlagged) {
              baseClass += " bg-yellow-100 text-yellow-800 border-yellow-300"
            } else if (isAnswered) {
              baseClass += " bg-green-500 text-white border-green-600 shadow-sm"
            } else {
              baseClass += " bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }

            return (
              <button
                key={qId}
                onClick={() => onNavigate(qId)}
                className={baseClass}
                title={`Đi đến câu ${num}`}
              >
                {num}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-auto space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-600 pb-4 border-b">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-green-500 border border-green-600"></span>
            <span>Đã làm</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-300"></span>
            <span>Đánh dấu</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-white border border-gray-300"></span>
            <span>Chưa làm</span>
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Đang nộp bài...' : 'Nộp bài thi'}
        </button>
      </div>
    </div>
  )
}
