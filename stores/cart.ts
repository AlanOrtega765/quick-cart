import { defineStore } from 'pinia';
import type { Product } from '~/types';

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Product[]>([]);
  const totalItems = ref(0);

  const setTotalItems = (count: number) => (totalItems.value = count);

  const incrementTotalItems = () => totalItems.value++;

  return { setTotalItems, totalItems, incrementTotalItems, cart };
});
