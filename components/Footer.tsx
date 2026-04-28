import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">Giới thiệu</a>
            <a href="#" className="text-gray-400 hover:text-gray-500">Hướng dẫn</a>
            <a href="#" className="text-gray-400 hover:text-gray-500">Liên hệ</a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center md:text-left text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Math-LN. Nền tảng luyện thi Toán THPT chuyên nghiệp.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
