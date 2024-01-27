<script setup lang="ts">
import type { Cart } from '~/types';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const toast = useToast();

const { data: cart } = await useAsyncData(async () => {
  if (!user.value) return;

  const { data, error } = await supabase
    .from('carts')
    .select(
      'id, user_id, quantity, products (id, title, description, image, price)'
    )
    .eq('user_id', user.value.id);

  if (!data) return console.log(error);

  const newData = data.map((item: Cart) => {
    return {
      id: item.id,
      user_id: item.user_id,
      quantity: item.quantity,
      product: item.products,
    };
  });

  return newData;
});

const totalPrice = computed(() => {
  let total = 0;
  cart.value?.forEach((item) => {
    total = total + item.product.price * item.quantity;
  });

  return total.toFixed(2);
});

const addItem = (quantity: number) => quantity + 1;
const removeItem = (quantity: number) => {
  if (quantity === 0) return 0;
  return quantity - 1;
};

const deleteProduct = async (product_id: number) => {
  if (!user.value) return;

  const { error } = await supabase
    .from('carts')
    .delete()
    .eq('user_id', user.value?.id)
    .eq('product_id', product_id);

  if (error) return console.log(error);

  cart.value = cart.value?.filter((item) => item.product.id !== product_id);
  toast.add({
    title: 'Producto Eliminado!',
    description: 'Se ha eliminado el producto del carrito.',
    color: 'green',
    icon: 'i-heroicons-check-circle',
    timeout: 2000,
  });
};

const confirmDeleteProduct = (product_id: number) => {
  toast.add({
    title: '¿Estás seguro?',
    description: 'Se eliminará el producto de tu carrito.',
    icon: 'i-heroicons-question-mark-circle',
    timeout: 0,
    actions: [
      {
        label: 'Confirmar',
        click: () => deleteProduct(product_id),
      },
      {
        label: 'Cancelar',
      },
    ],
  });
};
</script>

<template>
  <div class="grid grid-cols-6 gap-x-4 my-10 bg-white rounded-xl p-10">
    <div class="grid gap-y-4 col-span-4">
      <div
        class="relative flex gap-x-4 h-auto p-10 border rounded-md group"
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
          <div class="flex items-center justify-end gap-x-2 mt-4">
            <button
              class="bg-zinc-800 hover:bg-zinc-950 text-white flex items-center justify-center rounded h-6 w-6 text-lg"
              @click="item.quantity = removeItem(item.quantity)"
            >
              -
            </button>
            <span class="text-zinc-800">{{ item.quantity }}</span>
            <button
              class="bg-zinc-800 hover:bg-zinc-950 text-white flex items-center justify-center rounded h-6 w-6 text-lg"
              @click="item.quantity = addItem(item.quantity)"
            >
              +
            </button>
          </div>
        </div>
        <button
          class="absolute top-1 right-1 hidden group-hover:block text-red-500 hover:text-red-600"
          @click="confirmDeleteProduct(item.product.id)"
        >
          <Icon name="typcn:delete" size="30" />
        </button>
      </div>
    </div>
    <div class="col-span-2">
      <div class="border rounded-xl p-4 grid">
        <span class="font-semibold">Valor total: ${{ totalPrice }}</span>

        <button
          class="bg-emerald-400 hover:bg-emerald-500 text-white font-medium py-2 rounded-md mt-4"
        >
          Realizar Pago
        </button>
      </div>
    </div>
  </div>
</template>
