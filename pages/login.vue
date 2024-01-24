<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';

definePageMeta({
  layout: 'auth',
});

const supabase = useSupabaseClient();
const { loginScheme } = useJoiSchemes();
const toast = useToast();

const user = ref({
  email: '',
  password: '',
});
const loading = ref(false);
const disabled = ref(false);

const handlerLogin = async (event: FormSubmitEvent<any>) => {
  loading.value = true;
  disabled.value = true;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: event.data.email,
    password: event.data.password,
  });

  if (!data.user) {
    loading.value = false;
    disabled.value = false;
    return toast.add({
      title: 'Error en el inicio de sesión',
      description: 'Credenciales incorrectas o usuario no existe.',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000,
    });
  }

  user.value = {
    email: '',
    password: '',
  };
  loading.value = false;
  toast.add({
    title: 'Inicio de Sesión Exitoso!',
    description: 'Te has autenticado correctamente, redirigiendote...',
    color: 'green',
    icon: 'i-heroicons-check-circle',
    timeout: 3000,
    callback: () => navigateTo('/'),
  });
};
</script>

<template>
  <UCard class="w-full max-w-screen-sm shadow-lg">
    <template #header>
      <h1 class="text-2xl font-bold text-zinc-800">Iniciar Sesión</h1>
    </template>

    <UForm
      class="space-y-4"
      :schema="loginScheme"
      :state="user"
      @submit="handlerLogin"
    >
      <UFormGroup label="Correo Electrónico" name="email">
        <UInput v-model="user.email" :disabled="disabled" size="lg"/>
      </UFormGroup>

      <UFormGroup label="Contraseña" name="password">
        <UInput v-model="user.password" type="password" :disabled="disabled" size="lg"/>
      </UFormGroup>

      <UButton
        class="flex items-center text-center py-3"
        type="submit"
        :loading="loading"
        :disabled="disabled"
        block
      >
        Ingresar
      </UButton>
    </UForm>

    <template #footer>
      <div class="flex flex-col items-center gap-x-4">
        <h4>¿Aún no tienes una cuenta?</h4>
        <NuxtLink to="/register">Registrate Aquí</NuxtLink>
      </div>
    </template>
  </UCard>
</template>
