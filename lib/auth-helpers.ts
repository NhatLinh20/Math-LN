import { createServerComponentClient } from './supabase/server'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserRole(): Promise<'student' | 'teacher' | 'admin' | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createServerComponentClient()
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return data?.role ?? 'student'
}

export async function isTeacher(): Promise<boolean> {
  const role = await getUserRole()
  return role === 'teacher' || role === 'admin'
}

export async function requireTeacher() {
  const isT = await isTeacher()
  if (!isT) {
    redirect('/unauthorized')
  }
}
