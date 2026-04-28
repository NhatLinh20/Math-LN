import docx
import re
import json

doc = docx.Document(r"d:\OneDrive\Máy tính\ID-TOAN.docx")

taxonomy = {
    10: {'D': [], 'H': [], 'C': []},
    11: {'D': [], 'H': [], 'C': []},
    12: {'D': [], 'H': [], 'C': []}
}

current_grade = None
current_subject = None
current_chapter = None
current_lesson = None

for para in doc.paragraphs:
    text = para.text.strip()
    if not text:
        continue
        
    if text.upper().startswith("MỤC LỤC"):
        continue

    # Grade and Subject parsing
    text_upper = text.upper()
    if "ĐẠI SỐ" in text_upper or "GIẢI TÍCH" in text_upper or "THỐNG KÊ" in text_upper:
        if "10" in text_upper:
            current_grade = 10
            current_subject = 'D'
            continue
        elif "11" in text_upper:
            current_grade = 11
            current_subject = 'D'
            continue
        elif "12" in text_upper:
            current_grade = 12
            current_subject = 'D'
            continue
            
    if "HÌNH HỌC" in text_upper:
        if "10" in text_upper:
            current_grade = 10
            current_subject = 'H'
            continue
        elif "11" in text_upper:
            current_grade = 11
            current_subject = 'H'
            continue
        elif "12" in text_upper:
            current_grade = 12
            current_subject = 'H'
            continue
            
    if text_upper == "CHUYÊN ĐỀ 10" or text_upper.startswith("CHUYÊN ĐỀ 10"):
        # careful with "Chuyên đề 10" vs "Chuyên đề 1. Hệ phương trình..."
        if "CHUYÊN ĐỀ 10" in text_upper and "CHUYÊN ĐỀ 1." not in text_upper:
            current_grade = 10
            current_subject = 'C'
            continue
    if text_upper == "CHUYÊN ĐỀ 11" or text_upper.startswith("CHUYÊN ĐỀ 11"):
        if "CHUYÊN ĐỀ 11" in text_upper and "CHUYÊN ĐỀ 1." not in text_upper:
            current_grade = 11
            current_subject = 'C'
            continue
    if text_upper == "CHUYÊN ĐỀ 12" or text_upper.startswith("CHUYÊN ĐỀ 12"):
        if "CHUYÊN ĐỀ 12" in text_upper and "CHUYÊN ĐỀ 1." not in text_upper:
            current_grade = 12
            current_subject = 'C'
            continue

    # Chapter parsing
    chapter_match = re.match(r'(?:Chương|Chuyên đề)\s+(\d+)(?:\.|\:)\s*(.*)', text, re.IGNORECASE)
    if chapter_match:
        chapter_id = int(chapter_match.group(1))
        chapter_name = chapter_match.group(2).strip()
        current_chapter = {
            "id": chapter_id,
            "name": chapter_name,
            "lessons": []
        }
        if current_grade and current_subject:
            taxonomy[current_grade][current_subject].append(current_chapter)
        current_lesson = None
        continue
        
    # Lesson parsing
    lesson_match = re.match(r'(?:§|Bài)\s*(\d+)\.\s*(.*)', text, re.IGNORECASE)
    if lesson_match:
        lesson_id = int(lesson_match.group(1))
        lesson_name = lesson_match.group(2).strip()
        current_lesson = {
            "id": lesson_id,
            "name": lesson_name,
            "forms": []
        }
        if current_chapter is not None:
            current_chapter["lessons"].append(current_lesson)
        continue
        
    # Form parsing
    form_match = re.match(r'Dạng\s+(\d+)\s*:\s*\[.*?\]\s*(.*)', text, re.IGNORECASE)
    if form_match:
        form_id = int(form_match.group(1))
        form_name = form_match.group(2).strip()
        if current_lesson is not None:
            current_lesson["forms"].append({
                "id": form_id,
                "name": form_name
            })
        continue

# Clean up empty chapters or lessons
for g in taxonomy:
    for s in taxonomy[g]:
        taxonomy[g][s] = [c for c in taxonomy[g][s] if len(c["lessons"]) > 0]
        for c in taxonomy[g][s]:
            c["lessons"] = [l for l in c["lessons"] if len(l["forms"]) > 0]

# Write to file
ts_content = f"""// Auto-generated question taxonomy from ID-TOAN.docx

export const GRADES = [10, 11, 12] as const;

export const SUBJECT_TYPES = {{
  D: 'Đại số / Giải tích',
  H: 'Hình học',
  C: 'Chuyên đề',
}} as const;

export const DIFFICULTY = {{
  N: 'Nhận biết',
  H: 'Thông hiểu',
  V: 'Vận dụng',
  C: 'Vận dụng cao',
}} as const;

export interface TaxonomyNode {{
  id: number;
  name: string;
  lessons: {{
    id: number;
    name: string;
    forms: {{ id: number; name: string }}[];
  }}[];
}}

export const TAXONOMY: Record<number, Record<string, TaxonomyNode[]>> = {json.dumps(taxonomy, ensure_ascii=False, indent=2)};

// Logic Mapping mã Lớp để tạo ID
const GRADE_CODE_MAP: Record<number, string> = {{
  10: '0',
  11: '1',
  12: '2'
}};

/**
 * Hàm sinh mã câu hỏi tự động (Question ID Generator)
 */
export function generateQuestionId(
  grade: number,
  subjectType: string,
  chapter: number,
  difficulty: string,
  lesson: number,
  form: number
): string {{
  const gradeCode = GRADE_CODE_MAP[grade] || '0';
  const chapterCode = chapter === 10 ? '0' : chapter.toString();
  
  return `${{gradeCode}}${{subjectType}}${{chapterCode}}${{difficulty}}${{lesson}}-${{form}}`;
}}
"""

with open(r"d:\math-ln\lib\question-taxonomy.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Taxonomy generated successfully.")
