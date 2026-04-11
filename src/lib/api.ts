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
import { mockApi } from './mockApi';


// Collection Names
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const REVIEWS_COLLECTION = 'reviews';

// Set this to true to force using mock data (useful if Firebase is not configured yet)
const USE_MOCK = true;

export const api = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    if (USE_MOCK) {
      console.log("Using mock data (forced)");
      return mockApi.getProducts();
    }
    try {
      const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.warn("Firestore failed, falling back to mock data", error);
      return mockApi.getProducts();
    }
  },


  getProductById: async (id: string): Promise<Product | undefined> => {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return undefined;
    } catch (error) {
      console.warn("Firestore failed, falling back to mock data", error);
      return mockApi.getProductById(id);
    }
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

    const batch = writeBatch(db);
    MOCK_PRODUCTS.forEach((product) => {
      const docRef = doc(collection(db, PRODUCTS_COLLECTION));
      batch.set(docRef, product);
    });
    await batch.commit();
  }

};
