<template lang="pug">
   div(class="fixed top-0 right-0 w-full h-full bg-gray-500 bg-opacity-70")
      div(class="flex md:h-full items-center justify-center")
         div(class="md:w-2/3 w-full max-h-full border-2 bg-blue-200")
            div.flex(class="p-3 bg-gray-500 font-semibold text-white") 
               div.flex-grow 
                  span(v-if="!wine.id") Add Wine
                  span(v-if="wine.id") Wine Detail
               div.cursor-pointer(@click="$emit('close')") x
            div.w-full.flex.flex-wrap
               div.flex-grow.p-2 
                  div Vineyard:
                  input(type="text" v-model="wine.vineyard" @change="patchWine('vineyard')")
               div.flex-grow.p-2 
                  div Label:
                  input(type="text" v-model="wine.label" @change="patchWine('label')")
            div.flex.flex-wrap
               div.flex-grow.p-2 
                  div Varietal:
                  input(type="text" v-model="wine.varietal" @change="patchWine('varietal')")
               div.flex-grow.p-2 
                  div Vintage:
                  input(type="text" v-model="wine.vintage" @change="patchWine('vintage')")
            div.flex
               div.flex-grow.p-2 
                  div Notes:
                  textarea.w-full(v-model="wine.notes" @change="patchWine('notes')")
            div.flex.justify-end
               div.p-2
                  button(v-if="!wine.id" @click="addWine" class="bg-blue-600 hover:bg-blue-dark text-white font-bold py-2 px-4 rounded") Add Wine
            div.flex.flex-col(v-if="wine.id")
               h3.flex-grow.p-2.bg-gray-500.font-semibold.text-white Bottles
               div.flex.flex-wrap
                  div.w-28.p-2 
                     div BinX:
                  div.w-28.p-2 
                     div BinY:
                  div.w-28.p-2 
                     div Depth:
               div.flex.flex-wrap(v-for="b in bottles" v-bind:key="b.id")
                  div.w-28.p-2 
                     input.w-full(type="text" v-model="b.binX" @change="patchBottle('binX', b)")
                  div.w-28.p-2 
                     input.w-full(type="text" v-model="b.binY" @change="patchBottle('binY', b)")
                  div.w-28.p-2 
                     input.w-full(type="text" v-model="b.depth" @change="patchBottle('depth', b)")
               div.flex.flex-wrap
                  div.w-28.p-2 
                     input.w-full(type="text" v-model="bottle.binX")
                  div.w-28.p-2 
                     input.w-full(type="text" v-model="bottle.binY")
                  div.w-28.p-2 
                     input.w-full(type="text" v-model="bottle.depth")
                  div.w-7.p-2 
                     button(
                        class="px-3 bg-blue-400 rounded-lg font-extrabold text-white"
                        @click="addBottle"   
                     ) +
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
   props: {
      wineid: {
         type: Number,
         default: null,
      }
   },
   data () {
      return {
         wine: {
            id: 0,
            vineyard: '',
            label: '',
            varietal: '',
            vintage: '',
            nodes: ''
         },
         bottle: {
            wineid: 0,
            storageid: 1,
            binX: '',
            binY: '',
            depth: ''
         },
         bottles: []
      }
   },
   mounted () {
      if (this.wineid)
         this.getWine()
   },
   methods: {
      async getWine () {
         const url = `${this.$config.apiBaseUrl}/wine/?id=${this.wineid}`
         const response = await this.$axios.get(url)
         if (response && response.data && response.data.data) {
            this.wine = response.data.data
            this.getBottles()
         }
      },
      async addWine () {
         const url = `${this.$config.apiBaseUrl}/wine/`
         const response = await this.$axios.put(url, this.wine)
         if (response && response.data && response.data.data) {
            this.wine = response.data.data
            this.getBottles()
         }
      },
      async patchWine (f: string) {
         const b = {
            id: this.wine.id,
            [f]: (this.wine as any)[f]
         }
         const url = `${this.$config.apiBaseUrl}/wine/`
         const response = await this.$axios.patch(url, b)
         if (response && response.data && response.data.data) {
            this.wine = response.data.data
         }
      },
      async addBottle () {
         const url = `${this.$config.apiBaseUrl}/wine/bottles/`
         const response = await this.$axios.put(url, this.bottle)
         if (response && response.data && response.data.data) {
            this.bottle.binX = ''
            this.bottle.binY = ''
            this.bottle.depth = ''
            this.getBottles()
         }
      },
      async patchBottle (f: string, b: any) {
         const p = {
            id: b.bottleid,
            [f]: b[f]
         }
         const url = `${this.$config.apiBaseUrl}/wine/bottles/`
         const response = await this.$axios.patch(url, p)
         if (response && response.data && response.data.data) {
            b = response.data.data
         }
      },
      async getBottles () {
         const url = `${this.$config.apiBaseUrl}/wine/bottles/?wineid=${this.wine.id}`
         const response = await this.$axios.get(url)
         if (response && response.data && response.data.data) {
            this.bottles = response.data.data
         }
      }

   }
})
</script>