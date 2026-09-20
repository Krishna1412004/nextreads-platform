/**
 * Server-side in-memory store.
 * Stored on the Node.js `global` object so it survives
 * Next.js hot-reloads and module re-evaluations in dev mode.
 */
import { mockOrderHistory, mockUser as _mockUser } from '@/lib/mock-data';
import { Order, User } from '@/types';

declare global {
  // eslint-disable-next-line no-var
  var __orderStore: Order[] | undefined;
  // eslint-disable-next-line no-var
  var __userStore: User | undefined;
}

// Seed once from mock data — never reset after that
if (!global.__orderStore) {
  global.__orderStore = [...mockOrderHistory];
}
if (!global.__userStore) {
  global.__userStore = { ..._mockUser };
}

export const orderStore = global.__orderStore;
export const userStore  = global.__userStore;
