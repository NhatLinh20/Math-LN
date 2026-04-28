# YÊU CẦU XÂY DỰNG WEBSITE DẠY TOÁN THCS-THPT (Math-LN)

> **Mục tiêu:** Tài liệu này là PRD (Product Requirements Document) đầy đủ để giao cho AI hoặc developer thực hiện.  
> **Phiên bản:** 3.0 — Đã bổ sung bảo mật chấm bài server-side, access code, hình ảnh câu hỏi, pagination, và junction table.

---

## 1. TỔNG QUAN SẢN PHẨM

Website luyện thi toán lớp 10–11–12, hỗ trợ 2 vai trò người dùng:

| Vai trò | Quyền hạn chính |
|---|---|
| **Học sinh** |xem khóa học, luyện thi theo đề giáo viên, xem lịch sử thi |
| **Giáo viên** | Tất cả quyền học sinh + thêm/sửa/xóa câu hỏi, tạo/quản lý đề thi, xem kết quả học sinh |
| **Admin** | Tất cả quyền giáo viên + cấp/thu hồi role |

---

## 2. TECH STACK

```
Frontend  : Next.js 14 (App Router) + TypeScript + Tailwind CSS
Backend   : Supabase (PostgreSQL + Auth + RLS + Storage + Edge Functions)
Math      : KaTeX — render LaTeX realtime
Forms     : react-hook-form + zod
Drag&Drop : dnd-kit
Charts    : recharts
Deploy    : Vercel (frontend) + Supabase Cloud (backend)
```

---

## 3. DATABASE SCHEMA (REFACTORED & UNIFIED)

> **Lưu ý cho Developer/AI:** Đây là Schema chuẩn duy nhất. Đã loại bỏ các cột fixed (answer_a, b, c, d) và thay bằng JSONB để hỗ trợ 4 loại câu hỏi (MCQ, True/False, Short Answer, Essay). Các câu hỏi "tự soạn" (inline) được lưu chung vào bảng `questions` với cờ `is_inline = true`.

### 3.1 Lệnh tạo bảng (Supabase PostgreSQL)

