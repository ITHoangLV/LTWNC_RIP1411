import { PaymentStatus, PaymentMethod } from "../../common/enums/payment.enum";
import { ApiResponse, PaginatedResponse } from "../../common/types/api.type";
import { Customer, CreateCustomerInput } from "../../modules/customer/customer.type";
import { Product, CreateProductInput, UpdateProductInput, ProductSummary } from "../../modules/product/product.type";
import { OrderStatus } from "../../modules/order/order.enum";
import { Order, OrderItem } from "../../modules/order/order.type";

// ─── Product ──────────────────────────────────────────────────────────────────

const sampleProduct: Product = {
  id: "prod-001",
  name: "Áo thun nam basic",
  price: 199000,
  stock: 50,
  category: "Thời trang nam",
  description: "Áo thun cotton 100%, form regular fit",
};

const newProductInput: CreateProductInput = {
  name: "Quần jeans nữ",
  price: 450000,
  stock: 30,
  category: "Thời trang nữ",
  description: "Quần jeans skinny, chất liệu denim co giãn",
};

const updateProductInput: UpdateProductInput = {
  price: 420000,
  stock: 25,
};

const productSummary: ProductSummary = {
  id: "prod-001",
  name: "Áo thun nam basic",
  price: 199000,
  category: "Thời trang nam",
};

// ─── Customer ─────────────────────────────────────────────────────────────────

const sampleCustomer: Customer = {
  id: "cust-001",
  name: "Nguyễn Văn An",
  email: "an.nguyen@email.com",
  phone: "0901234567",
  address: {
    street: "123 Lê Lợi",
    city: "Quận 1",
    province: "TP. Hồ Chí Minh",
    zipCode: "70000",
  },
};

const newCustomerInput: CreateCustomerInput = {
  name: "Trần Thị Bình",
  email: "binh.tran@email.com",
  phone: "0912345678",
  address: {
    street: "456 Nguyễn Huệ",
    city: "Quận 3",
    province: "TP. Hồ Chí Minh",
    zipCode: "70000",
  },
};

// ─── Order ────────────────────────────────────────────────────────────────────

const sampleOrderItem: OrderItem = {
  product: {
    id: sampleProduct.id,
    name: sampleProduct.name,
    price: sampleProduct.price,
  },
  quantity: 2,
  unitPrice: 199000,
  subtotal: 398000,
};

const sampleOrder: Order = {
  id: "ord-001",
  customer: {
    id: sampleCustomer.id,
    name: sampleCustomer.name,
    email: sampleCustomer.email,
    phone: sampleCustomer.phone,
  },
  items: [sampleOrderItem],
  totalAmount: 398000,
  status: OrderStatus.Confirmed,
  paymentStatus: PaymentStatus.Paid,
  paymentMethod: PaymentMethod.BankTransfer,
  createdAt: new Date("2026-08-28T08:00:00Z"),
};

// ─── ApiResponse ──────────────────────────────────────────────────────────────

const orderResponse: ApiResponse<Order> = {
  success: true,
  message: "Lấy thông tin đơn hàng thành công",
  data: sampleOrder,
  timestamp: new Date().toISOString(),
};

const productResponse: ApiResponse<Product> = {
  success: true,
  message: "Lấy thông tin sản phẩm thành công",
  data: sampleProduct,
  timestamp: new Date().toISOString(),
};

const errorResponse: ApiResponse<Order> = {
  success: false,
  message: "Không tìm thấy đơn hàng",
  data: null,
  timestamp: new Date().toISOString(),
};

const paginatedOrders: PaginatedResponse<Order> = {
  items: [sampleOrder],
  total: 1,
  page: 1,
  pageSize: 10,
};

export {
  sampleProduct,
  newProductInput,
  updateProductInput,
  productSummary,
  sampleCustomer,
  newCustomerInput,
  sampleOrderItem,
  sampleOrder,
  orderResponse,
  productResponse,
  errorResponse,
  paginatedOrders,
};
