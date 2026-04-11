import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  query, 
  where, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, Review } from './types';

// Collection Names
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const REVIEWS_COLLECTION = 'reviews';

export const api = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return undefined;
  },

  getProductsBySeller: async (sellerId: string): Promise<Product[]> => {
    const q = query(collection(db, PRODUCTS_COLLECTION), where('sellerId', '==', sellerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  },

  // Reviews
  getReviewsByProductId: async (productId: string): Promise<Review[]> => {
    const q = query(collection(db, REVIEWS_COLLECTION), where('productId', '==', productId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Review[];
  },

  // Orders
  createOrder: async (orderPayload: Partial<Order>): Promise<string> => {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderPayload,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  },

  // Seed Data
  seedInitialData: async (): Promise<void> => {
    const MOCK_PRODUCTS: Partial<Product>[] = [
      {
        name: 'Premium Wireless Headphones', 
        description: 'High-quality noise-canceling wireless headphones with 40h battery life.', 
        price: 299.99, 
        stock: 45, 
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', 
        category: 'Electronics', 
        brand: 'SoundMaster', 
        sellerId: 's1', 
        rating: 4.8, 
        reviewsCount: 124, 
        colors: ['Black', 'Silver']
      },
      {
        name: 'Ergonomic Desk Chair', 
        description: 'Comfortable office chair with lumbar support and adjustable height.', 
        price: 199.50, 
        stock: 12, 
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80', 
        category: 'Furniture', 
        brand: 'OfficePro', 
        sellerId: 's2', 
        rating: 4.5, 
        reviewsCount: 89, 
        colors: ['Black', 'Grey']
      },
      {
        name: 'Minimalist Smartwatch', 
        description: 'Track your fitness, heart rate, and notifications in style.', 
        price: 149.00, 
        stock: 5, 
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80', 
        category: 'Electronics', 
        brand: 'TechWear', 
        sellerId: 's1', 
        rating: 4.2, 
        reviewsCount: 56, 
        colors: ['Black', 'Rose Gold']
      },
      {
        name: 'Ceramic Coffee Mug', 
        description: 'Handcrafted ceramic mug, perfect for your morning brew.', 
        price: 24.99, 
        stock: 100, 
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80', 
        category: 'Home', 
        brand: 'Artisan', 
        sellerId: 's3', 
        rating: 4.9, 
        reviewsCount: 210, 
        colors: ['White', 'Blue']
      }
    ];

    const batch = writeBatch(db);
    MOCK_PRODUCTS.forEach((product) => {
      const docRef = doc(collection(db, PRODUCTS_COLLECTION));
      batch.set(docRef, product);
    });
    await batch.commit();
  }
};
