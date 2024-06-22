export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string | null;
  category: {
    categoryId: number;
    categoryName: string;
  };
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: {
    categoryId: number;
    categoryName: string;
  };
}

// Define a class for Product
export class ProductClass implements Product {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public quantity: number,
    public image: string | null,
    public category: {
      categoryId: number;
      categoryName: string;
    }
  ) {}
}





/*export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string | null;
  category?: any;

  constructor(id: number, name: string, description: string, price: number, quantity: number, image: string | null, category: any) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.image = image;
    this.category = category;
  }
}*/
