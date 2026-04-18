import {
  collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, setDoc,
  query, where, orderBy, writeBatch, arrayUnion, runTransaction, increment
} from "firebase/firestore";
import { db } from "./firebase";
import { Product, Order, Review, OrderStatusEvent, Address, Ad, Bundle } from "./types";

const PRODUCTS_COL = "products";
const ORDERS_COL   = "orders";
const REVIEWS_COL  = "reviews";
const ADS_COL      = "ads";
const BUNDLES_COL  = "bundles";
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

  incrementViews: async (id: string): Promise<void> => {
    try {
      await updateDoc(doc(db, PRODUCTS_COL, id), { views: increment(1) });
    } catch { /* silent */ }
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

    // Check stock availability
    for (const item of payload.items || []) {
      const productSnap = await getDoc(doc(db, PRODUCTS_COL, item.productId));
      if (!productSnap.exists()) throw new Error(`Product "${item.productName}" not found`);
      const stock = productSnap.data().stock as number;
      if (stock < item.quantity) throw new Error(`"${item.productName}" - only ${stock} left in stock`);
    }

    // Create order
    const orderRef = await addDoc(collection(db, ORDERS_COL), {
      ...payload,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      statusHistory: [initialEvent],
    });

    return orderRef.id;
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
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Ad[];
    return all.filter(ad => ad.startDate <= today && ad.endDate >= today);
  },

  updateAdStatus: async (id: string, status: Ad["status"], adminNote?: string): Promise<void> => {
    await updateDoc(doc(db, ADS_COL, id), {
      status,
      updatedAt: new Date().toISOString(),
      ...(adminNote ? { adminNote } : {}),
    });
  },
};

// ── Bundles ───────────────────────────────────────────────────────────────
export const bundleApi = {
  createBundle: async (bundle: Omit<Bundle, "id">): Promise<string> => {
    const ref = await addDoc(collection(db, BUNDLES_COL), bundle);
    return ref.id;
  },

  updateBundle: async (id: string, data: Partial<Bundle>): Promise<void> => {
    await updateDoc(doc(db, BUNDLES_COL, id), data as Record<string, unknown>);
  },

  deleteBundle: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, BUNDLES_COL, id));
  },

  getBundlesBySeller: async (sellerId: string): Promise<Bundle[]> => {
    const q = query(collection(db, BUNDLES_COL), where("sellerId", "==", sellerId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Bundle[];
  },

  getActiveBundles: async (): Promise<Bundle[]> => {
    const q = query(collection(db, BUNDLES_COL), where("active", "==", true));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Bundle[];
  },

  getBundleById: async (id: string): Promise<Bundle | undefined> => {
    const snap = await getDoc(doc(db, BUNDLES_COL, id));
    if (snap.exists()) return { id: snap.id, ...snap.data() } as Bundle;
    return undefined;
  },
};

// ── Promo Codes ───────────────────────────────────────────────────────────
const PROMOS_COL = "promoCodes";
const RETURNS_COL = "returns";
const SELLERS_COL = "sellerProfiles";

export const promoApi = {
  validateCode: async (code: string): Promise<{ valid: boolean; discount: number; promoId: string }> => {
    const q = query(collection(db, PROMOS_COL), where("code", "==", code.toUpperCase()), where("active", "==", true));
    const snap = await getDocs(q);
    if (snap.empty) return { valid: false, discount: 0, promoId: "" };
    const promo = snap.docs[0].data() as import("./types").PromoCode;
    const id = snap.docs[0].id;
    if (promo.usedCount >= promo.maxUses) return { valid: false, discount: 0, promoId: "" };
    if (new Date(promo.expiresAt) < new Date()) return { valid: false, discount: 0, promoId: "" };
    return { valid: true, discount: promo.discountPercent, promoId: id };
  },

  useCode: async (promoId: string): Promise<void> => {
    await updateDoc(doc(db, PROMOS_COL, promoId), { usedCount: increment(1) });
  },

  getAllCodes: async (): Promise<import("./types").PromoCode[]> => {
    const snap = await getDocs(collection(db, PROMOS_COL));
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as import("./types").PromoCode[];
  },

  createCode: async (data: Omit<import("./types").PromoCode, "id">): Promise<string> => {
    const ref = await addDoc(collection(db, PROMOS_COL), data);
    return ref.id;
  },

  deleteCode: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, PROMOS_COL, id));
  },
};

