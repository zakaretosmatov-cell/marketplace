import { Product, Order, Review } from './types';

// Initial Mock Data
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1', 
    name: 'MacBook Pro M3 Max', 
    description: 'Apple Silicon M3 Max chip, 36GB Unified Memory, 1TB SSD. The most powerful laptop for pros.', 
    price: 3499.00, 
    stock: 15, 
    image: 'https://images.unsplash.com/photo-1517336714460-4c50193c63e1?w=800&q=80', 
    category: 'Laptops', 
    brand: 'Apple', 
    sellerId: 's1', 
    rating: 4.9, 
    reviewsCount: 42
  },
  {
    id: 'p2', 
    name: 'iPhone 15 Pro Max', 
    description: 'Titanium design, A17 Pro chip, 48MP Main camera. The ultimate iPhone.', 
    price: 1199.00, 
    stock: 25, 
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80', 
    category: 'Smartphones', 
    brand: 'Apple', 
    sellerId: 's1', 
    rating: 4.8, 
    reviewsCount: 156
  },
  {
    id: 'p3', 
    name: 'Samsung Galaxy S24 Ultra', 
    description: 'Galaxy AI is here. 200MP camera, S Pen included, Titanium frame.', 
    price: 1299.99, 
    stock: 20, 
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', 
    category: 'Smartphones', 
    brand: 'Samsung', 
    sellerId: 's2', 
    rating: 4.7, 
    reviewsCount: 89
  },
  {
    id: 'p4', 
    name: 'Apple Watch Ultra 2', 
    description: 'The most rugged and capable Apple Watch. 36-hour battery life, 3000 nits display.', 
    price: 799.00, 
    stock: 10, 
    image: 'https://images.unsplash.com/photo-1434493907317-a46b53779483?w=800&q=80', 
    category: 'Wearables', 
    brand: 'Apple', 
    sellerId: 's1', 
    rating: 4.9, 
    reviewsCount: 34
  },
  {
    id: 'p5', 
    name: 'Sony WH-1000XM5', 
    description: 'Industry-leading noise canceling with two processors controlling 8 microphones.', 
    price: 399.99, 
    stock: 30, 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 
    category: 'Audio', 
    brand: 'Sony', 
    sellerId: 's3', 
    rating: 4.8, 
    reviewsCount: 210
  },
  {
    id: 'p6', 
    name: 'iPad Pro M2', 
    description: 'Astonishing performance. Incredibly advanced displays. Superfast wireless connectivity.', 
    price: 799.00, 
    stock: 12, 
    image: 'https://images.unsplash.com/photo-1544244015-0cd4b3ffad20?w=800&q=80', 
    category: 'Tablets', 
    brand: 'Apple', 
    sellerId: 's1', 
    rating: 4.8, 
    reviewsCount: 75
  },
  {
    id: 'p7', 
    name: 'ROG Strix G16 Gaming Laptop', 
    description: 'Intel Core i9-13980HX, NVIDIA GeForce RTX 4080, 16GB DDR5, 1TB PCIe 4.0 SSD.', 
    price: 1999.99, 
    stock: 8, 
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80', 
    category: 'Laptops', 
    brand: 'ASUS', 
    sellerId: 's4', 
    rating: 4.6, 
    reviewsCount: 12
  }
];


export const mockApi = {
  getProducts: async (): Promise<Product[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PRODUCTS), 800));
  },
  
  getProductById: async (id: string): Promise<Product | undefined> => {
    return new Promise((resolve) => setTimeout(() => {
      resolve(MOCK_PRODUCTS.find(p => p.id === id));
    }, 500));
  },

  getReviewsByProductId: async (productId: string): Promise<Review[]> => {
    return new Promise((resolve) => setTimeout(() => {
      resolve([
        { id: 'r1', productId, userId: 'u1', userName: 'John D.', rating: 5, comment: 'Amazing product!', createdAt: new Date().toISOString() }
      ]);
    }, 400));
  },

  createOrder: async (orderPayload: Partial<Order>): Promise<Order> => {
    return new Promise((resolve) => setTimeout(() => {
      resolve({
        id: `ord_${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        ...orderPayload
      } as Order);
    }, 1000));
  }
};
