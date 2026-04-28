'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@/lib/supabase/client'
import { BookOpen, CheckCircle, Users, BarChart, ArrowRight, BrainCircuit } from 'lucide-react'

export default function HomePage() {
  const supabase = createClientComponentClient()
  const [stats, setStats] = useState({ questions: 0, students: 0, exams: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch questions count
        const { count: qCount } = await supabase.from('questions_public').select('*', { count: 'exact', head: true })
        // Fetch students count
        const { count: sCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student')
        // Fetch exams count
        const { count: eCount } = await supabase.from('exam_sets').select('*', { count: 'exact', head: true }).eq('is_published', true)

        setStats({
          questions: qCount || 0,
          students: sCount || 0,
          exams: eCount || 0
        })
      } catch (err) {
        console.error(err)
      }
    }
    fetchStats()
  }, [supabase])

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-800/50 border border-blue-700/50 text-blue-200 text-sm font-medium mb-6">
              <BrainCircuit className="w-4 h-4 mr-2" /> Nền tảng học tập thế hệ mới
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Luyện toán thông minh <br className="hidden md:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Chinh phục kỳ thi
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
              Ngân hàng câu hỏi bám sát chương trình GDPT 2018. Luyện thi mọi lúc, mọi nơi với hệ thống phân tích kết quả chuyên sâu dành riêng cho bạn.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/practice" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-xl text-blue-900 bg-white hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl">
                Bắt đầu luyện thi <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/register" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-xl text-white bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 transition-colors backdrop-blur-sm">
                Đăng ký tài khoản
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.83,120.3,192.5,107.5,238.41,98,280.9,78.27,321.39,56.44Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </section>

      {/* 2. Realtime Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto w-14 h-14 bg-blue-100 text-blue-600 flex items-center justify-center rounded-2xl mb-4">
                <BookOpen className="w-7 h-7" />
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">{stats.questions.toLocaleString()}+</p>
              <p className="text-gray-500 font-medium">Câu hỏi chất lượng</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto w-14 h-14 bg-purple-100 text-purple-600 flex items-center justify-center rounded-2xl mb-4">
                <CheckCircle className="w-7 h-7" />
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">{stats.exams.toLocaleString()}</p>
              <p className="text-gray-500 font-medium">Đề thi sẵn sàng</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto w-14 h-14 bg-green-100 text-green-600 flex items-center justify-center rounded-2xl mb-4">
                <Users className="w-7 h-7" />
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">{stats.students.toLocaleString()}</p>
              <p className="text-gray-500 font-medium">Học sinh tham gia</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nền tảng của chúng tôi có gì?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Được thiết kế chuyên biệt để giúp học sinh nâng cao điểm số Toán học một cách hiệu quả nhất.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 flex items-center justify-center rounded-full mb-6">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ngân hàng chuẩn GDPT 2018</h3>
              <p className="text-gray-600 leading-relaxed">
                Hệ thống hàng ngàn câu hỏi được phân loại chi tiết theo từng chương, bài, dạng toán và mức độ N-H-V-C bám sát sách giáo khoa mới.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-purple-50 text-purple-600 flex items-center justify-center rounded-full mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Luyện thi & Chấm tự động</h3>
              <p className="text-gray-600 leading-relaxed">
                Trải nghiệm làm bài thi trực tuyến như thật với đồng hồ đếm ngược. Chấm điểm ngay lập tức với các câu hỏi trắc nghiệm và điền khuyết.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-green-50 text-green-600 flex items-center justify-center rounded-full mb-6">
                <BarChart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Phân tích kết quả chuyên sâu</h3>
              <p className="text-gray-600 leading-relaxed">
                Biết ngay điểm yếu, điểm mạnh qua các bảng thống kê trực quan. Xem lại lời giải chi tiết cho từng câu để rút kinh nghiệm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA Section */}
      <section className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Sẵn sàng nâng cao điểm số của bạn?</h2>
          <p className="text-blue-100 text-lg mb-10">Đăng ký tài khoản miễn phí ngay hôm nay để trải nghiệm toàn bộ tính năng tuyệt vời của Math-LN.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/register" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-xl text-blue-700 bg-white hover:bg-gray-50 transition-colors shadow-lg">
              Tạo tài khoản miễn phí
            </Link>
            <Link href="/unauthorized" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-xl text-white bg-blue-700 hover:bg-blue-800 transition-colors border border-blue-500">
              Tôi là Giáo viên
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
