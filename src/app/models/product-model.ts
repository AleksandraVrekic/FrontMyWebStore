export interface Product {
  id: number;
  name: string;
  description?: string;  // Optional because it might not be required
  price: number;
  quantity: number;
  image?: string;  // Optional image field
  categoryId: number;  // No longer optional in the constructor
}