```sql
-- ── 1. PROFILES ───────────────────────────────────────────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student', -- 'student' | 'teacher' | 'admin'
  avatar_url text,
  school text,
  created_at timestamptz default now()
);

-- ── 2. TAXONOMY (Phân loại) ──────────────────────────────────
create table subjects (
  id text primary key, -- 'D' (Đại số), 'H' (Hình học), 'C' (Chuyên đề)
  name text
);

create table chapters (
  id serial primary key,
  grade int,
  subject_id text references subjects(id),
  name text,
  order_index int
);

create table lessons (
  id serial primary key,
  chapter_id int references chapters(id) on delete cascade,
  name text,
  order_index int
);

create table forms (
  id serial primary key,
  lesson_id int references lessons(id) on delete cascade,
  name text,
  order_index int
);

-- ── 3. QUESTIONS (Ngân hàng câu hỏi) ─────────────────────────
create table questions (
  id uuid primary key default gen_random_uuid(),
  question_code text unique,             -- VD: "10D1N1-1"
  created_by uuid references profiles(id),

  grade int not null,
  subject_id text references subjects(id),
  chapter_id int references chapters(id),
  lesson_id int references lessons(id),
  form_id int references forms(id),

  difficulty text not null,              -- 'N', 'H', 'V', 'C'
  question_type text not null,           -- 'mcq' | 'tf' | 'short' | 'essay'

  content text not null,                 -- Nội dung câu hỏi (hỗ trợ LaTeX)
  image_url text,                        -- Link ảnh Supabase Storage

  answers jsonb,                         -- Các lựa chọn (xem giải thích cấu trúc bên dưới)
  correct_answer jsonb,                  -- Đáp án đúng (⚠️ TUYỆT ĐỐI KHÔNG TRẢ VỀ CLIENT)
  solution text,                         -- Lời giải chi tiết

  tags text[],
  is_published boolean default true,     -- false: Đang nháp
  is_inline boolean default false,       -- true: Câu hỏi tự soạn riêng cho đề, không public ra ngân hàng

  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  search_vector tsvector                 -- Phục vụ Full-text search
);

create index idx_questions_grade on questions(grade);
create index idx_questions_subject on questions(subject_id);
create index idx_questions_chapter on questions(chapter_id);
create index idx_questions_difficulty on questions(difficulty);
create index search_idx on questions using gin(search_vector);

-- ── 4. EXAM SETS (Đề thi) ─────────────────────────────────────
create table exam_sets (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references profiles(id),
  title text not null,
  description text,
  grade int,
  duration_minutes int default 45,
  is_published boolean default false,
  access_code text,                      -- NULL = Mở tự do. Có value = Cần nhập mã
  created_at timestamptz default now()
);

-- ── 5. EXAM SET QUESTIONS (Bảng trung gian Đề - Câu hỏi) ──────
create table exam_set_questions (
  exam_set_id uuid references exam_sets(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  order_index int not null,              -- Thứ tự câu trong đề
  score numeric default 1,               -- Điểm mặc định cho câu này
  primary key (exam_set_id, question_id) -- Chống trùng lặp 1 câu 2 lần trong 1 đề
);

create index idx_esq_exam_set on exam_set_questions(exam_set_id);

-- ── 6. EXAM SESSIONS (Phiên làm bài của học sinh) ─────────────
create table exam_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  exam_set_id uuid references exam_sets(id),
  started_at timestamptz default now(),
  completed_at timestamptz,
  score numeric,                         -- Tổng điểm (tỉ lệ 10 hoặc 100 tùy logic)
  correct_count int,                     -- Số câu đúng hoàn toàn
  total_questions int,
  duration_seconds int,
  grading_status text default 'graded',  -- 'graded' (đã chấm xong) | 'pending' (nếu có câu tự luận chờ GV chấm)
  created_at timestamptz default now()
);

-- ── 7. EXAM ANSWERS (Chi tiết từng câu học sinh làm) ──────────
create table exam_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references exam_sessions(id) on delete cascade,
  question_id uuid references questions(id),
  student_answer jsonb,                  -- Câu trả lời của học sinh
  is_correct boolean,                    -- True nếu đúng 100%
  score numeric,                         -- Điểm đạt được (hỗ trợ chấm điểm thành phần cho TF)
  created_at timestamptz default now(),
  unique(session_id, question_id)
);

-- ── 8. PUBLIC VIEW (Bảo mật: Ẩn correct_answer) ───────────────
create view questions_public as
select
  id, question_code, grade, subject_id, chapter_id, lesson_id, form_id,
  difficulty, question_type, content, image_url, answers, solution, tags
from questions
where is_published = true and is_inline = false;

-- ── 9. TRIGGERS ───────────────────────────────────────────────
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'student');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
3.2 Cấu trúc JSONB cho 4 loại câu hỏi (question_type)
Quan trọng: Dữ liệu trong cột answers (hiển thị cho user) và correct_answer (chỉ server biết) phải tuân thủ Schema sau để hàm chấm điểm (Edge Function) hoạt động đúng.
1. Trắc nghiệm 1 đáp án (mcq)
answers: [{"id": "A", "text": "Đoạn text LaTeX..."}, {"id": "B", "text": "..."}]
correct_answer: "A"
Chấm điểm: student_answer === correct_answer -> 100% điểm.
2. Trắc nghiệm Đúng/Sai (tf)
answers: [{"id": "a", "text": "Ý a..."}, {"id": "b", "text": "Ý b..."}, {"id": "c", "text": "Ý c..."}, {"id": "d", "text": "Ý d..."}]
correct_answer: {"a": true, "b": false, "c": true, "d": true}
Chấm điểm: Đối chiếu từng keys. Trúng 1 ý (10% điểm), 2 ý (25% điểm), 3 ý (50% điểm), 4 ý (100% điểm).
3. Trả lời ngắn / Điền khuyết (short)
answers: null (Frontend tự hiển thị ô input text)
correct_answer: ["0.5", "1/2", "0,5"] (Mảng chứa tất cả các định dạng chuỗi được coi là đúng).
Chấm điểm: Remove khoảng trắng student_answer. Check correct_answer.includes(student_answer) -> 100% điểm.
4. Tự luận (essay)
answers: null (Frontend hiển thị Textarea / Nút Upload ảnh)
correct_answer: null (Hoặc có thể lưu text barem điểm để giáo viên tham khảo).
Chấm điểm: Server bỏ qua, auto gán is_correct = false, score = 0. Set exam_sessions.grading_status = 'pending'. Giáo viên sẽ dùng UI riêng để chấm điểm sau.

## 4. BẢO MẬT & PHÂN QUYỀN

### 4.1 Row Level Security (RLS)

```sql
-- ── QUESTIONS ──────────────────────────────────────────────
alter table questions enable row level security;

-- Học sinh đọc câu hỏi (KHÔNG có correct_answer — xử lý ở tầng API)
create policy "questions_read_published"
  on questions for select using (is_published = true);

-- Chỉ teacher/admin thêm câu hỏi
create policy "questions_insert_teacher"
  on questions for insert
  with check (
    exists (select 1 from profiles
            where id = auth.uid() and role in ('teacher','admin'))
  );

