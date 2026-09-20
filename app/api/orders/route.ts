import { NextResponse } from 'next/server';
import { mockBooks, mockAddresses } from '@/lib/mock-data';
import { orderStore, userStore } from '@/lib/store/serverStore';
import { Order } from '@/types';

export async function GET() {
  return NextResponse.json(orderStore);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, addressId, pointsRedeemed = 0, paymentMethod } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (pointsRedeemed > userStore.giftPoints) {
      return NextResponse.json(
        { error: `Insufficient gift points. Balance: ${userStore.giftPoints}` },
        { status: 400 }
      );
    }

    const address = mockAddresses.find((a) => a.id === addressId) || mockAddresses[0];

    let subtotal = 0;
    let totalDiscount = 0;

    const orderItems = items.map((item: { bookId: string; quantity: number }, idx: number) => {
      const book = mockBooks.find((b) => b.id === item.bookId);
      if (!book) throw new Error(`Book ${item.bookId} not found`);

      const discount = (book.price * (book.discountPercent || 0)) / 100;
      const finalUnitPrice = book.price - discount;
      const totalPrice = finalUnitPrice * item.quantity;

      subtotal += book.price * item.quantity;
      totalDiscount += discount * item.quantity;

      return {
        id: `oi-${Date.now()}-${idx}`,
        bookId: book.id,
        book,
        quantity: item.quantity,
        unitPrice: book.price,
        totalPrice: Number(totalPrice.toFixed(2)),
      };
    });

    const pointsDiscount = Number((pointsRedeemed * 0.1).toFixed(2));
    const totalAmount = Number(Math.max(0, subtotal - totalDiscount - pointsDiscount).toFixed(2));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: userStore.id,
      addressId: address.id,
      address,
      status: 'PAID',
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(totalDiscount.toFixed(2)),
      pointsRedeemed,
      pointsDiscount,
      totalAmount,
      createdAt: new Date().toISOString(),
      items: orderItems,
      paymentMethod: paymentMethod || 'CREDIT_CARD',
    };

    // Persist to singleton store — survives hot-reloads
    userStore.giftPoints = Math.max(0, userStore.giftPoints - pointsRedeemed);
    orderStore.unshift(newOrder);

    return NextResponse.json(
      {
        success: true,
        message: 'Order placed and payment successfully committed!',
        order: newOrder,
        remainingPoints: userStore.giftPoints,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
