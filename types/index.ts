export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  isbn: string;
  description: string;
  price: number;
  discountPercent: number;
  coverImage: string;
  rating: number;
  reviewCount: number;
  format: string;
  featured: boolean;
  pages?: number;
  publishedYear?: number;
  language: string;
  inStock: boolean;
  categoryId: string;
  category?: Category;
  brandId: string;
  brand?: Brand;
}

export interface CartItem {
  id: string;
  bookId: string;
  book: Book;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  bookId: string;
  book: Book;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  addressId: string;
  address: Address;
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  discount: number;
  pointsRedeemed: number;
  pointsDiscount: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  paymentMethod: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  giftPoints: number;
}
