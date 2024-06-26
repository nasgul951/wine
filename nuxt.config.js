export default {
  target: 'static',
  ssr: false,
  publicRuntimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'wine',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
     '~/plugins/api.ts',
     '~/plugins/axios'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  axios: {

  },
  auth: {
   redirect: {
      login: '/login/',
      logout: false,
      callback: false,
      home: '/'
   },
   strategies: {
      local: {
         token: {
            property: 'token',
            name: 'x-api-key',
            type: '',
         },
         user: {
            property: false
         },
         endpoints: {
            login: { url: process.env.API_BASE_URL + '/auth/', method: 'post' },
            user: { url: process.env.API_BASE_URL + '/auth/user/', method: 'get' },
            logout: { url: process.env.API_BASE_URL + '/auth/logout/', method: 'post' }
         }
      }
      
   },
   resetOnError: true
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  router: {
     middleware: ['auth']
  }
}
