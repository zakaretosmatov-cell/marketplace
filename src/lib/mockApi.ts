import { Product, Order, Review } from './types';

// Initial Mock Data
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1', name: 'Premium Wireless Headphones', description: 'High-quality noise-canceling wireless headphones with 40h battery life.', price: 299.99, stock: 45, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', category: 'Electronics', brand: 'SoundMaster', sellerId: 's1', rating: 4.8, reviewsCount: 124, colors: ['Black', 'Silver']
  },
  {
    id: 'p2', name: 'Ergonomic Desk Chair', description: 'Comfortable office chair with lumbar support and adjustable height.', price: 199.50, stock: 12, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80', category: 'Furniture', brand: 'OfficePro', sellerId: 's2', rating: 4.5, reviewsCount: 89, colors: ['Black', 'Grey']
  },
  {
    id: 'p3', name: 'Minimalist Smartwatch', description: 'Track your fitness, heart rate, and notifications in style.', price: 149.00, stock: 0, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80', category: 'Electronics', brand: 'TechWear', sellerId: 's1', rating: 4.2, reviewsCount: 56, colors: ['Black', 'Rose Gold']
  },
  {
    id: 'p4', name: 'Ceramic Coffee Mug', description: 'Handcrafted ceramic mug, perfect for your morning brew.', price: 24.99, stock: 100, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80', category: 'Home', brand: 'Artisan', sellerId: 's3', rating: 4.9, reviewsCount: 210, colors: ['White', 'Blue']
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
