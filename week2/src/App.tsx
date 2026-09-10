import { Accordion } from './components/Accordion/Accordion';
import { usePagination } from './hooks/usePagination';

// Tạo mảng dữ liệu giả lập (Mock data)
const MOCK_PRODUCTS = Array.from({ length: 12 }, (_, i) => ({
  id: `prod-${i + 1}`,
  name: `Sản phẩm mẫu số ${i + 1}`,
  price: (i + 1) * 100000,
}));

function App() {
  // Sử dụng hook với generic type chỉ định, mỗi trang 5 items
  const {
    currentPage,
    totalPages,
    currentData,
    next,
    prev,
    goToPage
  } = usePagination(MOCK_PRODUCTS, 5);

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '50px' }}>

      {/* CỘT 1: ACCORDION */}
      <div>
        <h2>Bài 1: Accordion</h2>
        <Accordion defaultValue="panel-1">
          <Accordion.Item>
            <Accordion.Header value="panel-1">Thông tin sinh viên</Accordion.Header>
            <Accordion.Panel value="panel-1">
              <p>Họ tên: Lưu Việt Hoàng</p>
              <p>Môn học: Lập trình Web nâng cao</p>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header value="panel-2">Lịch sử học tập</Accordion.Header>
            <Accordion.Panel value="panel-2">
              <p>GPA: Đang cập nhật...</p>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* CỘT 2: PAGINATION */}
      <div>
        <h2>Bài 2: Custom Hook Pagination</h2>

        {/* Render danh sách sản phẩm của trang hiện tại */}
        <ul style={{ minHeight: '180px', paddingLeft: '20px' }}>
          {currentData.map((product) => (
            <li key={product.id} style={{ marginBottom: '8px' }}>
              <strong>{product.name}</strong> - {product.price.toLocaleString()} VNĐ
            </li>
          ))}
        </ul>

        {/* Cụm nút điều hướng */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={prev} disabled={currentPage === 1}>
            Trang trước
          </button>

          <span>
            Trang {currentPage} / {totalPages}
          </span>

          <button onClick={next} disabled={currentPage === totalPages}>
            Trang sau
          </button>
        </div>

        {/* Chức năng goToPage */}
        <div style={{ marginTop: '15px' }}>
          <button onClick={() => goToPage(1)}>Về trang 1</button>
          <button onClick={() => goToPage(totalPages)} style={{ marginLeft: '5px' }}>
            Đến trang cuối
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;