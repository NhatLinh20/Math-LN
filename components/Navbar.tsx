'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase/client'
import { LogOut, User as UserIcon, Menu, X, BookOpen, GraduationCap } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()
  
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        setProfile(data)
      }
    }
    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => setProfile(data))
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin'

  const navigation = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Ngân hàng CH', href: '/questions', show: true },
    { name: 'Luyện thi', href: '/practice', show: true },
    { name: 'Lịch sử', href: '/practice/history', show: !!user && !isTeacher },
    { name: 'Quản lý đề', href: '/exams/manage', show: isTeacher },
  ].filter(item => item.show !== false)

  const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(path))

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 shadow-sm group-hover:bg-blue-700 transition-colors">
                <span className="text-white font-bold text-xl leading-none">∫</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Math<span className="text-blue-600">LN</span></span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'border-blue-600 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {!user ? (
              <>
                <Link href="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                  Đăng nhập
                </Link>
                <Link href="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  Đăng ký
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4 border-l pl-4 border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <div className="bg-gray-100 p-1.5 rounded-full"><UserIcon className="w-4 h-4 text-gray-500" /></div>
                  <span className="font-medium">{profile?.full_name || 'Người dùng'}</span>
                  {isTeacher && (
                    <span className="bg-blue-100 text-blue-800 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">GV</span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-600 p-1.5 rounded-md transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden border-t">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-blue-50 border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {!user ? (
              <div className="space-y-1">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50">Đăng nhập</Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-gray-50">Đăng ký miễn phí</Link>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-200 p-2 rounded-full"><UserIcon className="w-5 h-5 text-gray-500" /></div>
                  <div>
                    <div className="text-base font-medium text-gray-800">{profile?.full_name}</div>
                    <div className="text-sm font-medium text-gray-500 capitalize">{profile?.role}</div>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-600">
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
