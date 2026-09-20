import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './lib/store/useCartStore';
import { mockBooks } from './lib/mock-data';

describe('Cart Store & Business Logic', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('should add items to cart and calculate correct subtotal', () => {
    const book1 = mockBooks[0];
    useCartStore.getState().addToCart(book1, 2);

    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(2);
    expect(useCartStore.getState().getTotalItems()).toBe(2);
    expect(useCartStore.getState().getSubtotal()).toBe(book1.price * 2);
  });

  it('should calculate discount and final price with gift points redemption correctly', () => {
    const book = mockBooks[0]; // price: 49.99, discountPercent: 15%
    useCartStore.getState().addToCart(book, 1);

    const subtotal = useCartStore.getState().getSubtotal();
    const discount = useCartStore.getState().getTotalDiscount();
    expect(subtotal).toBe(49.99);
    expect(discount).toBeCloseTo(7.4985, 2);

    // Redeeming 50 gift points gives $5.00 discount (50 * 0.1)
    const finalWithPoints = useCartStore.getState().getFinalTotal(50);
    const expected = subtotal - discount - 5.0;
    expect(finalWithPoints).toBeCloseTo(expected, 2);
  });

  it('should update quantities and remove item when quantity is 0', () => {
    const book = mockBooks[1];
    useCartStore.getState().addToCart(book, 1);
    useCartStore.getState().updateQuantity(book.id, 3);
    expect(useCartStore.getState().getTotalItems()).toBe(3);

    useCartStore.getState().updateQuantity(book.id, 0);
    expect(useCartStore.getState().items.length).toBe(0);
  });
});
