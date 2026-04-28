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

  answers jsonb,                         -- Các lựa chọn
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
  score numeric,                         -- Tổng điểm (tỉ lệ 10)
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
  score numeric,                         -- Điểm đạt được
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


-- ── 10. BẬT RLS (ROW LEVEL SECURITY) CHO TẤT CẢ CÁC BẢNG ──────
alter table profiles enable row level security;
alter table subjects enable row level security;
alter table chapters enable row level security;
alter table lessons enable row level security;
alter table forms enable row level security;
alter table questions enable row level security;
alter table exam_sets enable row level security;
alter table exam_set_questions enable row level security;
alter table exam_sessions enable row level security;
alter table exam_answers enable row level security;

-- PROFILES: Mọi người đều có thể đọc profile để lấy tên giáo viên. Chỉ tự update profile của mình.
create policy "profiles_read_all" on profiles for select using (true);
create policy "profiles_update_own" on profiles for update using (id = auth.uid());

-- TAXONOMY: Mọi người đều có thể đọc (public)
create policy "taxonomy_subjects_read" on subjects for select using (true);
create policy "taxonomy_chapters_read" on chapters for select using (true);
create policy "taxonomy_lessons_read" on lessons for select using (true);
create policy "taxonomy_forms_read" on forms for select using (true);

-- QUESTIONS: Học sinh đọc câu hỏi public. Teacher CRUD câu hỏi của mình.
create policy "questions_read_published"
  on questions for select using (is_published = true);

create policy "questions_insert_teacher"
  on questions for insert
  with check (
    exists (select 1 from profiles where id = auth.uid() and role in ('teacher','admin'))
  );

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

-- EXAM_SETS: Học sinh đọc đề đã xuất bản. Giáo viên CRUD đề của mình.
create policy "exam_sets_student_read"
  on exam_sets for select using (is_published = true);

create policy "exam_sets_teacher_crud"
  on exam_sets for all
  using (
    created_by = auth.uid() and
    exists (select 1 from profiles where id = auth.uid() and role in ('teacher','admin'))
  );

-- EXAM_SET_QUESTIONS: Ai thấy đề thi thì thấy bảng nối này. Giáo viên CRUD bảng nối cho đề của mình.
create policy "esq_read_if_exam_published"
  on exam_set_questions for select
  using (
    exists (select 1 from exam_sets where id = exam_set_id and is_published = true)
    or
    exists (select 1 from exam_sets where id = exam_set_id and created_by = auth.uid())
  );

create policy "esq_teacher_crud"
  on exam_set_questions for all
  using (
    exists (select 1 from exam_sets where id = exam_set_id and created_by = auth.uid())
  );

-- EXAM_SESSIONS: Học sinh CRUD session của mình. Giáo viên xem session thuộc đề của mình.
create policy "exam_sessions_own"
  on exam_sessions for all using (user_id = auth.uid());

create policy "teacher_read_exam_sessions"
  on exam_sessions for select
  using (
    exists (
      select 1 from exam_sets
      where exam_sets.id = exam_sessions.exam_set_id
      and exam_sets.created_by = auth.uid()
    )
  );

-- EXAM_ANSWERS: Học sinh CRUD câu trả lời thuộc session của mình. Giáo viên xem nếu session thuộc đề của mình.
create policy "exam_answers_own"
  on exam_answers for all
  using (
    exists (select 1 from exam_sessions where id = session_id and user_id = auth.uid())
  );

create policy "teacher_read_exam_answers"
  on exam_answers for select
  using (
    exists (
      select 1 from exam_sessions
      join exam_sets on exam_sessions.exam_set_id = exam_sets.id
      where exam_sessions.id = exam_answers.session_id and exam_sets.created_by = auth.uid()
    )
  );


-- ── 11. STORAGE BUCKET: QUESTION-IMAGES ───────────────────────
insert into storage.buckets (id, name, public) 
values ('question-images', 'question-images', true) 
on conflict do nothing;

create policy "public_read_question_images"
  on storage.objects for select
  using ( bucket_id = 'question-images' );

create policy "teacher_insert_question_images"
  on storage.objects for insert
  with check (
    bucket_id = 'question-images' and
    exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
  );

create policy "teacher_update_question_images"
  on storage.objects for update
  using (
    bucket_id = 'question-images' and owner = auth.uid() and
    exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
  );

create policy "teacher_delete_question_images"
  on storage.objects for delete
  using (
    bucket_id = 'question-images' and owner = auth.uid() and
    exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
  );
