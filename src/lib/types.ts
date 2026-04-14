export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  brand: string;
  sellerId: string;
  rating: number;
  reviewsCount: number;
  colors?: string[];
  sizes?: string[];
}

export interface Review {
  id: string;
  productId: string;
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
