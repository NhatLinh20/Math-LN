import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'

export const metadata = {
  title: 'Truy cập bị từ chối | Math-LN',
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <ShieldAlert className="w-12 h-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Truy cập bị từ chối
        </h1>
        
        <p className="text-gray-600 mb-8">
          Bạn cần tài khoản giáo viên để truy cập tính năng này. Vui lòng liên hệ quản trị viên để được cấp quyền.
        </p>

        <Link 
          href="/"
          className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  )
}