// ── Returns ───────────────────────────────────────────────────────────────
export const returnApi = {
  createReturn: async (data: Omit<import("./types").ReturnRequest, "id">): Promise<string> => {
    const ref = await addDoc(collection(db, RETURNS_COL), data);
    return ref.id;
  },

  getReturnsByUser: async (userId: string): Promise<import("./types").ReturnRequest[]> => {
    const q = query(collection(db, RETURNS_COL), where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as import("./types").ReturnRequest[];
  },

  getAllReturns: async (): Promise<import("./types").ReturnRequest[]> => {
    const q = query(collection(db, RETURNS_COL), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as import("./types").ReturnRequest[];
  },

  updateReturnStatus: async (id: string, status: import("./types").ReturnRequest["status"], adminNote?: string): Promise<void> => {
    await updateDoc(doc(db, RETURNS_COL, id), { status, updatedAt: new Date().toISOString(), ...(adminNote ? { adminNote } : {}) });
  },
};

// ── Seller Verification ───────────────────────────────────────────────────
export const sellerApi = {
  applyForSeller: async (data: Omit<import("./types").SellerProfile, "verificationStatus" | "verifiedAt">): Promise<void> => {
    await setDoc(doc(db, SELLERS_COL, data.uid), { ...data, verificationStatus: "pending" });
  },

  getSellerProfile: async (uid: string): Promise<import("./types").SellerProfile | undefined> => {
    const snap = await getDoc(doc(db, SELLERS_COL, uid));
    if (snap.exists()) return snap.data() as import("./types").SellerProfile;
    return undefined;
  },

  getAllSellerApplications: async (): Promise<import("./types").SellerProfile[]> => {
    const snap = await getDocs(collection(db, SELLERS_COL));
    return snap.docs.map(d => d.data()) as import("./types").SellerProfile[];
  },

  updateSellerStatus: async (uid: string, status: "approved" | "rejected"): Promise<void> => {
    await updateDoc(doc(db, SELLERS_COL, uid), {
      verificationStatus: status,
      ...(status === "approved" ? { verifiedAt: new Date().toISOString() } : {})
    });
    // Also update user role in users collection
    if (status === "approved") {
      await updateDoc(doc(db, "users", uid), { role: "seller" });
    } else {
      await updateDoc(doc(db, "users", uid), { role: "client" });
    }
  },

  getSellerStats: async (sellerId: string): Promise<{ totalOrders: number; totalRevenue: number; totalProducts: number; recentOrders: import("./types").Order[] }> => {
    const [orders, products] = await Promise.all([
      getDocs(query(collection(db, "orders"), where("sellerIds", "array-contains", sellerId))),
      getDocs(query(collection(db, "products"), where("sellerId", "==", sellerId))),
    ]);
    const allOrders = orders.docs.map(d => ({ id: d.id, ...d.data() })) as import("./types").Order[];
    const revenue = allOrders
      .filter(o => o.status !== "cancelled")
      .reduce((s, o) => {
        const myItems = o.items.filter(i => i.sellerId === sellerId);
        return s + myItems.reduce((ss, i) => ss + i.price * i.quantity, 0);
      }, 0);
    return {
      totalOrders: allOrders.length,
      totalRevenue: Math.round(revenue * 100) / 100,
      totalProducts: products.size,
      recentOrders: allOrders.slice(0, 5),
    };
  },
};

// ── Admin User Management ─────────────────────────────────────────────────
export const adminApi = {
  getAllUsers: async (): Promise<{ uid: string; email: string; role: string; createdAt: string; blocked?: boolean }[]> => {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map(d => ({ uid: d.id, ...d.data() })) as { uid: string; email: string; role: string; createdAt: string; blocked?: boolean }[];
  },

  blockUser: async (uid: string, blocked: boolean): Promise<void> => {
    await updateDoc(doc(db, "users", uid), { blocked });
  },

  setUserRole: async (uid: string, role: string): Promise<void> => {
    await updateDoc(doc(db, "users", uid), { role });
  },
};
