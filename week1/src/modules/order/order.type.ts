import { PaymentStatus, PaymentMethod } from "../../common/enums/payment.enum";
import { CustomerBrief } from "../customer/customer.type";
import { Product } from "../product/product.type";
import { OrderStatus } from "./order.enum";

interface OrderItem {
  product: Pick<Product, "id" | "name" | "price">;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  id: string;
  customer: CustomerBrief;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: Date;
}

type CreateOrderInput = Omit<Order, "id" | "createdAt" | "status" | "paymentStatus">;
type UpdateOrderStatus = Pick<Order, "status" | "paymentStatus">;

export { OrderItem, Order, CreateOrderInput, UpdateOrderStatus };
