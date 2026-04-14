import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
  arrayUnion
} from "firebase/firestore";
import { db } from "./firebase";
import { Product, Order, Review, OrderStatusEvent } from "./types";

const PRODUCTS_COLLECTION = "products";
const ORDERS_COLLECTION = "orders";
const REVIEWS_COLLECTION = "reviews";

export const api = {

  // Products
  getProducts: async (): Promise<Product[]> => {
    const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Product[];
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const snap = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
    if (snap.exists()) return { id: snap.id, ...snap.data() } as Product;
    return undefined;
  },

  getProductsBySeller: async (sellerId: string): Promise<Product[]> => {
    const q = query(collection(db, PRODUCTS_COLLECTION), where("sellerId", "==", sellerId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Product[];
  },

  addProduct: async (productData: Partial<Product>): Promise<string> => {
    const ref = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      rating: 0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    });
    return ref.id;
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<void> => {
    await updateDoc(doc(db, PRODUCTS_COLLECTION, id), data as Record<string, unknown>);
  },

  deleteProduct: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  },

  // Reviews
  getReviewsByProductId: async (productId: string): Promise<Review[]> => {
    const q = query(collection(db, REVIEWS_COLLECTION), where("productId", "==", productId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Review[];
  },

  // Orders
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
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Order[];
  },

  getAllOrders: async (): Promise<Order[]> => {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Order[];
  },

  getOrderById: async (id: string): Promise<Order | undefined> => {
    const snap = await getDoc(doc(db, ORDERS_COLLECTION, id));
    if (snap.exists()) return { id: snap.id, ...snap.data() } as Order;
    return undefined;
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
};

