import { create } from 'zustand';
import { Book, CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotalDiscount: () => number;
  getFinalTotal: (pointsRedeemed?: number) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: (book: Book, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((item) => item.bookId === book.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.bookId === book.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        items: [...state.items, { id: `cart-${Date.now()}-${book.id}`, bookId: book.id, book, quantity }],
      };
    });
  },
  removeFromCart: (bookId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.bookId !== bookId),
    }));
  },
  updateQuantity: (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(bookId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.bookId === bookId ? { ...item, quantity } : item
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotalItems: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },
  getSubtotal: () => {
    return get().items.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
  },
  getTotalDiscount: () => {
    return get().items.reduce((acc, item) => {
      const discount = (item.book.price * (item.book.discountPercent || 0)) / 100;
      return acc + discount * item.quantity;
    }, 0);
  },
  getFinalTotal: (pointsRedeemed = 0) => {
    const subtotal = get().getSubtotal();
    const discount = get().getTotalDiscount();
    const pointsValue = pointsRedeemed * 0.1; // 10 points = $1.00
    const total = subtotal - discount - pointsValue;
    return Math.max(0, total);
  },
}));
