<script setup lang="ts">
import type { Cart } from '~/types';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const store = useCartStore();
const route = useRoute();

const isOpenModal = ref(false);

await useAsyncData(async () => {
  if (!user.value) return;

  const { data, error } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', user.value?.id);

  if (!data) return console.log(error);

  let count = 0;

  data.forEach((item: Cart) => (count = count + item.quantity));
  store.setTotalItems(count);

  return data;
});
const cartTotalItems = computed(() => store.totalItems);

const logOut = async () => {
  await supabase.auth.signOut();
  navigateTo('/');
};
</script>

<template>
  <header class="sticky top-0 left-0 h-20 shadow-md bg-white z-10">
    <UContainer class="h-full">
      <nav class="flex items-center justify-between h-full">
        <NuxtLink to="/" class="font-bold text-2xl">QuickCart.</NuxtLink>
        <div v-if="user" class="relative">
          <div
            class="flex items-center gap-x-2 hover:bg-gray-100 transition-colors p-2 rounded-md cursor-pointer"
            @click="isOpenModal = true"
          >
            <span>{{ user?.email }}</span>
            <Icon name="tabler:chevron-down" size="20" />
          </div>
          <div v-if="isOpenModal">
            <div
              class="absolute top-10 right-0 w-[200px] bg-white p-2 shadow-lg rounded-md z-10"
            >
              <button
                class="py-1 px-2 rounded-md hover:bg-gray-100 w-full text-start transition-colors"
                @click="logOut"
              >
                Cerrar Sesión
              </button>
            </div>
            <div
              class="fixed top-0 left-0 w-full h-full bg-black/60"
              @click="isOpenModal = false"
            ></div>
          </div>
        </div>
        <div v-else class="flex gap-x-2">
          <NuxtLink
            to="/login"
            class="px-3 py-2 rounded-md font-medium text-zinc-800 hover:text-zinc-950"
            >Iniciar Sesión</NuxtLink
          >
          <NuxtLink
            to="/register"
            class="bg-zinc-900 hover:bg-zinc-950 text-white px-3 py-2 rounded-md font-medium"
            >Registrarse</NuxtLink
          >
        </div>
      </nav>
    </UContainer>
  </header>
  <main>
    <UContainer>
      <slot />
    </UContainer>
    <NuxtLink
      v-if="user && route.path !== '/cart'"
      class="fixed bottom-8 right-8 bg-black h-20 w-20 rounded-full grid place-content-center shadow-xl"
      to="/cart"
    >
      <Icon class="text-white" name="gridicons:cart" size="50" />
      <ClientOnly>
        <div
          class="absolute -top-1 right-0 bg-gray-400 w-7 h-7 rounded-full grid place-content-center text-white font-medium"
        >
          {{ cartTotalItems }}
        </div>
      </ClientOnly>
    </NuxtLink>
  </main>
</template>
