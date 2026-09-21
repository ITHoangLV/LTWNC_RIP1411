// Tái sử dụng interface từ Week 1 (có mở rộng thêm image)
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: string;
  rating: number;
}

export type ProductSummary = Pick<Product, 'id' | 'name' | 'price' | 'category'>;
