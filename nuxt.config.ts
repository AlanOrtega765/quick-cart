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
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      cssnano:
        process.env.NODE_ENV === 'production'
          ? { preset: ['default', { discardComments: { removeAll: true } }] }
          : false,
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
