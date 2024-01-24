<script setup lang="ts">
import type { Product } from '~/types';

const route = useRoute();
const supabase = useSupabaseClient();

const { data: product } = await useAsyncData(async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', route.params.id)
    .single();

  if (!data) {
    return console.log('No se encuentra el producto.');
  }
  return data as Product;
});
</script>

<template>
  <div class="grid grid-cols-2 my-10 bg-white rounded-xl pr-10 py-10">
    <img
      class="w-[300px] h-[400px] object-contain px-4 mx-auto"
      :src="product?.image"
      :alt="product?.title"
    />
    <div class="flex flex-col flex-grow text-zinc-700">
      <h1 class="text-4xl font-bold">{{ product?.title }}</h1>
      <p class="text-zinc-600 mt-4 text-lg">
        {{ product?.description }}
      </p>
      <div class="flex flex-col flex-grow justify-end items-end mt-10">
        <div class="flex items-center justify-end">
          <div class="relative">
            <div
              v-if="product?.rating"
              class="absolute top-0 left-0 flex overflow-hidden"
              :style="{ width: `${(product?.rating.rate / 5) * 100}%` }"
            >
              <Icon
                class="text-amber-400 min-w-[30px] min-h-[30px]"
                v-for="i in 5"
                :key="i"
                name="tabler:star-filled"
                size="30"
              />
            </div>
            <Icon
              v-for="i in 5"
              :key="i"
              class="text-amber-400"
              name="tabler:star"
              size="30"
            />
          </div>
          <span class="font-medium ml-2 text-2xl">{{
            product?.rating.rate.toString().length === 1
              ? product?.rating.rate + '.0'
              : product?.rating.rate
          }}</span>
        </div>
        <h2 class="text-end font-bold text-2xl mt-4">
          Precio: ${{
            product?.price.toString().length === 4
              ? product?.price + '0'
              : product?.price
          }}
        </h2>
      </div>
      <div class="grid grid-cols-2 mt-4 gap-x-4">
        <button
          class="py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md"
        >
          Añadir al carrito
        </button>
        <button
          class="py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-md"
        >
          Comprar ahora
        </button>
      </div>
    </div>
  </div>
</template>
