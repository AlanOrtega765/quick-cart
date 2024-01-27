export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/supabase',
    '@nuxt/ui',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
  ],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '',
      exclude: ['/', '/register', '/product/*'],
    },
  },
  image: {
    provider: 'netlify',
  },
  googleFonts: {
    families: {
      Poppins: [300, 400, 500, 600, 700],
    },
  },
  colorMode: {
    preference: 'light',
  },
});
