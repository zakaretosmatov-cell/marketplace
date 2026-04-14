import { Product, Order, Review } from './types';

// Initial Mock Data
let MOCK_PRODUCTS: Product[] = [
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
  },
  {
    id: 'p8',
    name: 'Dell XPS 15',
    description: '13th Gen Intel Core i9, NVIDIA RTX 4070, 3.5K OLED Touch Display. Elegance meets power.',
    price: 2399.00,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
    category: 'Laptops',
    brand: 'Dell',
    sellerId: 's1',
    rating: 4.7,
    reviewsCount: 28
  },
  {
    id: 'p9',
    name: 'Google Pixel 8 Pro',
    description: 'The all-pro phone engineered by Google. It’s sleek, sophisticated, and has the best Pixel camera yet.',
    price: 999.00,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1696423602143-df9bc6f69d31?w=800&q=80',
    category: 'Smartphones',
    brand: 'Google',
    sellerId: 's2',
    rating: 4.8,
    reviewsCount: 64
  },
  {
    id: 'p10',
    name: 'Samsung QN900D Neo QLED 8K 85"',
    description: 'Neo QLED 8K with NQ8 AI Gen3 processor. Quantum Matrix Technology Pro, Real Depth Enhancer, 8K AI Upscaling. The pinnacle of Samsung TV technology.',
    price: 7999.99,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=800&q=80',
    category: 'TVs',
    brand: 'Samsung',
    sellerId: 's2',
    rating: 4.9,
    reviewsCount: 38
  },
  {
    id: 'p11',
    name: 'LG G4 OLED evo 77"',
    description: 'OLED evo Gallery Edition with MLA technology. α11 AI Processor 4K, Brightness Booster Ultimate, Dolby Vision IQ & Atmos. Perfect blacks, infinite contrast.',
    price: 3499.99,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=80',
    category: 'TVs',
    brand: 'LG',
    sellerId: 's3',
    rating: 4.9,
    reviewsCount: 72
  },
  {
    id: 'p12',
    name: 'Sony BRAVIA XR A95L QD-OLED 65"',
    description: 'QD-OLED with Cognitive Processor XR. XR Triluminos Max, Acoustic Surface Audio+, HDMI 2.1 for 4K 120Hz gaming. The most lifelike picture Sony has ever made.',
    price: 2999.99,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800&q=80',
    category: 'TVs',
    brand: 'Sony',
    sellerId: 's3',
    rating: 4.8,
    reviewsCount: 95
  },
  {
    id: 'p13',
    name: 'Samsung S95D QD-OLED 55"',
    description: 'QD-OLED with NQ4 AI Gen2 processor. Glare-Free technology, 144Hz refresh rate, AMD FreeSync Premium Pro. Ideal for gaming and cinematic content.',
    price: 1799.99,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80',
    category: 'TVs',
    brand: 'Samsung',
    sellerId: 's2',
    rating: 4.8,
    reviewsCount: 54
  },
  {
    id: 'p14',
    name: 'LG C4 OLED 65"',
    description: 'OLED evo with α9 AI Processor 4K Gen7. 120Hz, G-Sync & FreeSync, Dolby Vision & Atmos, 4 HDMI 2.1 ports. Best-in-class OLED for gamers and movie lovers.',
    price: 1599.99,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80',
    category: 'TVs',
    brand: 'LG',
    sellerId: 's3',
    rating: 4.9,
    reviewsCount: 187
  },
  {
    id: 'p15',
    name: 'TCL QM891G Mini-LED QLED 75"',
    description: '4K Mini-LED QLED with AiPQ Ultra Engine. 5000 nits peak brightness, 240Hz, Dolby Vision IQ, Google TV. Premium performance at an unbeatable price.',
    price: 1299.99,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'TVs',
    brand: 'TCL',
    sellerId: 's4',
    rating: 4.7,
    reviewsCount: 43
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
  },

  addProduct: async (product: Partial<Product>): Promise<string> => {
    return new Promise((resolve) => setTimeout(() => {
      const newProduct = {
        id: `p${Date.now()}`,
        rating: 0,
        reviewsCount: 0,
        ...product
      } as Product;
      MOCK_PRODUCTS = [...MOCK_PRODUCTS, newProduct];
      resolve(newProduct.id);
    }, 600));
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      MOCK_PRODUCTS = MOCK_PRODUCTS.map(p => p.id === id ? { ...p, ...data } : p);
      resolve();
    }, 600));
  },

  deleteProduct: async (id: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== id);
      resolve();
    }, 400));
  }
};

