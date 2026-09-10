interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}

type CreateProductInput = Omit<Product, "id">;
type UpdateProductInput = Partial<Omit<Product, "id">>;
type ProductSummary = Pick<Product, "id" | "name" | "price" | "category">;

export { Product, CreateProductInput, UpdateProductInput, ProductSummary };
