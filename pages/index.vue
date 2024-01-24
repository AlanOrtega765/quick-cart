<script setup lang="ts">
import type { Product, Database } from '~/types';

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const store = useCartStore();
const toast = useToast();

const { data: products } = await useAsyncData(async () => {
  const { data } = await supabase.from('products').select('*');
  return data as Product[];
});

const addProductToCart = async (product_id: number) => {
  if (!user.value) {
    return toast.add({
      title: 'Ups!, no tienes permisos',
      description: 'Debes iniciar sesión para agregar el producto al carrito.',
      color: 'yellow',
      icon: 'i-heroicons-key',
      timeout: 3000,
    });
  }

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

    store.incrementTotalItems();
    return toast.add({
      title: 'Producto en carrito, añadido!',
      description:
        'Se ha aumentado la cantidad del producto seleccionado en el carrito.',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 4000,
    });
  }

  const { error } = await supabase.from('carts').insert({
    product_id,
    quantity: 1,
  });

  if (error) return console.log(error);

  store.incrementTotalItems();
  toast.add({
    title: 'Añadido Correctamente!',
    description: 'Producto añadido al carrito.',
    color: 'green',
    icon: 'i-heroicons-check-circle',
    timeout: 3000,
  });
};
</script>

<template>
  <div class="grid grid-cols-4 py-10 gap-4">
    <div
      class="flex flex-col rounded-md bg-white"
      v-for="product in products"
      :key="product.id"
    >
      <div class="relative">
        <img
          class="aspect-square h-[250px] p-4 w-full object-contain"
          :src="product.image"
          :alt="product.title"
        />
        <div
          class="absolute top-2 right-2 bg-zinc-800 text-white py-1 px-2 rounded-full"
        >
          ${{ product.price }}
        </div>
      </div>
      <div class="flex flex-col flex-grow px-2 py-4">
        <div class="flex-grow">
          <h1 class="text-sm font-medium text-zinc-600">
            {{ product.title }}
          </h1>
          <div class="flex items-center mt-2">
            <div class="relative flex">
              <div
                class="absolute top-0 left-0 flex overflow-hidden"
                :style="{ width: `${(product.rating.rate / 5) * 100}%` }"
              >
                <Icon
                  class="text-amber-400 min-w-[24px] min-h-[24px]"
                  v-for="i in 5"
                  :key="i"
                  name="tabler:star-filled"
                  size="24"
                />
              </div>
              <Icon
                v-for="i in 5"
                :key="i"
                class="text-amber-400"
                name="tabler:star"
                size="24"
              />
            </div>
            <span class="font-medium ml-2">{{
              product.rating.rate.toString().length === 1
                ? product.rating.rate + '.0'
                : product.rating.rate
            }}</span>
          </div>
        </div>
        <div class="flex flex-col gap-y-2 mt-4">
          <NuxtLink
            :to="`/product/${product.id}`"
            class="bg-zinc-500 hover:bg-zinc-600 text-center text-white font-medium py-2 rounded-lg w-full"
          >
            Ver detalles
          </NuxtLink>
          <button
            class="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg w-full"
            @click="addProductToCart(product.id)"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
