$content = @'
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  arrayUnion
} from "firebase/firestore";
import { db } from "./firebase";
import { Product, Order, Review, OrderStatusEvent } from "./types";
import { mockApi } from "./mockApi";

const PRODUCTS_COLLECTION = "products";
const ORDERS_COLLECTION = "orders";
const REVIEWS_COLLECTION = "reviews";

const USE_MOCK = true;

export const api = {
  // ─── Products ───────────────────────────────────────────────────────────────

  getProducts: async (): Promise<Product[]> => {
    if (USE_MOCK) return mockApi.getProducts();
    try {
      const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
      return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Product[];
    } catch {
      return mockApi.getProducts();
    }
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    try {
      const snap = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
      if (snap.exists()) return { id: snap.id, ...snap.data() } as Product;
      return undefined;
    } catch {
      return mockApi.getProductById(id);
    }
  },

  getProductsBySeller: async (sellerId: string): Promise<Product[]> => {
    if (USE_MOCK) {
      const all = await mockApi.getProducts();
      return all.filter(p => p.sellerId === sellerId);
    }
    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), where("sellerId", "==", sellerId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Product[];
    } catch {
      const all = await mockApi.getProducts();
      return all.filter(p => p.sellerId === sellerId);
    }
  },

  addProduct: async (productData: Partial<Product>): Promise<string> => {
    if (USE_MOCK) return mockApi.addProduct(productData);
    try {
      const ref = await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...productData, rating: 0, reviewsCount: 0, createdAt: new Date().toISOString()
      });
      return ref.id;
    } catch {
      return mockApi.addProduct(productData);
    }
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<void> => {
    if (USE_MOCK) return mockApi.updateProduct(id, data);
    try {
      await updateDoc(doc(db, PRODUCTS_COLLECTION, id), data as Record<string, unknown>);
    } catch {
      return mockApi.updateProduct(id, data);
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    if (USE_MOCK) return mockApi.deleteProduct(id);
    try {
      const { deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
    } catch {
      return mockApi.deleteProduct(id);
    }
  },

  // ─── Reviews ────────────────────────────────────────────────────────────────

  getReviewsByProductId: async (productId: string): Promise<Review[]> => {
    const q = query(collection(db, REVIEWS_COLLECTION), where("productId", "==", productId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Review[];
  },

  // ─── Orders ─────────────────────────────────────────────────────────────────

  createOrder: async (orderPayload: Partial<Order>): Promise<string> => {
    const now = new Date().toISOString();
    const initialEvent: OrderStatusEvent = { status: "pending", timestamp: now, note: "Order placed" };
    const ref = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderPayload,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      statusHistory: [initialEvent],
    });
    return ref.id;
  },

  getOrdersByUser: async (userId: string): Promise<Order[]> => {
    try {
      const q = query(
        collection(db, ORDERS_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Order[];
    } catch (err) {
      console.error("getOrdersByUser error", err);
      return [];
    }
  },

  getAllOrders: async (): Promise<Order[]> => {
    try {
      const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Order[];
    } catch (err) {
      console.error("getAllOrders error", err);
      return [];
    }
  },

  getOrderById: async (id: string): Promise<Order | undefined> => {
    try {
      const snap = await getDoc(doc(db, ORDERS_COLLECTION, id));
      if (snap.exists()) return { id: snap.id, ...snap.data() } as Order;
      return undefined;
    } catch (err) {
      console.error("getOrderById error", err);
      return undefined;
    }
  },

  updateOrderStatus: async (id: string, status: Order["status"], note?: string): Promise<void> => {
    const now = new Date().toISOString();
    const event: OrderStatusEvent = { status, timestamp: now, ...(note ? { note } : {}) };
    await updateDoc(doc(db, ORDERS_COLLECTION, id), {
      status,
      updatedAt: now,
      statusHistory: arrayUnion(event),
    });
  },

  // ─── Seed ───────────────────────────────────────────────────────────────────

  seedInitialData: async (): Promise<void> => {
    const MOCK_PRODUCTS: Partial<Product>[] = [
      { name: "MacBook Pro M3 Max", description: "Apple Silicon M3 Max chip, 36GB Unified Memory, 1TB SSD.", price: 3499, stock: 15, image: "https://images.unsplash.com/photo-1517336714460-4c50193c63e1?w=800&q=80", category: "Laptops", brand: "Apple", sellerId: "s1", rating: 4.9, reviewsCount: 42 },
      { name: "iPhone 15 Pro Max", description: "Titanium design, A17 Pro chip, 48MP Main camera.", price: 1199, stock: 25, image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80", category: "Smartphones", brand: "Apple", sellerId: "s1", rating: 4.8, reviewsCount: 156 },
    ];
    const batch = writeBatch(db);
    MOCK_PRODUCTS.forEach(p => { const ref = doc(collection(db, PRODUCTS_COLLECTION)); batch.set(ref, p); });
    await batch.commit();
  },
};
'@
Set-Content -Path "src/lib/api.ts" -Value $content -Encoding UTF8
Write-Host "api.ts written"
