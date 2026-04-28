import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { exam_set_id, access_code } = await req.json()

    // Create Supabase client using Service Role to bypass RLS and read access_code
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Fetch the exam set
    const { data: exam, error } = await supabase
      .from('exam_sets')
      .select('access_code, is_published')
      .eq('id', exam_set_id)
      .single()

    if (error || !exam) {
      return new Response(
        JSON.stringify({ ok: false, reason: 'not_found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Check is_published
    if (!exam.is_published) {
      return new Response(
        JSON.stringify({ ok: false, reason: 'not_published' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. Check access_code if it exists
    if (exam.access_code && exam.access_code !== access_code) {
      return new Response(
        JSON.stringify({ ok: false, reason: 'wrong_code' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 5. Valid
    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
