import React from 'react'
import { RefreshCcw, Copy, CheckCircle2 } from 'lucide-react'

interface Step1Props {
  data: any
  updateData: (updates: any) => void
}

export default function Step1Config({ data, updateData }: Step1Props) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    if (data.access_code) {
      navigator.clipboard.writeText(data.access_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    updateData({ access_code: code })
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-6 border-b pb-2">Bước 1: Thông tin Đề thi</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Tiêu đề đề thi <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={data.title || ''}
            onChange={e => updateData({ title: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="VD: Đề kiểm tra 1 tiết Đại số 10..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mô tả (tùy chọn)</label>
          <textarea
            value={data.description || ''}
            onChange={e => updateData({ description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Mô tả nội dung, lưu ý..."
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Khối lớp <span className="text-red-500">*</span></label>
            <select
              value={data.grade || 10}
              onChange={e => updateData({ grade: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={10}>Lớp 10</option>
              <option value={11}>Lớp 11</option>
              <option value={12}>Lớp 12</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thời gian làm bài (phút) <span className="text-red-500">*</span></label>
            <input
              type="number"
              min={1}
              value={data.duration_minutes || 45}
              onChange={e => updateData({ duration_minutes: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.requires_access_code || false}
              onChange={e => {
                const checked = e.target.checked
                updateData({
                  requires_access_code: checked,
                  access_code: checked ? (data.access_code || 'MATH24') : null
                })
              }}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="font-medium text-gray-800">Yêu cầu mã truy cập (Access Code)</span>
          </label>

          {data.requires_access_code && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between border">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Mã truy cập hiện tại</p>
                <p className="text-2xl font-mono font-bold tracking-widest text-blue-700">{data.access_code}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-500 hover:bg-gray-200 rounded"
                  title="Copy mã"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
                <button
                  onClick={generateCode}
                  className="p-2 text-gray-500 hover:bg-gray-200 rounded"
                  title="Tạo mã mới ngẫu nhiên"
                >
                  <RefreshCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
