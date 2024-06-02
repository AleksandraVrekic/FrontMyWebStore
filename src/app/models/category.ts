import { Product } from "./product-model";

export class Category {
  categoryId: number;
  categoryName: string;
  products?: Product[]; // Opciono, ako želite da model uključuje i proizvode

  constructor(categoryId: number, categoryName: string, products?: Product[]) {
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.products = products;
  }
}
