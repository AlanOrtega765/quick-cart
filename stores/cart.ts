import { defineStore } from 'pinia';
import type { Product, Database } from '~/types';

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Product[]>([]);
  const totalItems = ref(0);
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const toast = useToast();

  const setTotalItems = (count: number) => (totalItems.value = count);

  const incrementTotalItems = () => totalItems.value++;

  const addItemToCart = async (product_id: number, buyNow = false) => {
    const { data: existingProduct } = await supabase
      .from('carts')
      .select('*')
      .eq('product_id', product_id)
      .eq('user_id', user.value?.id)
      .single();

    if (existingProduct) {
      const { error } = await supabase
        .from('carts')
        .update({
          quantity: existingProduct.quantity + 1,
        })
        .eq('product_id', product_id)
        .eq('user_id', user.value?.id);

      if (error) return console.log(error);

      incrementTotalItems();
      return toast.add({
        title: 'Producto en carrito, añadido!',
        description:
          'Se ha aumentado la cantidad del producto seleccionado en el carrito.',
        color: 'green',
        icon: 'i-heroicons-check-circle',
        timeout: 2000,
        callback: () => {
          if (buyNow) return navigateTo('/cart');
        },
      });
    }

    const { error } = await supabase.from('carts').insert({
      product_id,
      quantity: 1,
    });

    if (error) return console.log(error);

    incrementTotalItems();
    toast.add({
      title: 'Añadido Correctamente!',
      description: 'Producto añadido al carrito.',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 2000,
      callback: () => {
        if (buyNow) return navigateTo('/cart');
      },
    });
  };

  return {
    setTotalItems,
    totalItems,
    incrementTotalItems,
    cart,
    addItemToCart,
  };
});
