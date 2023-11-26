import { Plugin } from '@nuxt/types'
import { IRepository } from '~/api/repository'
import { WineApi } from '~/api/wine'

const apiPlugin: Plugin = (context, inject) => {
   const wine = new WineApi(context.$config.apiBaseUrl, context.$axios)

   const api: IRepository = {
      wine
   }
   inject('api', api)
}

export default apiPlugin