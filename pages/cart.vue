<script setup lang="ts">
import type { Cart } from '~/types';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { data: cart } = await useAsyncData(async () => {
  if (!user.value) return;

  const { data, error } = await supabase
    .from('carts')
    .select(
      'id, user_id, quantity, products (id, title, description, image, price)'
    )
    .eq('user_id', user.value.id);

  if (!data) return console.log(error);

  const newData = data.map((item) => {
    return {
      id: item.id,
      user_id: item.user_id,
      quantity: item.quantity,
      product: item.products,
    };
  });
  return newData as Cart[];
});
</script>

<template>
  <div class="grid grid-cols-6 my-10 bg-white rounded-xl">
    <div class="grid gap-y-4 col-span-4 p-10">
      <div
        class="flex gap-x-4 h-[200px] p-4 border rounded-md"
        v-for="item in cart"
        :key="item.id"
      >
        <img
          class="h-full w-[100px] object-contain"
          :src="item.product.image"
          :alt="item.product.title"
        />
        <div class="flex flex-col flex-grow">
          <div class="flex gap-x-10 flex-grow">
            <div>
              <h1 class="font-medium">{{ item.product.title }}</h1>
              <p class="text-xs text-zinc-700">
                {{ item.product.description }}
              </p>
            </div>
            <span
              class="bg-zinc-800 text-white py-1 px-3 rounded-full h-fit font-medium"
              >${{ item.product.price }}</span
            >
          </div>
          <div class="flex items-center justify-end gap-x-2">
            <button
              class="bg-zinc-800 hover:bg-zinc-950 text-white flex items-center justify-center rounded h-6 w-6 text-lg"
            >
              -
            </button>
            <span class="text-zinc-800">{{ item.quantity }}</span>
            <button
              class="bg-zinc-800 hover:bg-zinc-950 text-white flex items-center justify-center rounded h-6 w-6 text-lg"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-2"></div>
  </div>
</template>
