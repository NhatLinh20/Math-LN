-- 1. Xóa bỏ Policy gây rò rỉ (Leak) đáp án
DROP POLICY IF EXISTS "questions_read_published" ON questions;

-- 2. Tạo lại Policy: Chỉ giáo viên mới được phép đọc trực tiếp bảng questions
-- Học sinh sẽ phải đọc qua view questions_public (nơi đã bị ẩn cột correct_answer)
CREATE POLICY "questions_read_teacher"
  ON questions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
  );

-- 3. Xử lý rò rỉ Access Code trên bảng exam_sets
-- Vì hiện tại học sinh được quyền SELECT toàn bộ exam_sets (nên sẽ thấy access_code).
-- Chúng ta cần ẩn nó đi ở cấp độ truy vấn của học sinh. 
-- Một cách tiếp cận an toàn mà không làm hỏng code Client là dùng Column-level Security (Tuy nhiên Supabase chưa support hoàn toàn trên dashboard).
-- Giải pháp thực tiễn ở đây: Chúng ta sẽ thu hồi quyền SELECT `access_code` của PUBLIC, nhưng vì không được, ta tạo một view:

CREATE OR REPLACE VIEW exam_sets_public AS 
SELECT 
  id, created_by, title, description, grade, duration_minutes, is_published, created_at,
  (access_code IS NOT NULL) as has_access_code -- Chỉ trả về boolean, không trả về giá trị chuỗi thật
FROM exam_sets;

-- Tuy nhiên, để không làm hỏng flow hiện tại, tôi đã tạo script vá bảo mật này để đội dev review.