-- Chỉ teacher/admin sửa/xóa câu hỏi của mình
create policy "questions_update_teacher"
  on questions for update
  using (
    created_by = auth.uid() and
    exists (select 1 from profiles where id = auth.uid() and role in ('teacher','admin'))
  );

create policy "questions_delete_teacher"
  on questions for delete
  using (
    created_by = auth.uid() and
    exists (select 1 from profiles where id = auth.uid() and role in ('teacher','admin'))
  );


-- ── EXAM_SETS ───────────────────────────────────────────────
alter table exam_sets enable row level security;

-- Học sinh chỉ xem đề đã xuất bản (không cần check access_code ở đây — Edge Function xử lý)
create policy "exam_sets_student_read"
  on exam_sets for select using (is_published = true);

-- Giáo viên CRUD đề của chính mình
create policy "exam_sets_teacher_crud"
  on exam_sets for all
  using (
    created_by = auth.uid() and
    exists (select 1 from profiles where id = auth.uid() and role in ('teacher','admin'))
  );


-- ── EXAM_SESSIONS ───────────────────────────────────────────
alter table exam_sessions enable row level security;

-- Học sinh chỉ xem/tạo session của mình
create policy "exam_sessions_own"
  on exam_sessions for all using (user_id = auth.uid());

-- Giáo viên xem tất cả session của đề mình tạo
create policy "teacher_read_exam_sessions"
  on exam_sessions for select
  using (
    exists (
      select 1 from exam_sets
      where exam_sets.id = exam_sessions.exam_set_id
      and exam_sets.created_by = auth.uid()
    )
  );
