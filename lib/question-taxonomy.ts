// Bước 4 — Lib: Question Taxonomy
// Auto-generated question taxonomy from ID-TOAN.docx

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

export interface TaxonomyNode {
  id: number;
  name: string;
  lessons: {
    id: number;
    name: string;
    forms: { id: number; name: string }[];
  }[];
}

export const TAXONOMY: Record<number, Record<string, TaxonomyNode[]>> = {
  "10": {
    "D": [
      {
        "id": 1,
        "name": "Mệnh đề. Tập hợp",
        "lessons": [
          {
            "id": 1,
            "name": "Mệnh đề",
            "forms": [
              {
                "id": 1,
                "name": "Xác định mệnh đề, mệnh đề chứa biến"
              },
              {
                "id": 2,
                "name": "Tính đúng-sai của mệnh đề"
              },
              {
                "id": 3,
                "name": "Phủ định của một mệnh đề"
              },
              {
                "id": 4,
                "name": "Mệnh đề kéo theo, mệnh đề đảo, mệnh đề tương đương"
              },
              {
                "id": 5,
                "name": "Mệnh đề với mọi, tồn tại (và phủ định chúng)"
              },
              {
                "id": 6,
                "name": "Áp dụng mệnh đề vào suy luận có lí"
              }
            ]
          },
          {
            "id": 2,
            "name": "Tập hợp",
            "forms": [
              {
                "id": 1,
                "name": "Tập hợp và phần tử của tập hợp"
              },
              {
                "id": 2,
                "name": "Tập hợp con. Hai tập hợp bằng nhau"
              },
              {
                "id": 3,
                "name": "Ký hiệu khoảng, đoạn, nửa khoảng"
              }
            ]
          },
          {
            "id": 3,
            "name": "Các phép toán tập hợp",
            "forms": [
              {
                "id": 1,
                "name": "Giao và hợp của hai tập hợp (rời rạc)"
              },
              {
                "id": 2,
                "name": "Hiệu và phần bù của hai tập hợp (rời rạc)"
              },
              {
                "id": 3,
                "name": "Giao và hợp (dùng đoạn, khoảng)"
              },
              {
                "id": 4,
                "name": "Hiệu và phần bù (dùng đoạn, khoảng)"
              },
              {
                "id": 5,
                "name": "Toán thực tế ứng dụng của tập hợp"
              }
            ]
          }
        ]
      },
      {
        "id": 2,
        "name": "BPT và hệ BPT bậc nhất hai ẩn",
        "lessons": [
          {
            "id": 1,
            "name": "Bất phương trình bậc nhất hai ẩn",
            "forms": [
              {
                "id": 1,
                "name": "Các khái niệm về BPT bậc nhất hai ẩn"
              },
              {
                "id": 2,
                "name": "Miền nghiệm của BPT bậc nhất hai ẩn"
              },
              {
                "id": 3,
                "name": "Toán thực tế về BPT bậc nhất hai ẩn"
              }
            ]
          },
          {
            "id": 2,
            "name": "Hệ bất phương trình bậc nhất hai ẩn",
            "forms": [
              {
                "id": 1,
                "name": "Các khái niệm về Hệ BPT bậc nhất hai ẩn"
              },
              {
                "id": 2,
                "name": "Miền nghiệm của Hệ BPT bậc nhất hai ẩn"
              },
              {
                "id": 3,
                "name": "Toán thực tế về Hệ BPT bậc nhất hai ẩn"
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "name": "Hàm số bậc hai và đồ thị",
        "lessons": [
          {
            "id": 1,
            "name": "Hàm số và đồ thị",
            "forms": [
              {
                "id": 1,
                "name": "Xác định một hàm số"
              },
              {
                "id": 2,
                "name": "Tập xác định của hàm số"
              },
              {
                "id": 3,
                "name": "Giá trị của hàm số"
              },
              {
                "id": 4,
                "name": "Đồ thị của hàm số"
              },
              {
                "id": 5,
                "name": "Tính đồng biến, nghịch biến"
              },
              {
                "id": 6,
                "name": "Tính chẵn, lẻ"
              },
              {
                "id": 7,
                "name": "Toán thực tế về hàm số"
              }
            ]
          },
          {
            "id": 2,
            "name": "Hàm số bậc hai",
            "forms": [
              {
                "id": 1,
                "name": "Xác định hàm số bậc hai"
              },
              {
                "id": 2,
                "name": "Bảng biến thiên, tính đơn điệu, max, min"
              },
              {
                "id": 3,
                "name": "Đồ thị của hàm số bậc hai"
              },
              {
                "id": 4,
                "name": "Bài toán về sự tương giao"
              },
              {
                "id": 5,
                "name": "Hàm số chứa dấu giá trị tuyệt đối"
              },
              {
                "id": 6,
                "name": "Toán thực tế ứng dụng hàm số bậc hai"
              }
            ]
          }
        ]
      },
      {
        "id": 6,
        "name": "Thống kê",
        "lessons": [
          {
            "id": 1,
            "name": "Số gần đúng. Sai số",
            "forms": [
              {
                "id": 1,
                "name": "Tính và ước lượng sai số tuyệt đối, tương đối"
              },
              {
                "id": 2,
                "name": "Tính và xác định độ chính xác của kết quả"
              },
              {
                "id": 3,
                "name": "Quy tròn số gần đúng"
              },
              {
                "id": 4,
                "name": "Viết số gần đúng cho số đúng biết độ chính xác"
              }
            ]
          },
          {
            "id": 2,
            "name": "Mô tả và biểu diễn dữ liệu trên các bảng và biểu đồ",
            "forms": [
              {
                "id": 1,
                "name": "Đọc và phân tích thông tin trên bảng số liệu"
              },
              {
                "id": 2,
                "name": "Đọc và phân tích thông tin trên biểu đồ"
              },
              {
                "id": 3,
                "name": "Số liệu bất thường trên bảng số liệu"
              },
              {
                "id": 4,
                "name": "Số liệu bất thường trên biểu đồ"
              }
            ]
          },
          {
            "id": 3,
            "name": "Các số đặc trưng đo xu thế trung tâm của mẫu số liệu",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Số trung bình cộng"
              },
              {
                "id": 3,
                "name": "Số trung vị"
              },
              {
                "id": 4,
                "name": "Tứ phân vị"
              },
              {
                "id": 5,
                "name": "Mốt"
              }
            ]
          },
          {
            "id": 4,
            "name": "Các số đặc trưng đo mức độ phân tán của mẫu số liệu",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Khoảng biến thiên, khoảng tứ phân vị"
              },
              {
                "id": 3,
                "name": "Giá trị bất thường của mẫu số liệu"
              },
              {
                "id": 4,
                "name": "Phương sai, độ lệch chuẩn của mẫu số liệu"
              }
            ]
          }
        ]
      },
      {
        "id": 7,
        "name": "Bất phương trình bậc 2 một ẩn",
        "lessons": [
          {
            "id": 1,
            "name": "Dấu của tam thức bậc 2",
            "forms": [
              {
                "id": 1,
                "name": "Xác định tam thức bậc 2"
              },
              {
                "id": 2,
                "name": "Dấu của tam thức bậc 2 và ứng dụng"
              },
              {
                "id": 3,
                "name": "Bài toán xét dấu biết BXD, đồ thị"
              },
              {
                "id": 4,
                "name": "Xét dấu biểu thức dạng tích, thương"
              },
              {
                "id": 5,
                "name": "Toán thực tế ứng dụng dấu tam thức bậc 2"
              }
            ]
          },
          {
            "id": 2,
            "name": "Giải bất phương trình bậc 2 một ẩn",
            "forms": [
              {
                "id": 1,
                "name": "Bất phương trình bậc 2 và ứng dụng"
              },
              {
                "id": 2,
                "name": "Giải bất phương trình bậc hai biết BXD, đồ thị"
              },
              {
                "id": 3,
                "name": "Bất phương trình dạng tích, thương"
              },
              {
                "id": 4,
                "name": "Hệ bất phương trình BPT bậc 2"
              },
              {
                "id": 5,
                "name": "Bất phương trình chứa căn, | · |"
              },
              {
                "id": 6,
                "name": "Bài toán có tham số m"
              },
              {
                "id": 7,
                "name": "Toán thực tế ứng dụng bất phương trình bậc 2 một ẩn"
              }
            ]
          },
          {
            "id": 3,
            "name": "Phương trình quy về phương trình bậc hai",
            "forms": [
              {
                "id": 1,
                "name": "Phương trình căn √(f(x)) = √(g(x)) và mở rộng"
              },
              {
                "id": 2,
                "name": "Phương trình căn √(f(x)) = g(x) và mở rộng"
              },
              {
                "id": 3,
                "name": "Phương trình căn thức có tham số"
              },
              {
                "id": 4,
                "name": "Phương trình căn thức (dạng khác)"
              },
              {
                "id": 5,
                "name": "Phương trình khác quy về phương trình bậc 2"
              },
              {
                "id": 6,
                "name": "Toán hình, toán thực tế ứng dụng phương trình quy về bậc 2"
              }
            ]
          }
        ]
      },
      {
        "id": 8,
        "name": "Đại số tổ hợp",
        "lessons": [
          {
            "id": 1,
            "name": "Quy tắc cộng-quy tắc nhân",
            "forms": [
              {
                "id": 1,
                "name": "Bài toán chỉ sử dụng quy tắc cộng"
              },
              {
                "id": 2,
                "name": "Bài toán chỉ sử dụng quy tắc nhân"
              },
              {
                "id": 3,
                "name": "Bài toán kết hợp quy tắc cộng và quy tắc nhân"
              },
              {
                "id": 4,
                "name": "Bài toán dùng quy tắc bù trừ"
              },
              {
                "id": 5,
                "name": "Bài toán đếm số tự nhiên"
              },
              {
                "id": 6,
                "name": "Sơ đồ hình cây"
              }
            ]
          },
          {
            "id": 2,
            "name": "Hoán vị. Chỉnh hợp. Tổ hợp",
            "forms": [
              {
                "id": 1,
                "name": "Lý thuyết tổng hợp về P, C, A"
              },
              {
                "id": 2,
                "name": "Bài toán có biểu thức P, C, A"
              },
              {
                "id": 3,
                "name": "Bài toán đếm số tự nhiên"
              },
              {
                "id": 4,
                "name": "Bài toán chọn người"
              },
              {
                "id": 5,
                "name": "Bài toán chọn đối tượng khác"
              },
              {
                "id": 6,
                "name": "Bài toán có yếu tố hình học"
              },
              {
                "id": 7,
                "name": "Bài toán xếp chỗ (không tròn, không lặp)"
              },
              {
                "id": 8,
                "name": "Hoán vị bàn tròn"
              },
              {
                "id": 9,
                "name": "Hoán vị lặp"
              }
            ]
          },
          {
            "id": 3,
            "name": "Nhị thức Newton",
            "forms": [
              {
                "id": 1,
                "name": "Các câu hỏi lý thuyết tổng hợp"
              },
              {
                "id": 2,
                "name": "Khai triển một nhị thức Newton"
              },
              {
                "id": 3,
                "name": "Tìm hệ số, số hạng trong khai triển bằng tam giác Pascal"
              },
              {
                "id": 4,
                "name": "Tìm hệ số, số hạng trong khai triển"
              },
              {
                "id": 5,
                "name": "Tính tổng nhờ khai triển nhị thức Newton"
              },
              {
                "id": 6,
                "name": "Toán tổ hợp có dùng nhị thức Newton"
              }
            ]
          }
        ]
      },
      {
        "id": 10,
        "name": "Xác suất",
        "lessons": [
          {
            "id": 1,
            "name": "Không gian mẫu và biến cố",
            "forms": [
              {
                "id": 1,
                "name": "Các câu hỏi lý thuyết tổng hợp"
              },
              {
                "id": 2,
                "name": "Mô tả không gian mẫu, biến cố"
              },
              {
                "id": 3,
                "name": "Đếm phần tử không gian mẫu, biến cố"
              }
            ]
          },
          {
            "id": 2,
            "name": "Xác suất của biến cố",
            "forms": [
              {
                "id": 1,
                "name": "Các câu hỏi lý thuyết tổng hợp"
              },
              {
                "id": 2,
                "name": "Liên quan xúc xắc, đồng tiền (PP liệt kê)"
              },
              {
                "id": 3,
                "name": "Liên quan việc sắp xếp chỗ"
              },
              {
                "id": 4,
                "name": "Liên quan việc chọn người"
              },
              {
                "id": 5,
                "name": "Liên quan việc chọn đối tượng khác"
              },
              {
                "id": 6,
                "name": "Liên quan hình học"
              },
              {
                "id": 7,
                "name": "Liên quan việc đếm số"
              },
              {
                "id": 8,
                "name": "Liên quan bàn tròn hoặc hoán vị lặp"
              },
              {
                "id": 9,
                "name": "Liên quan vấn đề khác"
              }
            ]
          }
        ]
      }
    ],
    "H": [
      {
        "id": 4,
        "name": "Hệ thức lượng trong tam giác",
        "lessons": [
          {
            "id": 1,
            "name": "Giá trị lượng giác của góc (0 − 180∘)",
            "forms": [
              {
                "id": 1,
                "name": "Xét dấu của biểu thức lượng giác"
              },
              {
                "id": 2,
                "name": "Tính các giá trị lượng giác"
              },
              {
                "id": 3,
                "name": "Biến đổi, rút gọn biểu thức lượng giác"
              }
            ]
          },
          {
            "id": 2,
            "name": "Định lý sin và định lý côsin",
            "forms": [
              {
                "id": 1,
                "name": "Bài toán chỉ dùng định lý Sin, Côsin"
              },
              {
                "id": 2,
                "name": "Bài toán có dùng công thức diện tích"
              },
              {
                "id": 3,
                "name": "Biến đổi, rút gọn biểu thức"
              },
              {
                "id": 4,
                "name": "Nhận dạng tam giác"
              }
            ]
          },
          {
            "id": 3,
            "name": "Giải tam giác và ứng dụng thực tế",
            "forms": [
              {
                "id": 1,
                "name": "Giải tam giác"
              },
              {
                "id": 2,
                "name": "Các ứng dụng thực tế"
              }
            ]
          }
        ]
      },
      {
        "id": 5,
        "name": "Véctơ (chưa xét tọa độ)",
        "lessons": [
          {
            "id": 1,
            "name": "Khái niệm véctơ",
            "forms": [
              {
                "id": 1,
                "name": "Xác định một véctơ"
              },
              {
                "id": 2,
                "name": "Xét phương và hướng của các véctơ"
              },
              {
                "id": 3,
                "name": "Hai véctơ bằng nhau"
              },
              {
                "id": 4,
                "name": "Hai véctơ đối nhau"
              },
              {
                "id": 5,
                "name": "Độ dài của một véctơ"
              },
              {
                "id": 6,
                "name": "Toán thực tế áp dụng véctơ"
              }
            ]
          },
          {
            "id": 2,
            "name": "Tổng và hiệu của hai véctơ",
            "forms": [
              {
                "id": 1,
                "name": "Tính toán, thu gọn hiệu các véctơ"
              },
              {
                "id": 2,
                "name": "Tính đúng-sai của 1 đẳng thức véctơ"
              },
              {
                "id": 3,
                "name": "Tìm điểm nhờ đẳng thức véctơ"
              },
              {
                "id": 4,
                "name": "Tính độ dài của véctơ tổng, hiệu"
              },
              {
                "id": 5,
                "name": "Cực trị hình học"
              },
              {
                "id": 6,
                "name": "Toán thực tế áp dụng tổng hiệu véctơ"
              }
            ]
          },
          {
            "id": 3,
            "name": "Tích của một số với véctơ",
            "forms": [
              {
                "id": 1,
                "name": "Xác định k.v⃗ và độ dài của nó"
              },
              {
                "id": 2,
                "name": "Biến đổi, thu gọn 1 đẳng thức véctơ"
              },
              {
                "id": 3,
                "name": "Tìm điểm nhờ đẳng thức véctơ"
              },
              {
                "id": 4,
                "name": "Sự cùng phương của 2 véctơ và ứng dụng"
              },
              {
                "id": 5,
                "name": "Phân tích 1 véctơ theo 2 véctơ không cùng phương"
              },
              {
                "id": 6,
                "name": "Tính độ dài của véctơ tổng, hiệu"
              },
              {
                "id": 7,
                "name": "Tập hợp điểm"
              },
              {
                "id": 8,
                "name": "Cực trị hình học"
              },
              {
                "id": 9,
                "name": "Toán thực tế áp dụng tích 1 số với véctơ"
              }
            ]
          },
          {
            "id": 4,
            "name": "Tích vô hướng (chưa xét tọa độ)",
            "forms": [
              {
                "id": 1,
                "name": "Tích vô hướng, góc giữa 2 véctơ"
              },
              {
                "id": 2,
                "name": "Tìm góc nhờ tích vô hướng"
              },
              {
                "id": 3,
                "name": "Đẳng thức về tích vô hướng hoặc độ dài"
              },
              {
                "id": 4,
                "name": "Điều kiện vuông góc"
              },
              {
                "id": 5,
                "name": "Các bài toán tìm điểm và tập hợp điểm"
              },
              {
                "id": 6,
                "name": "Cực trị và chứng minh bất đẳng thức"
              },
              {
                "id": 7,
                "name": "Toán thực tế áp dụng tích vô hướng"
              }
            ]
          }
        ]
      },
      {
        "id": 9,
        "name": "Phương pháp toạ độ trong mặt phẳng (Oxy)",
        "lessons": [
          {
            "id": 1,
            "name": "Toạ độ của véctơ",
            "forms": [
              {
                "id": 1,
                "name": "Tọa độ điểm, độ dài đại số của véctơ trên 1 trục"
              },
              {
                "id": 2,
                "name": "Phép toán véctơ (tổng, hiệu, tích với số) trong Oxy"
              },
              {
                "id": 3,
                "name": "Tọa độ điểm và véctơ trên hệ trục Oxy"
              },
              {
                "id": 4,
                "name": "Sự cùng phương của 2 véctơ và ứng dụng"
              },
              {
                "id": 5,
                "name": "Phân tích một véctơ theo 2 véctơ không cùng phương"
              },
              {
                "id": 6,
                "name": "Toán thực tế dùng hệ toạ độ"
              }
            ]
          },
          {
            "id": 2,
            "name": "Tích vô hướng (theo tọa độ)",
            "forms": [
              {
                "id": 1,
                "name": "Tích vô hướng, góc giữa 2 véctơ"
              },
              {
                "id": 2,
                "name": "Tìm góc nhờ tích vô hướng"
              },
              {
                "id": 3,
                "name": "Đẳng thức về tích vô hướng hoặc độ dài"
              },
              {
                "id": 4,
                "name": "Điều kiện vuông góc"
              },
              {
                "id": 5,
                "name": "Các bài toán tìm điểm và tập hợp điểm"
              },
              {
                "id": 6,
                "name": "Cực trị và chứng minh bất đẳng thức"
              },
              {
                "id": 7,
                "name": "Toán thực tế, liên môn"
              }
            ]
          },
          {
            "id": 3,
            "name": "Đường thẳng trong mặt phẳng toạ độ",
            "forms": [
              {
                "id": 1,
                "name": "Điểm, véctơ, hệ số góc của đường thẳng"
              },
              {
                "id": 2,
                "name": "Phương trình đường thẳng"
              },
              {
                "id": 3,
                "name": "Vị trí tương đối giữa hai đường thẳng"
              },
              {
                "id": 4,
                "name": "Bài toán về góc giữa hai đường thẳng"
              },
              {
                "id": 5,
                "name": "Bài toán về khoảng cách"
              },
              {
                "id": 6,
                "name": "Bài toán tìm điểm"
              },
              {
                "id": 7,
                "name": "Bài toán dùng cho tam giác, tứ giác"
              },
              {
                "id": 8,
                "name": "Bài toán thực tế, PP tọa độ hóa"
              },
              {
                "id": 9,
                "name": "Bài toán có dùng PT chính tắc"
              }
            ]
          },
          {
            "id": 4,
            "name": "Đường tròn trong mặt phẳng toạ độ",
            "forms": [
              {
                "id": 1,
                "name": "Tìm tâm, bán kính và điều kiện là đường tròn"
              },
              {
                "id": 2,
                "name": "Phương trình đường tròn"
              },
              {
                "id": 3,
                "name": "Phương trình tiếp tuyến của đường tròn"
              },
              {
                "id": 4,
                "name": "Vị trí tương đối liên quan đường tròn"
              },
              {
                "id": 5,
                "name": "Toán tổng hợp đường thẳng và đường tròn"
              },
              {
                "id": 6,
                "name": "Bài toán dùng cho tam giác, tứ giác"
              },
              {
                "id": 7,
                "name": "Bài toán thực tế, PP tọa độ hóa"
              }
            ]
          },
          {
            "id": 5,
            "name": "Ba đường conic trong mặt phẳng toạ độ",
            "forms": [
              {
                "id": 1,
                "name": "Xác định các yếu tố của elip"
              },
              {
                "id": 2,
                "name": "Phương trình chính tắc của elip"
              },
              {
                "id": 3,
                "name": "Bài toán điểm trên elip"
              },
              {
                "id": 4,
                "name": "Xác định các yếu tố của hypebol"
              },
              {
                "id": 5,
                "name": "Phương trình chính tắc của hypebol"
              },
              {
                "id": 6,
                "name": "Bài toán điểm trên hypebol"
              },
              {
                "id": 7,
                "name": "Xác định các yếu tố của parabol"
              },
              {
                "id": 8,
                "name": "Phương trình chính tắc của parabol"
              },
              {
                "id": 9,
                "name": "Bài toán điểm trên parabol"
              },
              {
                "id": 0,
                "name": "Bài toán tổng hợp/thực tế, PP tọa độ hóa 3 đường conic"
              }
            ]
          }
        ]
      }
    ],
    "C": [
      {
        "id": 1,
        "name": "Hệ phương trình bậc nhất 3 ẩn và ứng dụng",
        "lessons": [
          {
            "id": 1,
            "name": "Hệ phương trình bậc nhất 3 ẩn và ứng dụng",
            "forms": [
              {
                "id": 1,
                "name": "Các khái niệm về Hệ PT bậc nhất 3 ẩn"
              },
              {
                "id": 2,
                "name": "Giải Hệ PT bậc nhất 3 ẩn"
              },
              {
                "id": 3,
                "name": "Toán thực tế ứng dụng Hệ PT bậc nhất 3 ẩn"
              }
            ]
          }
        ]
      },
      {
        "id": 2,
        "name": "Phương pháp quy nạp toán học",
        "lessons": [
          {
            "id": 1,
            "name": "Phương pháp quy nạp toán học",
            "forms": [
              {
                "id": 1,
                "name": "Quy nạp chứng minh các đẳng thức/công thức/chia hết"
              },
              {
                "id": 2,
                "name": "Quy nạp chứng minh các bất đẳng thứcNhị thức Newton. Gán trong Bài chính thức"
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "name": "Ba đường conic trong mặt phẳng toạ độ",
        "lessons": []
      }
    ]
  },
  "11": {
    "D": [
      {
        "id": 1,
        "name": "Hàm số lượng giác và phương trình lượng giác",
        "lessons": [
          {
            "id": 1,
            "name": "Góc lượng giác",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Chuyển đổi đơn vị độ và radian"
              },
              {
                "id": 3,
                "name": "Số đo của một góc lượng giác"
              },
              {
                "id": 4,
                "name": "Độ dài của một cung tròn"
              },
              {
                "id": 5,
                "name": "Đường tròn lượng giác và ứng dụng"
              },
              {
                "id": 6,
                "name": "Toán thực tế áp dụng góc lượng giác"
              }
            ]
          },
          {
            "id": 2,
            "name": "Giá trị lượng giác của một góc lượng giác",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Xét dấu giá trị lượng giác. Tính giá trị lượng giác của một góc"
              },
              {
                "id": 3,
                "name": "Biến đổi, rút gọn biểu thức lượng giác; chứng minh đẳng thức lượng giác"
              },
              {
                "id": 4,
                "name": "Các góc lượng giác có liên quan đặc biệt: bù nhau, phụ nhau, đối nhau, hơn kém nhau π"
              },
              {
                "id": 5,
                "name": "Toán thực tế áp dụng giá trị của một góc lượng giác"
              }
            ]
          },
          {
            "id": 3,
            "name": "Các công thức lượng giác",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Áp dụng công thức cộng"
              },
              {
                "id": 3,
                "name": "Áp dụng công thức nhân đôi - hạ bậc"
              },
              {
                "id": 4,
                "name": "Áp dụng công thức biến đổi tích <-> tổng"
              },
              {
                "id": 5,
                "name": "Kết hợp nhiều công thức lượng giác"
              },
              {
                "id": 6,
                "name": "Nhận dạng tam giác"
              },
              {
                "id": 7,
                "name": "Toán thực tế áp dụng công thức lượng giác"
              }
            ]
          },
          {
            "id": 4,
            "name": "Hàm số lượng giác và đồ thị",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Tìm tập xác định"
              },
              {
                "id": 3,
                "name": "Xét tính đơn điệu"
              },
              {
                "id": 4,
                "name": "Xét tính chẵn, lẻ"
              },
              {
                "id": 5,
                "name": "Xét tính tuần hoàn, tìm chu kỳ"
              },
              {
                "id": 6,
                "name": "Tìm tập giá trị và min, max"
              },
              {
                "id": 7,
                "name": "Bảng biến thiên và đồ thị"
              },
              {
                "id": 8,
                "name": "Toán thực tế áp dụng hàm số lượng giác"
              }
            ]
          },
          {
            "id": 5,
            "name": "Phương trình lượng giác cơ bản",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết. Khái niệm phương trình tương đương"
              },
              {
                "id": 2,
                "name": "Điều kiện có nghiệm"
              },
              {
                "id": 3,
                "name": "Phương trình cơ bản dùng Radian"
              },
              {
                "id": 4,
                "name": "Phương trình cơ bản dùng Độ"
              },
              {
                "id": 5,
                "name": "Phương trình đưa về dạng cơ bản"
              },
              {
                "id": 6,
                "name": "Toán thực tế áp dụng phương trình lượng giác"
              }
            ]
          },
          {
            "id": 6,
            "name": "[Giảm] Phương trình lượng giác thường gặp",
            "forms": [
              {
                "id": 1,
                "name": "Phương trình bậc n theo một hàm số lượng giác"
              },
              {
                "id": 2,
                "name": "Phương trình đẳng cấp bậc n đối với sinx và cosx"
              },
              {
                "id": 3,
                "name": "Phương trình bậc nhất đối với sinx và cosx"
              },
              {
                "id": 4,
                "name": "Phương trình đối xứng, phản đối xứng"
              },
              {
                "id": 5,
                "name": "Phương trình lượng giác không mẫu mực"
              },
              {
                "id": 6,
                "name": "Phương trình lượng giác có chứa ẩn ở mẫu số"
              },
              {
                "id": 7,
                "name": "Phương trình lượng giác có chứa tham số"
              },
              {
                "id": 8,
                "name": "Toán thực tế áp dụng phương trình lượng giác thường gặp"
              }
            ]
          }
        ]
      },
      {
        "id": 2,
        "name": "Dãy số. Cấp số cộng. Cấp số nhân",
        "lessons": [
          {
            "id": 1,
            "name": "Dãy số",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Số hạng tổng quát, biểu diễn dãy số"
              },
              {
                "id": 3,
                "name": "Tìm số hạng cụ thể của dãy số"
              },
              {
                "id": 4,
                "name": "Dãy số tăng, dãy số giảm"
              },
              {
                "id": 5,
                "name": "Dãy số bị chặn"
              },
              {
                "id": 6,
                "name": "Toán thực tế áp dụng dãy số"
              }
            ]
          },
          {
            "id": 2,
            "name": "Cấp số cộng",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Nhận diện cấp số cộng, công sai d"
              },
              {
                "id": 3,
                "name": "Số hạng tổng quát của cấp số cộng"
              },
              {
                "id": 4,
                "name": "Tìm số hạng cụ thể trong cấp số cộng"
              },
              {
                "id": 5,
                "name": "Điều kiện để dãy số là cấp số cộng"
              },
              {
                "id": 6,
                "name": "Tính tổng của cấp số cộng"
              },
              {
                "id": 7,
                "name": "Toán thực tế áp dụng cấp số cộng"
              }
            ]
          },
          {
            "id": 3,
            "name": "Cấp số nhân",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Nhận diện cấp số nhân, công bội q"
              },
              {
                "id": 3,
                "name": "Số hạng tổng quát của cấp số nhân"
              },
              {
                "id": 4,
                "name": "Tìm số hạng cụ thể trong cấp số nhân"
              },
              {
                "id": 5,
                "name": "Điều kiện để dãy số là cấp số nhân"
              },
              {
                "id": 6,
                "name": "Tính tổng của cấp số nhân"
              },
              {
                "id": 7,
                "name": "Kết hợp cấp số nhân và cấp số cộng"
              },
              {
                "id": 8,
                "name": "Toán thực tế áp dụng cấp số nhân"
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "name": "Giới hạn. Hàm số liên tục",
        "lessons": [
          {
            "id": 1,
            "name": "Giới hạn của dãy số",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Phương pháp đặt thừa số chung (lim hữu hạn)"
              },
              {
                "id": 3,
                "name": "Phương pháp lượng liên hợp (lim hữu hạn)"
              },
              {
                "id": 4,
                "name": "Giới hạn vô cực"
              },
              {
                "id": 5,
                "name": "Cấp số nhân lùi vô hạn"
              },
              {
                "id": 6,
                "name": "Toán thực tế áp dụng giới hạn của dãy số"
              }
            ]
          },
          {
            "id": 2,
            "name": "Giới hạn của hàm số",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Thay số trực tiếp"
              },
              {
                "id": 3,
                "name": "PP đặt thừa số chung, kết quả hữu hạn"
              },
              {
                "id": 4,
                "name": "PP đặt thừa số chung, kết quả vô cực"
              },
              {
                "id": 5,
                "name": "PP lượng liên hợp, kết quả hữu hạn"
              },
              {
                "id": 6,
                "name": "PP lượng liên hợp, kết quả vô cực"
              },
              {
                "id": 7,
                "name": "Giới hạn một bên"
              },
              {
                "id": 8,
                "name": "Toán thực tế áp dụng giới hạn của hàm số"
              }
            ]
          },
          {
            "id": 3,
            "name": "Hàm số liên tục",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Tính liên tục thể hiện qua đồ thị"
              },
              {
                "id": 3,
                "name": "Hàm số liên tục tại một điểm"
              },
              {
                "id": 4,
                "name": "Hàm số liên tục trên khoảng, đoạn"
              },
              {
                "id": 5,
                "name": "Bài toán phương trình có nghiệm"
              },
              {
                "id": 6,
                "name": "Toán thực tế áp dụng hàm số liên tục"
              }
            ]
          }
        ]
      },
      {
        "id": 5,
        "name": "Các số đặc trưng đo xu thế trung tâm cho mẫu số liệu ghép nhóm",
        "lessons": [
          {
            "id": 1,
            "name": "Số trung bình và mốt của mẫu số liệu ghép nhóm",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Mẫu số liệu ghép nhóm"
              },
              {
                "id": 3,
                "name": "Số trung bình"
              },
              {
                "id": 4,
                "name": "Mốt"
              }
            ]
          },
          {
            "id": 2,
            "name": "Trung vị và tứ phân vị của mẫu số liệu ghép nhóm",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Trung vị"
              },
              {
                "id": 3,
                "name": "Tứ phân vị"
              }
            ]
          }
        ]
      },
      {
        "id": 6,
        "name": "Hàm số mũ và hàm số lôgarít",
        "lessons": [
          {
            "id": 1,
            "name": "Phép tính luỹ thừa",
            "forms": [
              {
                "id": 1,
                "name": "Tính giá trị của biểu thức chứa lũy thừa"
              },
              {
                "id": 2,
                "name": "Biến đổi, rút gọn biểu thức chứa lũy thừa"
              },
              {
                "id": 3,
                "name": "Điều kiện cho luỹ thừa, căn thức"
              },
              {
                "id": 4,
                "name": "So sánh các lũy thừa"
              }
            ]
          },
          {
            "id": 2,
            "name": "Phép tính lôgarít",
            "forms": [
              {
                "id": 1,
                "name": "Tính giá trị biểu thức chứa lôgarít"
              },
              {
                "id": 2,
                "name": "Biến đổi, biểu diễn biểu thức chứa lôgarít"
              },
              {
                "id": 3,
                "name": "Rút gọn, chứng minh biểu thức lôgarít"
              },
              {
                "id": 4,
                "name": "Số e và bài toán lãi kép"
              },
              {
                "id": 5,
                "name": "Toán thực tế áp dụng phép tính lôgarít"
              }
            ]
          },
          {
            "id": 3,
            "name": "Hàm số mũ. Hàm số lôgarít",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết hàm số lũy thừa, mũ, lôgarít"
              },
              {
                "id": 2,
                "name": "Tập xác định của hàm số"
              },
              {
                "id": 3,
                "name": "Sự biến thiên và đồ thị của hàm số mũ, lôgarít"
              },
              {
                "id": 4,
                "name": "So sánh các luỹ thừa và lôgarít"
              },
              {
                "id": 5,
                "name": "Toán thực tế áp dụng hàm số mũ, lôgarít"
              }
            ]
          },
          {
            "id": 4,
            "name": "Phương trình, bất phương trình mũ và lôgarít",
            "forms": [
              {
                "id": 1,
                "name": "Điều kiện có nghiệm"
              },
              {
                "id": 2,
                "name": "Phương trình mũ, lôgarít cơ bản"
              },
              {
                "id": 3,
                "name": "Bất phương trình mũ, lôgarít cơ bản"
              },
              {
                "id": 4,
                "name": "Phương trình mũ, lôgarít đưa về cùng cơ số"
              },
              {
                "id": 5,
                "name": "Bất phương trình mũ, lôgarít đưa về cùng cơ số"
              },
              {
                "id": 6,
                "name": "Toán thực tế áp dụng phương trình mũ, lôgarít"
              }
            ]
          },
          {
            "id": 5,
            "name": "[Giảm] Các phương pháp giải được giảm tải",
            "forms": [
              {
                "id": 1,
                "name": "Phương pháp đặt ẩn phụ cho PT mũ, lôgarít"
              },
              {
                "id": 2,
                "name": "Phương pháp lôgarít hóa, mũ cho PT mũ, lôgarít"
              },
              {
                "id": 3,
                "name": "Phương pháp hàm số, đánh giá cho PT mũ, lôgarít"
              },
              {
                "id": 4,
                "name": "Hệ PT mũ, lôgarít"
              },
              {
                "id": 5,
                "name": "Toán thực tế áp dụng phương trình mũ, lôgarít"
              }
            ]
          }
        ]
      },
      {
        "id": 7,
        "name": "Đạo hàm",
        "lessons": [
          {
            "id": 1,
            "name": "Đạo hàm",
            "forms": [
              {
                "id": 1,
                "name": "Tính đạo hàm bằng định nghĩa"
              },
              {
                "id": 2,
                "name": "Số gia hàm số, số gia biến số"
              },
              {
                "id": 3,
                "name": "Ý nghĩa Hình học của đạo hàm"
              },
              {
                "id": 4,
                "name": "Ý nghĩa Vật lý của đạo hàm"
              },
              {
                "id": 5,
                "name": "Toán thực tế khác áp dụng định nghĩa đạo hàm"
              }
            ]
          },
          {
            "id": 2,
            "name": "Các quy tắc đạo hàm",
            "forms": [
              {
                "id": 1,
                "name": "Tính đạo hàm"
              },
              {
                "id": 2,
                "name": "Đẳng thức có y và y′"
              },
              {
                "id": 3,
                "name": "Tiếp tuyến tại một điểm"
              },
              {
                "id": 4,
                "name": "Tiếp tuyến biết trước hệ số góc"
              },
              {
                "id": 5,
                "name": "Tiếp tuyến chưa biết tiếp điểm và hệ số góc"
              },
              {
                "id": 6,
                "name": "Giới hạn hàm số lượng giác, hàm số mũ, lôgarít"
              },
              {
                "id": 7,
                "name": "Dùng đạo hàm cho nhị thức Newton"
              },
              {
                "id": 8,
                "name": "Toán thực tế áp dụng quy tắc đạo hàm"
              }
            ]
          },
          {
            "id": 3,
            "name": "Đạo hàm cấp hai",
            "forms": [
              {
                "id": 1,
                "name": "Tính đạo hàm cấp hai"
              },
              {
                "id": 2,
                "name": "Đẳng thức có y và (y′, y′′)"
              },
              {
                "id": 3,
                "name": "Toán thực tế và Ý nghĩa Vật lý của đạo hàm cấp hai"
              }
            ]
          }
        ]
      },
      {
        "id": 9,
        "name": "Xác suất",
        "lessons": [
          {
            "id": 1,
            "name": "Biến cố giao và quy tắc nhân xác suất",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lí thuyết"
              },
              {
                "id": 2,
                "name": "Xác định và đếm số phần tử biến cố giao"
              },
              {
                "id": 3,
                "name": "Công thức nhân xác suất cho 2 biến cố độc lập"
              },
              {
                "id": 4,
                "name": "Tính xác suất biến cố giao bằng sơ đồ hình cây"
              }
            ]
          },
          {
            "id": 2,
            "name": "Biến cố hợp và quy tắc cộng xác suất",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lí thuyết"
              },
              {
                "id": 2,
                "name": "Xác định và đếm số phần tử biến cố hợp"
              },
              {
                "id": 3,
                "name": "Quy tắc cộng cho hai biến cố xung khắc"
              },
              {
                "id": 4,
                "name": "Quy tắc cộng cho hai biến cố bất kì"
              },
              {
                "id": 5,
                "name": "Tính xác suất biến cố hợp bằng sơ đồ hình cây"
              }
            ]
          }
        ]
      }
    ],
    "H": [
      {
        "id": 4,
        "name": "Đường thẳng, mặt phẳng. Quan hệ song song trong không gian",
        "lessons": [
          {
            "id": 1,
            "name": "Điểm, đường thẳng và mặt phẳng",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Hình biểu diễn của một hình không gian"
              },
              {
                "id": 3,
                "name": "Tìm giao tuyến của hai mặt phẳng"
              },
              {
                "id": 4,
                "name": "Tìm giao điểm của đường thẳng và mặt phẳng"
              },
              {
                "id": 5,
                "name": "Xác định thiết diện"
              },
              {
                "id": 6,
                "name": "Ba điểm thẳng hàng, ba đường thẳng đồng quy"
              },
              {
                "id": 7,
                "name": "Toán thực tế áp dụng điểm, đường thẳng và mặt phẳng"
              }
            ]
          },
          {
            "id": 2,
            "name": "Hai đường thẳng song song",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Hai đường thẳng song song"
              },
              {
                "id": 3,
                "name": "Tìm giao tuyến bằng cách kẻ song song"
              },
              {
                "id": 4,
                "name": "Tìm giao điểm của đường thẳng và mặt phẳng"
              },
              {
                "id": 5,
                "name": "Xác định thiết diện bằng cách kẻ song song"
              },
              {
                "id": 6,
                "name": "Ba điểm thẳng hàng"
              },
              {
                "id": 7,
                "name": "Bài toán quỹ tích và điểm cố định"
              },
              {
                "id": 8,
                "name": "Toán thực tế áp dụng hai đường thẳng song song"
              }
            ]
          },
          {
            "id": 3,
            "name": "Đường thẳng và mặt phẳng song song",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Đường thẳng song song với mặt phẳng"
              },
              {
                "id": 3,
                "name": "Tìm giao tuyến bằng cách kẻ song song"
              },
              {
                "id": 4,
                "name": "Tìm giao điểm của đường thẳng và mặt phẳng"
              },
              {
                "id": 5,
                "name": "Xác định thiết diện bằng cách kẻ song song"
              },
              {
                "id": 6,
                "name": "Ba điểm thẳng hàng"
              },
              {
                "id": 7,
                "name": "Bài toán quỹ tích và điểm cố định"
              },
              {
                "id": 8,
                "name": "Toán thực tế áp dụng đường thẳng song song mặt phẳng"
              }
            ]
          },
          {
            "id": 4,
            "name": "Hai mặt phẳng song song",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Hai mặt phẳng song song"
              },
              {
                "id": 3,
                "name": "Chứng minh đường thẳng song song mặt phẳng"
              },
              {
                "id": 4,
                "name": "Xác định mặt phẳng đi qua một điểm và song song với một mặt phẳng"
              },
              {
                "id": 5,
                "name": "Xác định mặt phẳng chứa đường thẳng (hoặc đi qua hai điểm) và song song với một mặt phẳng"
              },
              {
                "id": 6,
                "name": "Bài toán tổng hợp"
              },
              {
                "id": 7,
                "name": "Toán thực tế áp dụng hai mặt phẳng song song"
              }
            ]
          },
          {
            "id": 5,
            "name": "Hình lăng trụ và hình hộp (xiên)",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Bài toán về hình lăng trụ (xiên)"
              },
              {
                "id": 3,
                "name": "Bài toán về hình hộp (xiên)"
              },
              {
                "id": 4,
                "name": "Toán thực tế áp dụng hình lăng trụ và hình hộp"
              }
            ]
          },
          {
            "id": 6,
            "name": "Phép chiếu song song",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Hình biểu diễn của một hình không gian"
              },
              {
                "id": 3,
                "name": "Xác định yếu tố song song"
              },
              {
                "id": 4,
                "name": "Xác định phương chiếu"
              },
              {
                "id": 5,
                "name": "Tính tỉ số đoạn thẳng, diện tích qua phép chiếu"
              }
            ]
          }
        ]
      },
      {
        "id": 8,
        "name": "Quan hệ vuông góc trong không gian",
        "lessons": [
          {
            "id": 1,
            "name": "Hai đường thẳng vuông góc",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lí thuyết"
              },
              {
                "id": 2,
                "name": "Xác định hai đường thẳng vuông góc"
              },
              {
                "id": 3,
                "name": "Tìm góc giữa hai đường thẳng"
              },
              {
                "id": 4,
                "name": "Toán thực tế áp dụng hai đường thẳng vuông góc"
              }
            ]
          },
          {
            "id": 2,
            "name": "Đường thẳng vuông góc với mặt phẳng",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lí thuyết"
              },
              {
                "id": 2,
                "name": "Xác định hoặc chứng minh đường thẳng và mặt phẳng vuông góc"
              },
              {
                "id": 3,
                "name": "Xác định hoặc chứng minh hai đường thẳng vuông góc"
              },
              {
                "id": 4,
                "name": "Dựng mặt phẳng, tìm thiết diện"
              },
              {
                "id": 5,
                "name": "Hình chiếu vuông góc của một hình trên mặt phẳng (tìm điểm, tìm đoạn thẳng, tính diện tích)"
              },
              {
                "id": 6,
                "name": "Toán thực tế áp dụng đường thẳng vuông góc mặt phẳng"
              }
            ]
          },
          {
            "id": 3,
            "name": "Phép chiếu vuông góc",
            "forms": [
              {
                "id": 1,
                "name": "Lý thuyết về phép chiếu vuông góc"
              },
              {
                "id": 2,
                "name": "Hình chiếu vuông góc của đa giác trên mặt phẳng"
              },
              {
                "id": 3,
                "name": "Các bài toán thực tế áp dụng phép chiếu vuông góc"
              }
            ]
          },
          {
            "id": 4,
            "name": "Hai mặt phẳng vuông góc",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lí thuyết"
              },
              {
                "id": 2,
                "name": "Xác định/chứng minh đường thẳng vuông góc mặt phẳng, mặt phẳng vuông góc"
              },
              {
                "id": 3,
                "name": "Xác định góc giữa hai mặt phẳng"
              },
              {
                "id": 4,
                "name": "Dựng mặt phẳng, thiết diện"
              },
              {
                "id": 5,
                "name": "Nhận dạng và tính toán liên quan các hình thông dụng"
              },
              {
                "id": 6,
                "name": "Bài toán cho trước góc giữa d và (P)"
              },
              {
                "id": 7,
                "name": "Toán thực tế áp dụng hai mặt phẳng vuông góc"
              }
            ]
          },
          {
            "id": 5,
            "name": "Khoảng cách",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lí thuyết"
              },
              {
                "id": 2,
                "name": "Khoảng cách giữa 2 điểm, từ 1 điểm đến 1 đường thẳng"
              },
              {
                "id": 3,
                "name": "Khoảng cách từ một điểm đến một mặt phẳng"
              },
              {
                "id": 4,
                "name": "Khoảng cách giữa hai đường thẳng chéo nhau"
              },
              {
                "id": 5,
                "name": "Đường vuông góc chung của hai đường thẳng chéo nhau"
              },
              {
                "id": 6,
                "name": "Toán thực tế áp dụng khoảng cách"
              }
            ]
          },
          {
            "id": 6,
            "name": "Góc giữa đường thẳng và mặt phẳng. Góc nhị diện",
            "forms": [
              {
                "id": 1,
                "name": "Góc giữa đường thẳng và mặt phẳng"
              },
              {
                "id": 2,
                "name": "Góc nhị diện, góc phẳng nhị diện"
              },
              {
                "id": 3,
                "name": "Góc giữa 2 mặt phẳng, biết trước góc (d,(P))"
              },
              {
                "id": 4,
                "name": "Khoảng cách giữa điểm, đường, biết trước góc (d,(P))"
              },
              {
                "id": 5,
                "name": "Khoảng cách giữa điểm - mặt phẳng, biết trước góc (d,(P))"
              },
              {
                "id": 6,
                "name": "Khoảng cách giữa 2 đường chéo nhau, biết trước góc (d,(P))"
              },
              {
                "id": 7,
                "name": "Toán thực tế về góc đường thẳng, mặt phẳng, góc nhị diện"
              }
            ]
          },
          {
            "id": 7,
            "name": "Hình lăng trụ đứng. Hình chóp đều. Thể tích",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lí thuyết, công thức"
              },
              {
                "id": 2,
                "name": "Thể tích khối chóp tam giác"
              },
              {
                "id": 3,
                "name": "Thể tích khối chóp tứ giác"
              },
              {
                "id": 4,
                "name": "Thể tích khối lăng trụ tam giác"
              },
              {
                "id": 5,
                "name": "Thể tích khối lăng trụ tứ giác"
              },
              {
                "id": 6,
                "name": "Thể tích khối chóp cụt và các khối khác"
              },
              {
                "id": 7,
                "name": "Tỉ số thể tích"
              },
              {
                "id": 8,
                "name": "Ứng dụng thể tích tính góc, khoảng cách,. . ."
              },
              {
                "id": 9,
                "name": "Toán thực tế hình lăng trụ đứng, chóp đều, thể tích"
              }
            ]
          }
        ]
      }
    ],
    "C": [
      {
        "id": 1,
        "name": "Phép biến hình phẳng",
        "lessons": [
          {
            "id": 1,
            "name": "Phép biến hình, phép dời hình và hai hình bằng nhau",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Bài toán xác định một phép đặt tương ứng có là phép dời hình hay không?"
              },
              {
                "id": 3,
                "name": "Xác định ảnh khi thực hiện phép dời hình"
              }
            ]
          },
          {
            "id": 2,
            "name": "Phép tịnh tiến",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Tìm ảnh hoặc tạo ảnh khi thực hiện phép tịnh tiến"
              },
              {
                "id": 3,
                "name": "Ứng dụng phép tịnh tiến"
              }
            ]
          },
          {
            "id": 3,
            "name": "Phép đối xứng trục",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Tìm ảnh hoặc tạo ảnh khi thực hiện phép đối xứng trục"
              },
              {
                "id": 3,
                "name": "Xác định trục đối xứng và số trục đối xứng của một hình"
              },
              {
                "id": 4,
                "name": "Ứng dụng phép đối xứng trục"
              }
            ]
          },
          {
            "id": 4,
            "name": "Phép đối xứng tâm",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Tìm ảnh, tạo ảnh khi thực hiện phép đối xứng tâm"
              },
              {
                "id": 3,
                "name": "Xác định hình có tâm đối xứng"
              },
              {
                "id": 4,
                "name": "Ứng dụng phép đối xứng tâm"
              }
            ]
          },
          {
            "id": 5,
            "name": "Phép quay",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Xác định vị trí ảnh của điểm, hình khi thực hiện phép quay cho trước"
              },
              {
                "id": 3,
                "name": "Tìm tọa độ ảnh của điểm, phương trình của một đường thẳng khi thực hiện phép quay"
              },
              {
                "id": 4,
                "name": "Ứng dụng phép quay"
              }
            ]
          },
          {
            "id": 6,
            "name": "Phép vị tự",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Xác định ảnh, tạo ảnh khi thực hiện phép vị tự"
              },
              {
                "id": 3,
                "name": "Tìm tâm vị tự của hai đường tròn"
              },
              {
                "id": 4,
                "name": "Ứng dụng phép vị tự"
              }
            ]
          },
          {
            "id": 7,
            "name": "Phép đồng dạng",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Xác định ảnh, tạo ảnh khi thực hiện phép đồng dạng"
              }
            ]
          }
        ]
      },
      {
        "id": 2,
        "name": "Lý thuyết đồ thị",
        "lessons": [
          {
            "id": 1,
            "name": "Đồ thị",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi về đỉnh, cạnh của đồ thị"
              },
              {
                "id": 2,
                "name": "Câu hỏi về bậc của đồ thị"
              },
              {
                "id": 3,
                "name": "Câu hỏi tổng hợp"
              }
            ]
          },
          {
            "id": 2,
            "name": "Đường đi Euler và Harmilton",
            "forms": [
              {
                "id": 1,
                "name": "Đường đi Euler"
              },
              {
                "id": 2,
                "name": "Đường đi Harmilton"
              },
              {
                "id": 3,
                "name": "Câu hỏi tổng hợp"
              }
            ]
          },
          {
            "id": 3,
            "name": "Bài toán tìm đường đi ngắn nhất",
            "forms": [
              {
                "id": 1,
                "name": "Bài toán tìm đường đi ngắn nhất"
              },
              {
                "id": 2,
                "name": "Tổng hợp"
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "name": "Một số yếu tố vẽ kỹ thuật",
        "lessons": [
          {
            "id": 1,
            "name": "Hình biểu diễn của một hình, khối",
            "forms": [
              {
                "id": 1,
                "name": "Lý thuyết về phép chiếu và hình biểu diễn song song"
              },
              {
                "id": 2,
                "name": "Lý thuyết về phép chiếu vuông góc"
              },
              {
                "id": 3,
                "name": "Lý thuyết về phép chiếu trục đo"
              },
              {
                "id": 4,
                "name": "Tổng hợp"
              }
            ]
          },
          {
            "id": 2,
            "name": "Bản vẽ kỹ thuật",
            "forms": [
              {
                "id": 1,
                "name": "Lý thuyết cơ bản về bản vẽ kỹ thuật"
              },
              {
                "id": 2,
                "name": "Phương pháp biểu diễn bản vẽ kỹ thuật"
              },
              {
                "id": 3,
                "name": "Tổng hợp"
              }
            ]
          }
        ]
      }
    ]
  },
  "12": {
    "D": [
      {
        "id": 1,
        "name": "Ứng dụng đạo hàm để khảo sát hàm số",
        "lessons": [
          {
            "id": 1,
            "name": "Sự đồng biến và nghịch biến của hàm số",
            "forms": [
              {
                "id": 1,
                "name": "Xét tính đơn điệu của hàm số cho bởi công thức"
              },
              {
                "id": 2,
                "name": "Xét tính đơn điệu dựa vào bảng biến thiên, đồ thị"
              },
              {
                "id": 3,
                "name": "Tìm tham số m để hàm số đơn điệu"
              },
              {
                "id": 4,
                "name": "Ứng dụng tính đơn điệu để chứng minh bất đẳng thức, giải phương trình, bất phương trình, hệ phương trình"
              },
              {
                "id": 5,
                "name": "Toán thực tế ứng dụng sự đồng biến nghịch biến"
              }
            ]
          },
          {
            "id": 2,
            "name": "Cực trị của hàm số",
            "forms": [
              {
                "id": 1,
                "name": "Tìm cực trị của hàm số cho bởi công thức"
              },
              {
                "id": 2,
                "name": "Tìm cực trị dựa vào BBT, đồ thị"
              },
              {
                "id": 3,
                "name": "Tìm m để hàm số đạt cực trị tại 1 điểm x0 cho trước"
              },
              {
                "id": 4,
                "name": "Tìm m để hàm số, đồ thị hàm số bậc ba có cực trị thỏa mãn điều kiện"
              },
              {
                "id": 5,
                "name": "Tìm m để hàm số, đồ thị hàm số trùng phương có cực trị thỏa mãn điều kiện"
              },
              {
                "id": 6,
                "name": "Tìm m để hàm số, đồ thị hàm số các hàm số khác có cực trị thỏa mãn điều kiện"
              },
              {
                "id": 7,
                "name": "Toán thực tế ứng dụng cực trị của hàm số"
              }
            ]
          },
          {
            "id": 3,
            "name": "Giá trị lớn nhất và giá trị nhỏ nhất của hàm số",
            "forms": [
              {
                "id": 1,
                "name": "GTLN, GTNN trên đoạn [a; b]"
              },
              {
                "id": 2,
                "name": "GTLN, GTNN trên khoảng"
              },
              {
                "id": 3,
                "name": "Sử dụng các đánh giá, bất đẳng thức cổ điển"
              },
              {
                "id": 4,
                "name": "Ứng dụng GTNN, GTLN trong bài toán phương trình, bất phương trình, hệ phương trình"
              },
              {
                "id": 5,
                "name": "GTLN, GTNN hàm nhiều biến"
              },
              {
                "id": 6,
                "name": "Toán thực tế ứng dụng GTLN, GTNN của hàm số"
              }
            ]
          },
          {
            "id": 4,
            "name": "Đường tiệm cận",
            "forms": [
              {
                "id": 1,
                "name": "Bài toán xác định các đường tiệm cận của hàm số (không chứa tham số) hoặc biết BBT, đồ thị"
              },
              {
                "id": 2,
                "name": "Bài toán xác định các đường tiệm cận của hàm số có chứa tham số"
              },
              {
                "id": 3,
                "name": "Bài toán liên quan đến đồ thị hàm số và các đường tiệm cận"
              },
              {
                "id": 4,
                "name": "Toán thực tế ứng dụng tiệm cận"
              }
            ]
          },
          {
            "id": 5,
            "name": "Khảo sát sự biến thiên và vẽ đồ thị hàm số",
            "forms": [
              {
                "id": 1,
                "name": "Nhận dạng đồ thị"
              },
              {
                "id": 2,
                "name": "Các phép biến đổi đồ thị"
              },
              {
                "id": 3,
                "name": "Biện luận số giao điểm dựa vào đồ thị, bảng biến thiên"
              },
              {
                "id": 4,
                "name": "Sự tương giao của hai đồ thị (liên quan đến tọa độ giao điểm)"
              },
              {
                "id": 5,
                "name": "Đồ thị của hàm đạo hàm"
              },
              {
                "id": 6,
                "name": "Phương trình tiếp tuyến của đồ thị hàm số"
              },
              {
                "id": 7,
                "name": "Điểm đặc biệt của đồ thị hàm số"
              },
              {
                "id": 8,
                "name": "Toán thực tế ứng dụng khảo sát hàm số"
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "name": "Các số đặc trưng đo mức độ phân tán cho mẫu số liệu ghép nhóm",
        "lessons": [
          {
            "id": 1,
            "name": "Khoảng biến thiên, khoảng tứ phân vị của mẫu số liệu ghép nhóm",
            "forms": [
              {
                "id": 1,
                "name": "Công thức lý thuyết"
              },
              {
                "id": 2,
                "name": "Tìm khoảng biến thiên"
              },
              {
                "id": 3,
                "name": "Tìm khoảng tứ phân vị"
              },
              {
                "id": 4,
                "name": "Câu hỏi tổng hợp"
              }
            ]
          },
          {
            "id": 2,
            "name": "Phương sai, độ lệch chuẩn của mẫu số liệu ghép nhóm",
            "forms": [
              {
                "id": 1,
                "name": "Công thức lý thuyết"
              },
              {
                "id": 2,
                "name": "Tìm phương sai, độ lệch chuẩn"
              },
              {
                "id": 3,
                "name": "Câu hỏi tổng hợp"
              }
            ]
          }
        ]
      },
      {
        "id": 4,
        "name": "Nguyên hàm, tích phân và ứng dụng",
        "lessons": [
          {
            "id": 1,
            "name": "Nguyên hàm",
            "forms": [
              {
                "id": 1,
                "name": "Công thức lý thuyết"
              },
              {
                "id": 2,
                "name": "Nguyên hàm cơ bản đa thức, phân thức"
              },
              {
                "id": 3,
                "name": "Nguyên hàm cơ bản hàm lượng giác"
              },
              {
                "id": 4,
                "name": "Nguyên hàm cơ bản hàm mũ, luỹ thừa"
              },
              {
                "id": 5,
                "name": "Phương pháp đổi biến số cơ bản"
              },
              {
                "id": 6,
                "name": "Toán thực tế áp dụng nguyên hàm"
              }
            ]
          },
          {
            "id": 2,
            "name": "Tích phân",
            "forms": [
              {
                "id": 1,
                "name": "Công thức lý thuyết"
              },
              {
                "id": 2,
                "name": "Tích phân cơ bản đa thức, phân thức"
              },
              {
                "id": 3,
                "name": "Tích phân cơ bản hàm lượng giác"
              },
              {
                "id": 4,
                "name": "Tích phân cơ bản hàm mũ, luỹ thừa"
              },
              {
                "id": 5,
                "name": "Phương pháp đổi biến số cơ bản"
              },
              {
                "id": 6,
                "name": "Toán thực tế áp dụng nguyên hàm"
              }
            ]
          },
          {
            "id": 3,
            "name": "Ứng dụng thực tế và hình học của tích phân",
            "forms": [
              {
                "id": 1,
                "name": "Diện tích hình phẳng được giới hạn bởi các đồ thị"
              },
              {
                "id": 2,
                "name": "Bài toán thực tế sử dụng diện tích hình phẳng"
              },
              {
                "id": 3,
                "name": "Thể tích giới hạn bởi các đồ thị (tròn xoay)"
              },
              {
                "id": 4,
                "name": "Thể tích tính theo mặt cắt S(x)"
              },
              {
                "id": 5,
                "name": "Bài toán thực tế và ứng dụng thể tích tròn xoay, S(x)"
              }
            ]
          }
        ]
      },
      {
        "id": 6,
        "name": "Một số yếu tố xác suất",
        "lessons": [
          {
            "id": 1,
            "name": "Xác suất có điều kiện",
            "forms": [
              {
                "id": 1,
                "name": "Công thức lý thuyết"
              },
              {
                "id": 2,
                "name": "Tính xác suất có điều kiện bằng công thức"
              },
              {
                "id": 3,
                "name": "Tính xác suất có điều kiện bằng sơ đồ cây"
              },
              {
                "id": 4,
                "name": "Bài toán tổng hợp"
              }
            ]
          },
          {
            "id": 2,
            "name": "Công thức xác suất toàn phần. Công thức Bayes",
            "forms": [
              {
                "id": 1,
                "name": "Công thức lý thuyết"
              },
              {
                "id": 2,
                "name": "Tính xác suất bằng công thức xác suất toàn phần"
              },
              {
                "id": 3,
                "name": "Tính xác suất bằng công thức xác suất Bayes"
              },
              {
                "id": 4,
                "name": "Bài toán tổng hợp"
              }
            ]
          }
        ]
      }
    ],
    "H": [
      {
        "id": 2,
        "name": "Tọa độ của véc-tơ trong không gian",
        "lessons": [
          {
            "id": 1,
            "name": "Véc-tơ và các phép toán véc-tơ trong không gian (chưa toạ độ hoá)",
            "forms": [
              {
                "id": 1,
                "name": "Công thức lý thuyết"
              },
              {
                "id": 2,
                "name": "Tổng, hiệu, tích một số với véc-tơ"
              },
              {
                "id": 3,
                "name": "Tích vô hướng và ứng dụng"
              },
              {
                "id": 4,
                "name": "Toán thực tế áp dụng các phép toán véc-tơ"
              }
            ]
          },
          {
            "id": 2,
            "name": "Toạ độ của véc-tơ và các công thức",
            "forms": [
              {
                "id": 1,
                "name": "Công thức lý thuyết"
              },
              {
                "id": 2,
                "name": "Tìm tọa độ điểm"
              },
              {
                "id": 3,
                "name": "Tìm tọa độ véc-tơ"
              },
              {
                "id": 4,
                "name": "Công thức toạ độ của tích vô hướng và ứng dụng"
              },
              {
                "id": 5,
                "name": "Công thức toạ độ của tích có hướng và ứng dụng"
              },
              {
                "id": 6,
                "name": "Toán thực tế áp dụng các phép toán toạ độ hoá véc-tơ"
              }
            ]
          }
        ]
      },
      {
        "id": 5,
        "name": "Phương trình mặt phẳng, đường thẳng, mặt cầu trong không gian Oxyz",
        "lessons": [
          {
            "id": 1,
            "name": "Phương trình mặt phẳng",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Xác định véc-tơ pháp tuyến, cặp véc-tơ chỉ phương"
              },
              {
                "id": 3,
                "name": "Viết phương trình tổng quát mặt phẳng"
              },
              {
                "id": 4,
                "name": "Vị trí tương đối giữa hai mặt phẳng (song song, vuông góc)"
              },
              {
                "id": 5,
                "name": "Khoảng cách điểm tới mặt phẳng"
              },
              {
                "id": 6,
                "name": "Góc giữa hai mặt phẳng"
              },
              {
                "id": 7,
                "name": "Toán thực tế áp dụng phương trình mặt phẳng"
              }
            ]
          },
          {
            "id": 2,
            "name": "Phương trình đường thẳng trong không gian",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Xác định véc-tơ chỉ phương, cặp véc-tơ pháp tuyến"
              },
              {
                "id": 3,
                "name": "Viết phương trình tổng quát, chính tắc, tham số đường thẳng"
              },
              {
                "id": 4,
                "name": "Vị trí tương đối giữa hai đường thẳng"
              },
              {
                "id": 5,
                "name": "Vị trí tương đối giữa đường thẳng và mặt phẳng"
              },
              {
                "id": 6,
                "name": "Khoảng cách điểm tới đường thẳng"
              },
              {
                "id": 7,
                "name": "Góc giữa hai đường thẳng, đường thẳng và mặt phẳng"
              },
              {
                "id": 8,
                "name": "Toán thực tế áp dụng phương trình đường thẳng"
              }
            ]
          },
          {
            "id": 3,
            "name": "Phương trình mặt cầu trong không gian",
            "forms": [
              {
                "id": 1,
                "name": "Câu hỏi lý thuyết"
              },
              {
                "id": 2,
                "name": "Xác định tâm, bán kính, đường kính mặt cầu"
              },
              {
                "id": 3,
                "name": "Viết phương trình tổng quát mặt cầu"
              },
              {
                "id": 4,
                "name": "Toán thực tế áp dụng phương trình mặt cầu"
              }
            ]
          }
        ]
      }
    ],
    "C": []
  }
};

// Logic Mapping mã Lớp để tạo ID
const GRADE_CODE_MAP: Record<number, string> = {
  10: '0',
  11: '1',
  12: '2'
};

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
): string {
  const gradeCode = GRADE_CODE_MAP[grade] || '0';
  const chapterCode = chapter === 10 ? '0' : chapter.toString();
  
  return `${gradeCode}${subjectType}${chapterCode}${difficulty}${lesson}-${form}`;
}
