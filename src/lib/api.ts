import {
  collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, writeBatch, arrayUnion, runTransaction, increment
} from "firebase/firestore";
import { db } from "./firebase";
import { Product, Order, Review, OrderStatusEvent, Address, Ad } from "./types";

const PRODUCTS_COL = "products";
const ORDERS_COL   = "orders";
const REVIEWS_COL  = "reviews";
const ADS_COL      = "ads";
const USERS_COL    = "users";

export const api = {

  // в”Ђв”Ђ Products в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  getProducts: async (): Promise<Product[]> => {
    const snap = await getDocs(collection(db, PRODUCTS_COL));
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Product[];
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const snap = await getDoc(doc(db, PRODUCTS_COL, id));
    if (snap.exists()) return { id: snap.id, ...snap.data() } as Product;
    return undefined;
  },

  getProductsBySeller: async (sellerId: string): Promise<Product[]> => {
    const q = query(collection(db, PRODUCTS_COL), where("sellerId", "==", sellerId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Product[];
  },

  addProduct: async (data: Partial<Product>): Promise<string> => {
    const ref = await addDoc(collection(db, PRODUCTS_COL), {
      ...data, rating: 0, reviewsCount: 0, createdAt: new Date().toISOString(),
    });
    return ref.id;
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<void> => {
    await updateDoc(doc(db, PRODUCTS_COL, id), data as Record<string, unknown>);
  },

  deleteProduct: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, PRODUCTS_COL, id));
  },

  // в”Ђв”Ђ Reviews в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  getReviewsByProductId: async (productId: string): Promise<Review[]> => {
    const q = query(collection(db, REVIEWS_COL), where("productId", "==", productId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Review[];
  },

  getReviewsBySeller: async (sellerId: string): Promise<Review[]> => {
    const q = query(collection(db, REVIEWS_COL), where("sellerId", "==", sellerId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Review[];
  },

  hasPurchasedProduct: async (userId: string, productId: string): Promise<boolean> => {
    const q = query(collection(db, ORDERS_COL), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.some(d => {
      const order = d.data();
      const validStatus = ["paid", "processing", "shipped", "delivered"].includes(order.status);
      const hasItem = (order.items || []).some((i: { productId: string }) => i.productId === productId);
      return validStatus && hasItem;
    });
  },

  addReview: async (review: Omit<Review, "id">): Promise<string> => {
    const ref = await addDoc(collection(db, REVIEWS_COL), review);
    const allSnap = await getDocs(query(collection(db, REVIEWS_COL), where("productId", "==", review.productId)));
    const all = allSnap.docs.map(d => d.data() as Review);
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await updateDoc(doc(db, PRODUCTS_COL, review.productId), {
      rating: Math.round(avg * 10) / 10,
      reviewsCount: all.length,
    });
    return ref.id;
  },

  // в”Ђв”Ђ Orders в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

  /** Creates order + decrements stock atomically. Throws if any item is out of stock. */
  createOrder: async (payload: Partial<Order>): Promise<string> => {
    const now = new Date().toISOString();
    const initialEvent: OrderStatusEvent = { status: "pending", timestamp: now, note: "Order placed" };

    const orderId = await runTransaction(db, async (tx) => {
      // 1. Check stock for every item
      for (const item of payload.items || []) {
        const productRef = doc(db, PRODUCTS_COL, item.productId);
        const productSnap = await tx.get(productRef);
        if (!productSnap.exists()) throw new Error(`Product ${item.productName} not found`);
        const stock = productSnap.data().stock as number;
        if (stock < item.quantity) throw new Error(`"${item.productName}" вЂ” only ${stock} left in stock`);
      }

      // 2. Decrement stock
      for (const item of payload.items || []) {
        const productRef = doc(db, PRODUCTS_COL, item.productId);
        tx.update(productRef, { stock: increment(-item.quantity) });
      }

      // 3. Create order
      const orderRef = doc(collection(db, ORDERS_COL));
      tx.set(orderRef, {
        ...payload,
        status: "pending",
        createdAt: now,
        updatedAt: now,
        statusHistory: [initialEvent],
      });

      return orderRef.id;
    });

    return orderId;
  },

  getOrdersByUser: async (userId: string): Promise<Order[]> => {
    const q = query(collection(db, ORDERS_COL), where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Order[];
  },

  getOrdersBySeller: async (sellerId: string): Promise<Order[]> => {
    // Orders that contain at least one item from this seller
    const q = query(collection(db, ORDERS_COL), where("sellerIds", "array-contains", sellerId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Order[];
  },

  getAllOrders: async (): Promise<Order[]> => {
    const q = query(collection(db, ORDERS_COL), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Order[];
  },

  getOrderById: async (id: string): Promise<Order | undefined> => {
    const snap = await getDoc(doc(db, ORDERS_COL, id));
    if (snap.exists()) return { id: snap.id, ...snap.data() } as Order;
    return undefined;
  },

  updateOrderStatus: async (id: string, status: Order["status"], note?: string): Promise<void> => {
    const now = new Date().toISOString();
    const event: OrderStatusEvent = { status, timestamp: now, ...(note ? { note } : {}) };
    await updateDoc(doc(db, ORDERS_COL, id), { status, updatedAt: now, statusHistory: arrayUnion(event) });
  },

  // в”Ђв”Ђ Addresses в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  getAddresses: async (userId: string): Promise<Address[]> => {
    const q = query(collection(db, USERS_COL, userId, "addresses"), orderBy("isDefault", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Address[];
  },

  addAddress: async (userId: string, address: Omit<Address, "id">): Promise<string> => {
    // If new address is default, unset others
    if (address.isDefault) {
      const existing = await api.getAddresses(userId);
      const batch = writeBatch(db);
      existing.forEach(a => {
        if (a.isDefault) batch.update(doc(db, USERS_COL, userId, "addresses", a.id), { isDefault: false });
      });
      await batch.commit();
    }
    const ref = await addDoc(collection(db, USERS_COL, userId, "addresses"), address);
    return ref.id;
  },

  updateAddress: async (userId: string, addressId: string, data: Partial<Address>): Promise<void> => {
    if (data.isDefault) {
      const existing = await api.getAddresses(userId);
      const batch = writeBatch(db);
      existing.forEach(a => {
        if (a.isDefault && a.id !== addressId)
          batch.update(doc(db, USERS_COL, userId, "addresses", a.id), { isDefault: false });
      });
      await batch.commit();
    }
    await updateDoc(doc(db, USERS_COL, userId, "addresses", addressId), data as Record<string, unknown>);
  },

  deleteAddress: async (userId: string, addressId: string): Promise<void> => {
    await deleteDoc(doc(db, USERS_COL, userId, "addresses", addressId));
  },
};



// ── Ads ───────────────────────────────────────────────────────────────────
export const adApi = {
  createAd: async (ad: Omit<Ad, "id">): Promise<string> => {
    const ref = await addDoc(collection(db, ADS_COL), ad);
    return ref.id;
  },

  getAdsBySeller: async (sellerId: string): Promise<Ad[]> => {
    const q = query(collection(db, ADS_COL), where("sellerId", "==", sellerId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Ad[];
  },

  getAllAds: async (): Promise<Ad[]> => {
    const q = query(collection(db, ADS_COL), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Ad[];
  },

  getActiveAds: async (): Promise<Ad[]> => {
    const today = new Date().toISOString().split("T")[0];
    const q = query(collection(db, ADS_COL), where("status", "==", "approved"));
    const snap = await getDocs(q);
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() })) as Ad[]
      .filter(ad => ad.startDate <= today && ad.endDate >= today);
  },

  updateAdStatus: async (id: string, status: Ad["status"], adminNote?: string): Promise<void> => {
    await updateDoc(doc(db, ADS_COL, id), {
      status,
      updatedAt: new Date().toISOString(),
      ...(adminNote ? { adminNote } : {}),
    });
  },
};