```

### 4.2 Edge Function — Chấm bài server-side

> ⚠️ **Bắt buộc:** `correct_answer` KHÔNG được trả về client. Toàn bộ logic chấm bài thực hiện ở Edge Function.

```typescript
// supabase/functions/submit-exam/index.ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (req) => {
  const { exam_set_id, answers, duration_seconds } = await req.json()
  // answers: { [question_id: string]: 'A' | 'B' | 'C' | 'D' }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // dùng service role để đọc correct_answer
  )

  // 1. Lấy đáp án đúng từ DB (không bao giờ expose cho client)
  const { data: questions } = await supabase
    .from('questions')
    .select('id, correct_answer')
    .in('id', Object.keys(answers))

  // 2. Tính điểm
  "⚠️ Yêu cầu viết Edge Function: Cần duyệt qua từng câu hỏi và gọi hàm helper calculateScore() để xử lý logic chấm điểm riêng biệt cho 4 loại câu hỏi (mcq, tf, short, essay) dựa trên cấu trúc JSONB. Câu essay mặc định gán score = 0 và set grading_status = 'pending'."
  // 3. Lưu session
  const { data: { user } } = await supabase.auth.getUser(
    req.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
  )

  await supabase.from('exam_sessions').insert({
    user_id: user?.id,
    exam_set_id,
    answers,
    score: Math.round(score * 10) / 10,
    total_questions: total,
    correct_count: correct,
    duration_seconds,
    completed_at: new Date().toISOString()
  })

  return new Response(JSON.stringify({ score, correct, total }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### 4.3 Edge Function — Xác thực access code

```typescript
// supabase/functions/verify-access-code/index.ts
serve(async (req) => {
  const { exam_set_id, access_code } = await req.json()

  const supabase = createClient(/* ... service role */)

  const { data: exam } = await supabase
    .from('exam_sets')
    .select('access_code, is_published')
    .eq('id', exam_set_id)
    .single()

  if (!exam?.is_published) {
    return new Response(JSON.stringify({ ok: false, reason: 'not_published' }), { status: 403 })
  }

  if (exam.access_code && exam.access_code !== access_code) {
    return new Response(JSON.stringify({ ok: false, reason: 'wrong_code' }), { status: 403 })
  }

  // Trả về token ngắn hạn hoặc flag cho phép bắt đầu thi
  return new Response(JSON.stringify({ ok: true }))
})
```

### 4.4 Middleware Next.js

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const TEACHER_ROUTES = [
  '/practice/create',
  '/practice/manage',
  '/practice/edit',
  '/questions/import',
  '/exams/create',
  '/exams/manage',
]

const AUTH_REQUIRED_ROUTES = [
  '/practice/do',
  '/practice/result',
  '/practice/history',
]

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = request.nextUrl

  // Chưa đăng nhập → yêu cầu đăng nhập
  if (!session && AUTH_REQUIRED_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Không phải teacher/admin → từ chối
  if (TEACHER_ROUTES.some(r => pathname.startsWith(r))) {
    if (!session) return NextResponse.redirect(new URL('/login', request.url))

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!['teacher', 'admin'].includes(profile?.role ?? '')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return res
}
```

---

## 5. AUTH HELPERS

```typescript
// lib/auth-helpers.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'

export async function getUserRole(): Promise<'student' | 'teacher' | 'admin' | null> {
  const supabase = createClientComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  return data?.role ?? 'student'
}

export async function requireTeacher() {
  const role = await getUserRole()
  if (!['teacher', 'admin'].includes(role ?? '')) {
    redirect('/unauthorized')
  }
}

export async function isTeacher(): Promise<boolean> {
  const role = await getUserRole()
  return ['teacher', 'admin'].includes(role ?? '')
}
```

---

## 6. PHÂN LOẠI CÂU HỎI (question-taxonomy.ts)

```typescript
// lib/question-taxonomy.ts

// QUY TẮC SINH MÃ (ID): [lớp][loại][chương][mức][bài]-[dạng]
// - Tham số 1 (Lớp): 0 (Lớp 10), 1 (Lớp 11), 2 (Lớp 12).
// - Tham số 2 (Phân môn): D (Đại số), H (Hình học), C (Chuyên đề).
// - Tham số 3 (Chương): 1, 2, 3... Nếu là Chương 10 thì ghi là 0.
// - Tham số 4 (Mức độ): N, H, V, C.
// - Tham số 5 (Bài): 1, 2, 3...
// - Tham số 6 (Dạng): 1, 2, 3... (Nằm sau dấu gạch ngang)
// VÍ DỤ: "0D1N1-1" = Lớp 10, Đại số, Chương 1, Mức Nhận biết, Bài 1, Dạng 1

export const GRADES = [10, 11, 12] as const;

export const SUBJECT_TYPES = {
  D: 'Đại số / Giải tích',
  H: 'Hình học',
  C: 'Chuyên đề',
} as const;

export const DIFFICULTY = {
  N: 'Nhận biết',
  H: 'Thông hiểu',
  V: 'Vận dụng',
  C: 'Vận dụng cao',
} as const;

// Logic Mapping mã Lớp để tạo ID
const GRADE_CODE_MAP: Record<number, string> = {
  10: '0',
  11: '1',
  12: '2'
};

export interface TaxonomyNode {
  id: number;
  name: string;
  lessons: {
    id: number;
    name: string;
    forms: { id: number; name: string }[];
  }[];
}

// ⚠️ Placeholder — cần điền đầy đủ theo chương trình SGK GDPT 2018
export const TAXONOMY: Record<number, Record<string, TaxonomyNode[]>> = {
  10: {
    D: [
      {
        id: 1, name: 'Mệnh đề và tập hợp',
        lessons: [
          { id: 1, name: 'Mệnh đề', forms: [{ id: 1, name: 'Xác định mệnh đề' }, { id: 2, name: 'Phủ định mệnh đề' }] },
          { id: 2, name: 'Tập hợp', forms: [{ id: 1, name: 'Xác định tập hợp' }, { id: 2, name: 'Phép toán tập hợp' }] },
        ]
      },
      // ... các chương còn lại: Ch2,3,6,7,8,10
    ],
    H: [
      // Chương 4, 5, 9
    ],
    C: [
      // Chuyên đề 1, 2, 3
    ],
  },
  11: {
    D: [ /* Ch1,2,3,5,6,7,9 */ ],
    H: [ /* Ch4,8 */ ],
    C: [ /* CĐ1,2,3 */ ],
  },
  12: {
    D: [ /* Giải tích: Ch1,3,4,6 */ ],
    H: [ /* Ch2,5 */ ],
  },
};

/**
 * Hàm sinh mã câu hỏi tự động (Question ID Generator)
 */
export function generateQuestionId(
  grade: number,       // Nhận giá trị: 10, 11, 12 từ UI
  subjectType: string, // Nhận giá trị: 'D', 'H', 'C'
  chapter: number,     // Nhận giá trị: 1, 2,... 10
  difficulty: string,  // Nhận giá trị: 'N', 'H', 'V', 'C'
  lesson: number,      // Nhận giá trị: 1, 2, 3...
  form: number         // Nhận giá trị: 1, 2, 3...
): string {
  const gradeCode = GRADE_CODE_MAP[grade] || '0';
  const chapterCode = chapter === 10 ? '0' : chapter.toString();
  
  return `${gradeCode}${subjectType}${chapterCode}${difficulty}${lesson}-${form}`;
}
export function generateQuestionId(
  grade: number,
  subjectType: string,
  chapter: number,
  difficulty: string,
  lesson: number,
  form: number
): string {
  return `${grade}${subjectType}${chapter}${difficulty}${lesson}-${form}`
}
```

---

## 7. TRANG NGÂN HÀNG CÂU HỎI (/questions)

### 7.1 Sidebar bộ lọc

- Lớp (radio: 10 / 11 / 12 / Tất cả)
- Loại (select: Đại số / Hình học / Chuyên đề)
- Chương (cascading dropdown)
- Bài (cascading dropdown)
- Dạng (cascading dropdown)
- Mức độ (checkbox: N / H / V / C)
- Tìm kiếm toàn văn (input)

### 7.2 Danh sách câu hỏi

- **Pagination:** 20 câu/trang (dùng Supabase `.range()`)
- Hiển thị dạng card, render LaTeX với KaTeX
- Nếu có `image_url`: hiển thị ảnh minh họa

### 7.3 QuestionCard — 3 chế độ

```tsx
// components/QuestionCard.tsx
interface QuestionCardProps {
  question: Question      // ⚠️ type Question KHÔNG có field correct_answer
  mode:
    | 'view'    // Học sinh: chỉ đọc, nút "Xem lời giải" (toggle)
    | 'edit'    // Giáo viên: thêm nút ✏️ Sửa, 🗑️ Xóa, badge tên người tạo
    | 'exam'    // Làm bài: radio A/B/C/D có thể click, KHÔNG hiện đáp án đúng
}
```

### 7.4 Modal Thêm/Sửa câu hỏi (chỉ Giáo viên)

> **⚠️ Lưu ý cực kỳ quan trọng cho Developer/AI:** Giao diện nhập đáp án phải thay đổi linh hoạt (Conditional Rendering) dựa vào trường `question_type`. Dữ liệu submit lên phải được format chuẩn JSONB như định nghĩa ở Mục 3.2.

**A. THÔNG TIN CHUNG (Luôn hiển thị)**
- Lớp → Loại → Chương → Bài → Dạng (Cascading dropdown, data lấy từ `TAXONOMY`)
- Mức độ (radio: N / H / V / C)
- Loại câu hỏi `question_type` (select: Trắc nghiệm 4 đáp án / Đúng-Sai / Trả lời ngắn / Tự luận)
- Preview ID tự sinh (Ví dụ: `"0D1N1-1"` - dùng hàm `generateQuestionId`)
- Nội dung câu hỏi (textarea + preview KaTeX realtime)

**B. PHẦN ĐÁP ÁN (Thay đổi theo `question_type`)**

*   **Nếu chọn `mcq` (Trắc nghiệm 1 đáp án):**
    *   UI: 4 ô textarea (A, B, C, D) để nhập nội dung đáp án (hỗ trợ LaTeX).
    *   Đáp án đúng: 4 nút Radio tương ứng để giáo viên tick chọn 1 đáp án đúng duy nhất.
*   **Nếu chọn `tf` (Trắc nghiệm Đúng/Sai):**
    *   UI: 4 ô input (a, b, c, d) để nhập 4 ý/phát biểu.
    *   Đáp án đúng: Bên cạnh mỗi ô input có 1 Switch Toggle (hoặc 2 radio Đúng/Sai) để giáo viên set kết quả đúng cho từng ý.
*   **Nếu chọn `short` (Trả lời ngắn):**
    *   UI: Không có phần nhập lựa chọn hiển thị cho học sinh.
    *   Đáp án đúng: Component cho phép "Thêm nhiều định dạng đúng". (VD: Giáo viên nhập ô 1 là "0.5", ấn nút [+] thêm ô 2 nhập "1/2", thêm ô 3 nhập "0,5").
*   **Nếu chọn `essay` (Tự luận):**
    *   UI: Ẩn hoàn toàn phần nhập đáp án (Vì hệ thống sẽ set `answers = null` và `correct_answer = null`).

**C. THÔNG TIN BỔ SUNG**
- Lời giải chi tiết (textarea, hỗ trợ preview KaTeX)
- Ảnh minh họa (Nút Upload ảnh → Đẩy lên Supabase Storage bucket `question-images` → Lưu chuỗi URL trả về vào DB).

**D. VALIDATE DATAFORM**
- Bắt buộc dùng `react-hook-form` + `zod`.
- **Lưu ý Zod Schema:** Cần dùng `z.discriminatedUnion` hoặc `superRefine` để validate riêng biệt phần đáp án dựa theo `question_type` (VD: chọn `mcq` thì bắt buộc phải nhập đủ 4 text đáp án và chọn 1 radio, chọn `essay` thì không validate phần đáp án).

### 7.5 Import hàng loạt (/questions/import — chỉ Giáo viên)

- Upload file JSON (mảng `Question[]`)
- Preview bảng 10 dòng đầu
- Nút "Import tất cả" → bulk insert
- Kết quả: "X câu thành công, Y câu lỗi" (kèm lý do từng dòng)

---

## 8. TRANG TẠO & QUẢN LÝ ĐỀ THI (/exams — chỉ Giáo viên)

### 8.1 Luồng tạo đề (3 bước)

**Bước 1 — Cấu hình đề:**
- Tiêu đề, mô tả, lớp áp dụng, thời gian làm bài (phút)
- Toggle "Yêu cầu access code" → nếu bật: tự sinh 6 ký tự, có nút regenerate + copy

**Bước 2 — Chọn câu hỏi:**
- Layout chia đôi:
  - Trái: bộ lọc + danh sách ngân hàng (pagination 10 câu/trang)
  - Phải: giỏ câu đã chọn (drag & drop bằng dnd-kit để sắp xếp)
- Nút "+": thêm từ ngân hàng
- Nút "Soạn câu mới": mở inline form (câu tự soạn)
  - Checkbox "Lưu vào ngân hàng" (mặc định tắt)
- Badge đếm mức độ: [N:3] [H:5] [V:2] [C:0]

**Bước 3 — Xem trước & Xuất bản:**
- Preview đề như học sinh thấy (không hiện đáp án đúng)
- Toggle `is_published`
- Nếu có access_code: hiển thị mã + nút copy
- Nút: "Lưu nháp" | "Xuất bản"

### 8.2 Trang quản lý (/exams/manage)

Bảng danh sách:

| Tiêu đề | Lớp | Số câu | Trạng thái | Lượt làm | Điểm TB | Hành động |
|---|---|---|---|---|---|---|
| ... | 10 | 30 | Đã xuất bản | 45 | 7.2 | Sửa · Kết quả · Xóa |

- "Lượt làm": `count(exam_sessions)`
- "Điểm TB": `avg(score)` từ `exam_sessions`

### 8.3 Trang kết quả học sinh (/exams/[id]/results)

- Bảng: Tên học sinh | Thời gian nộp | Điểm | Số câu đúng | Thời gian làm
- BarChart (recharts): phân bố điểm (0–2, 2–4, 4–6, 6–8, 8–10)
- Thống kê từng câu: % học sinh trả lời đúng (query từ `exam_sessions.answers`)

---

## 9. TRANG LUYỆN THI (/practice)

### 9.1 Phân quyền tóm tắt

| Tính năng | Học sinh | Giáo viên |
|---|:---:|:---:|
| Xem danh sách đề đã xuất bản | ✓ | ✓ |
| Vào thi | ✓ | ✓ (test) |
| Xem lịch sử thi của mình | ✓ | ✓ |
| Tạo / Sửa / Xóa đề | ✗ | ✓ |
| Xuất bản / Ẩn đề | ✗ | ✓ |
| Xem kết quả tất cả học sinh | ✗ | ✓ |
| Soạn câu hỏi inline | ✗ | ✓ |

### 9.2 Danh sách đề (/practice)

- Lọc nhanh theo lớp: [Tất cả] [10] [11] [12]
- Mỗi đề hiển thị dạng card:
  - Tiêu đề, lớp, số câu, thời gian, tên giáo viên
  - Nếu có `access_code`: badge khóa 🔒
  - Nếu học sinh đã thi: "Điểm của bạn: 8.5/10" + nút "Thi lại"
  - Nếu chưa thi: nút "Vào thi" (nổi bật)
- **Không có nút tạo đề, thêm câu hỏi với học sinh**

### 9.3 Màn hình nhập access code

Nếu đề có `access_code`:
1. Hiện modal nhập mã trước khi bắt đầu
2. Gọi Edge Function `verify-access-code`
3. Nếu sai → thông báo lỗi, giữ nguyên modal
4. Nếu đúng → bắt đầu thi

### 9.4 Làm bài (/practice/[examId]/do)

- Hiển thị toàn bộ câu hỏi trên một trang (cuộn)
- Đồng hồ đếm ngược góc trên phải
- Panel điều hướng câu: số câu, màu xanh = đã chọn, xám = chưa, vàng = đã đánh dấu
- Nút "Đánh dấu xem lại" (flag icon)
- Nút "Nộp bài" → confirm dialog "Bạn còn X câu chưa trả lời. Xác nhận nộp?"
- Tự động nộp khi hết giờ

**Lưu tiến trình:**
```typescript
// Lưu vào localStorage mỗi 30 giây
localStorage.setItem(`exam_progress_${examId}`, JSON.stringify({
  answers,
  flagged,
  startedAt,
  remainingSeconds
}))
// Khi vào lại: hỏi "Tiếp tục bài thi còn dang dở?"
```

**Nộp bài:** Gọi Edge Function `submit-exam` (không gửi trực tiếp lên Supabase từ client).

### 9.5 Kết quả (/practice/[examId]/result/[sessionId])

- Điểm lớn ở giữa: "8.5 / 10"
- Thống kê: ✓ 17 đúng | ✗ 3 sai | — 0 bỏ qua
- Thời gian hoàn thành
- Bảng từng câu: ✓/✗ | Đáp án bạn chọn | Đáp án đúng (lấy từ session đã chấm)
- Nút "Xem lời giải" (toggle, render LaTeX)
- Nút "Thi lại" | "Về danh sách"

### 9.6 Lịch sử thi (/practice/history)

Bảng:
| Tên đề | Ngày thi | Điểm | Số đúng/Tổng | Thời gian | Xem lại |
|---|---|---|---|---|---|

---

## 10. TRANG CHỦ (/)

- **Hero:** "Luyện toán thông minh — Chinh phục kỳ thi"
- **Thống kê realtime:** Tổng câu hỏi | Học sinh đã đăng ký | Đề thi có sẵn
- **3 tính năng nổi bật:** Ngân hàng câu hỏi / Luyện thi / Đề do giáo viên tạo
- **CTA:** 
  - "Đăng ký miễn phí" (học sinh)
  - "Tôi là giáo viên" → trang hướng dẫn liên hệ xin role teacher

---

## 11. AUTH (Login / Register)

### Đăng ký
- Họ tên, email, mật khẩu
- Role mặc định: `student`
- Xác thực email qua Supabase Auth

### Đăng nhập
- Email + mật khẩu
- Google OAuth (tùy chọn)

### Nâng cấp lên Teacher
- Học sinh không tự nâng được
- Cần Admin vào bảng `profiles` và cập nhật `role = 'teacher'`
- (Tùy chọn nâng cao: trang `/admin/users` cho Admin quản lý role)

---

## 12. NAVIGATION

```
// Học sinh:
Trang chủ | Khóa học | Luyện thi | Lịch sử | [Avatar]

// Giáo viên:
Trang chủ | Ngân hàng câu hỏi | Luyện thi | Khóa học | Tạo đề | Quản lý đề | [Avatar + badge "GV"]
```

---

## 13. TRANG /unauthorized

```
Tiêu đề: "Truy cập bị từ chối"
Nội dung: "Bạn cần tài khoản giáo viên để truy cập tính năng này.
           Liên hệ quản trị viên để được cấp quyền."
Nút: [Quay lại trang chủ]
```

---

## 14. CẤU TRÚC THƯ MỤC DỰ ÁN

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (main)/
│   ├── page.tsx                        # Trang chủ
│   ├── questions/
│   │   ├── page.tsx                    # Ngân hàng câu hỏi
│   │   └── import/page.tsx             # [GV] Import hàng loạt
│   ├── exams/
│   │   ├── create/page.tsx             # [GV] Tạo đề
│   │   ├── manage/page.tsx             # [GV] Quản lý đề
│   │   └── [id]/results/page.tsx       # [GV] Kết quả học sinh
│   └── practice/
│       ├── page.tsx                    # Danh sách đề
│       ├── history/page.tsx            # Lịch sử thi
│       ├── create/page.tsx             # [GV] Tạo đề luyện thi
│       ├── manage/page.tsx             # [GV] Quản lý đề luyện thi
│       └── [examId]/
│           ├── do/page.tsx             # Làm bài
│           └── result/[sessionId]/page.tsx  # Kết quả
├── unauthorized/page.tsx
└── layout.tsx

components/
├── QuestionCard.tsx
├── QuestionFilter.tsx
├── ExamBuilder/
│   ├── Step1Config.tsx
│   ├── Step2Questions.tsx
│   └── Step3Preview.tsx
├── LatexPreview.tsx
├── CountdownTimer.tsx
└── ExamNavigationPanel.tsx

lib/
├── question-taxonomy.ts
├── auth-helpers.ts
└── supabase/
    ├── client.ts
    └── server.ts

supabase/
├── functions/
│   ├── submit-exam/index.ts
│   └── verify-access-code/index.ts
└── migrations/
    └── 001_init.sql

middleware.ts
```

---

## FILE TAXONOMY (question-taxonomy.ts)
Tạo object TypeScript đầy đủ toàn bộ cây phân cấp câu hỏi:
- Lớp 10: Đại số (Ch1,2,3,6,7,8,10) + Hình học (Ch4,5,9) + Chuyên đề (CĐ1,2,3)
- Lớp 11: Đại số (Ch1,2,3,5,6,7,9) + Hình học (Ch4,8) + Chuyên đề (CĐ1,2,3)
- Lớp 12: Giải tích (Ch1,3,4,6) + Hình học (Ch2,5)
Mỗi chương có danh sách bài (lesson), mỗi bài có danh sách dạng (form) kèm tên đầy đủ.
ID auto-generate theo quy tắc: [lớp][loại][chương][mức][bài]-[dạng]
1. THUẬT TOÁN SINH MÃ CÂU HỎI (TAXONOMY ID)
Hệ thống sử dụng file lib/taxonomy.ts chứa dữ liệu cây phân loại chương trình GDPT 2018. Mã câu hỏi (question_id) gồm 6 tham số. Ví dụ: 2D1N1-1 hoặc 0H4V2-1.
Tham số 1 (Lớp): 0 (Lớp 10), 1 (Lớp 11), 2 (Lớp 12).
Tham số 2 (Phân môn): D (Đại số/Giải tích/Thống kê), H (Hình học), C (Chuyên đề).
Tham số 3 (Chương): 1, 2, 3... 0 (Chương 10).
Tham số 4 (Mức độ): N (Nhận biết), H (Thông hiểu), V (Vận dụng), C (Vận dụng cao).
Tham số 5 (Bài/Lesson): 1, 2, 3...
Tham số 6 (Dạng): Nằm sau dấu gạch ngang -, ví dụ -1, -2...
2. BỐN LOẠI CÂU HỎI VÀ LOGIC CHẤM ĐIỂM (CHUẨN 2025)
> ⚠️ **Lưu ý quan trọng cho Edge Function chấm bài:** Logic chấm điểm thực hiện hoàn toàn trên Server bằng `service_role` key. Không bao giờ gửi `correct_answer` xuống Frontend khi học sinh đang thi. Edge function cần gọi helper xử lý riêng cho 4 loại câu hỏi này:

**Loại 1: Trắc nghiệm 4 phương án (MCQ)**
- UI thi: 4 nút Radio (chỉ chọn 1).
- Chấm điểm: Match string trực tiếp. Đúng 100% điểm của câu, Sai 0 điểm.

**Loại 2: Trắc nghiệm Đúng/Sai (TF)**
- UI thi: 4 ý (a, b, c, d), mỗi ý có 2 nút Radio (Đúng / Sai).
- Chấm điểm: Đối chiếu 4 ý. Đúng 1/4 ý (10% điểm), 2/4 ý (25% điểm), 3/4 ý (50% điểm), 4/4 ý (100% điểm).

**Loại 3: Trả lời ngắn (Short Answer)**
- UI thi: Ô input text.
- Chấm điểm: Bỏ qua khoảng trắng dư ở đầu/cuối. Match string với mảng các đáp án được chấp nhận. Đúng 100% điểm, Sai 0 điểm. (VD: học sinh nhập "0.5", "0,5" đều được tính đúng nếu có trong list correct_answer).

**Loại 4: Tự luận (Essay)**
- UI thi: Textarea lớn hoặc Nút Upload ảnh bài làm.
- Chấm điểm: Edge Function bỏ qua không tự động chấm (auto gán `score = 0` và `is_correct = false` cho câu này).
- Cập nhật trạng thái: Hệ thống tự động gán `exam_sessions.grading_status = 'pending'`. Giáo viên sẽ chấm tay sau qua giao diện UI riêng.


## 15. THỨ TỰ THỰC HIỆN

1. **Supabase:** Tạo schema (migrations) + RLS policies + trigger tạo profile + Storage bucket `question-images`
2. **Edge Functions:** `submit-exam` + `verify-access-code`
3. **lib/question-taxonomy.ts:** Điền đầy đủ cây phân loại theo SGK
4. **lib/auth-helpers.ts** + **middleware.ts**
5. **Auth:** Login / Register pages
6. **Trang ngân hàng câu hỏi:** Bộ lọc + danh sách + modal thêm/sửa (GV) + import
7. **Trang tạo & quản lý đề thi** (GV)
8. **Trang luyện thi:**
   - 8a. Luồng học sinh: danh sách → nhập mã → làm bài → kết quả → lịch sử
   - 8b. Luồng giáo viên: tạo đề inline + xem kết quả học sinh
9. **Trang chủ**
10. **Kiểm thử E2E:** Bảo mật correct_answer, RLS, access_code

---

## 16. CHECKLIST BẢO MẬT

- [ ] `correct_answer` KHÔNG bao giờ trả về qua Supabase client query
- [ ] Chấm bài 100% server-side qua Edge Function (service role key)
- [ ] `access_code` verify qua Edge Function, không check ở client
- [ ] RLS bật trên tất cả bảng
- [ ] Middleware bảo vệ tất cả teacher-only routes
- [ ] Supabase Storage: bucket `question-images` chỉ cho phép teacher upload
- [ ] Rate limit Edge Functions (Supabase built-in)
- [ ] Sanitize LaTeX input trước khi lưu (chống XSS qua KaTeX)