import docx
import sys
sys.stdout.reconfigure(encoding='utf-8')

doc = docx.Document(r"d:\OneDrive\Máy tính\ID-TOAN.docx")
for para in doc.paragraphs:
    if para.text.strip():
        print(para.text)
