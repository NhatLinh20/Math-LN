import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function calculateScore(questionType: string, studentAnswer: any, correctAnswer: any): { is_correct: boolean; points_ratio: number } {
  if (!studentAnswer) return { is_correct: false, points_ratio: 0 }

  switch (questionType) {
    case 'mcq':
      const isMcqCorrect = String(studentAnswer).trim() === String(correctAnswer).trim()
      return { is_correct: isMcqCorrect, points_ratio: isMcqCorrect ? 1 : 0 }

    case 'tf':
      // correctAnswer: { "a": true, "b": false, "c": true, "d": true }
      // studentAnswer: { "a": true, "b": true, "c": true, "d": false }
      if (typeof correctAnswer !== 'object' || typeof studentAnswer !== 'object') {
        return { is_correct: false, points_ratio: 0 }
      }
      
      const keys = Object.keys(correctAnswer)
      let correctItems = 0
      for (const key of keys) {
        if (studentAnswer[key] === correctAnswer[key]) {
          correctItems++
        }
      }

      let ratio = 0
      if (correctItems === 1) ratio = 0.1
      else if (correctItems === 2) ratio = 0.25
      else if (correctItems === 3) ratio = 0.5
      else if (correctItems === 4) ratio = 1.0

      return { is_correct: ratio === 1.0, points_ratio: ratio }

    case 'short':
      // correctAnswer is array of acceptable string formats: ["0.5", "1/2", "0,5"]
      const stdAns = String(studentAnswer).trim().toLowerCase()
      if (!Array.isArray(correctAnswer)) return { is_correct: false, points_ratio: 0 }
      
      const isShortCorrect = correctAnswer.map(a => String(a).trim().toLowerCase()).includes(stdAns)
      return { is_correct: isShortCorrect, points_ratio: isShortCorrect ? 1 : 0 }

    case 'essay':
      // Teacher manual grading
      return { is_correct: false, points_ratio: 0 }

    default:
      return { is_correct: false, points_ratio: 0 }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { exam_set_id, answers, duration_seconds } = await req.json()
    // answers is { [question_id]: student_answer }

    // 1. Auth check
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Use Service Role to read correct_answers and bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Fetch exam questions with scores
    const { data: examQuestions, error: eqError } = await supabaseAdmin
      .from('exam_set_questions')
      .select(`
        question_id,
        score,
        questions (
          id,
          question_type,
          correct_answer
        )
      `)
      .eq('exam_set_id', exam_set_id)

    if (eqError || !examQuestions) {
      throw new Error('Could not fetch exam questions')
    }

    // 3. Process and Grade each question
    let totalMaxScore = 0
    let totalAchievedScore = 0
    let fullyCorrectCount = 0
    let hasEssay = false

    const answerInserts = []

    for (const eq of examQuestions) {
      const q = eq.questions
      const qScoreMax = Number(eq.score || 1)
      totalMaxScore += qScoreMax

      if (q.question_type === 'essay') {
        hasEssay = true
      }

      const studentAns = answers[q.id]
      const { is_correct, points_ratio } = calculateScore(q.question_type, studentAns, q.correct_answer)
      
      const achievedScore = qScoreMax * points_ratio
      totalAchievedScore += achievedScore

      if (is_correct) {
        fullyCorrectCount++
      }

      answerInserts.push({
        question_id: q.id,
        student_answer: studentAns ?? null,
        is_correct,
        score: achievedScore
      })
    }

    // 4. Calculate Final Score (Scale of 10)
    let finalScore = 0
    if (totalMaxScore > 0) {
      finalScore = (totalAchievedScore / totalMaxScore) * 10
    }
    // Round to 2 decimal places
    finalScore = Math.round(finalScore * 100) / 100

    const grading_status = hasEssay ? 'pending' : 'graded'

    // 5. Insert Exam Session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('exam_sessions')
      .insert({
        user_id: user.id,
        exam_set_id,
        score: finalScore,
        correct_count: fullyCorrectCount,
        total_questions: examQuestions.length,
        duration_seconds,
        grading_status,
        completed_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (sessionError || !session) {
      throw new Error('Failed to create exam session: ' + sessionError?.message)
    }

    // 6. Insert Exam Answers
    const answersToInsert = answerInserts.map(a => ({
      ...a,
      session_id: session.id
    }))

    const { error: answersError } = await supabaseAdmin
      .from('exam_answers')
      .insert(answersToInsert)

    if (answersError) {
      throw new Error('Failed to save exam answers: ' + answersError.message)
    }

    // 7. Return Result
    return new Response(
      JSON.stringify({
        score: finalScore,
        correct_count: fullyCorrectCount,
        total_questions: examQuestions.length,
        session_id: session.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
