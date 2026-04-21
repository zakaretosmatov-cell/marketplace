export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  userId: string;
  userEmail?: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SellerProfile {
  uid: string;
  email: string;
  displayName?: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  businessName?: string;
  phone?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface Ticket {
  id: string;
  userId: string;
  userEmail?: string;
  sellerId?: string;
  orderId?: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PlatformSettings {
  commissionPercent: number;
  sellerSubscriptionFee: number;
  freeShippingThreshold: number;
  maintenanceMode: boolean;
  platformName: string;
  supportEmail: string;
  updatedAt?: string;
}

export interface Bundle {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  productIds: string[];
  productNames: string[];
  productImages: string[];
  originalPrice: number;
  bundlePrice: number;
  discountPercent: number;
  stock: number;
  active: boolean;
  createdAt: string;
}

export interface Ad {
  id: string;
  sellerId: string;
  sellerEmail?: string;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  startDate: string;
  endDate: string;
  days: number;
  totalCost: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  isDefault: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  stock: number;
  image: string;
  category: string;
  brand: string;
  sellerId: string;
  rating: number;
  reviewsCount: number;
  colors?: string[];
  sizes?: string[];
  condition?: 'new' | 'used' | 'refurbished';
  views?: number;
  flashSalePrice?: number;
  flashSaleEndsAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  sellerId?: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface OrderStatusEvent {
  status: Order['status'];
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  sellerIds?: string[];
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    sellerId: string;
    image?: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt: string;
  updatedAt?: string;
  statusHistory?: OrderStatusEvent[];
  trackingNumber?: string;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'client' | 'seller' | 'admin';
  name: string;
  createdAt: string;
}
