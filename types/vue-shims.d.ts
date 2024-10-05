// vue-shims.d.ts
import Vue from 'vue';
import { IRepository } from '~/api/repository.ts'

declare module 'vue/types/vue' {
  interface Vue {
    $api: IRepository
  }
}