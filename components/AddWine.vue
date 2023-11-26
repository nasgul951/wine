<template lang="pug">
div(class="fixed top-0 right-0 w-full h-full bg-gray-500 bg-opacity-70")
   div(class="flex md:h-full items-center justify-center")
      div(class="md:w-2/3 w-full max-h-full border-2 bg-blue-200")
         div.flex(class="p-3 bg-gray-500 font-semibold text-white") 
            div.flex-grow Add Wine
            div.cursor-pointer(@click="$emit('close')") x
         div.w-full.flex.flex-wrap
            div.flex-grow.p-2 
               div Vineyard:
               input(type="text" v-model="wine.vineyard")
            div.flex-grow.p-2 
               div Label:
               input(type="text" v-model="wine.label")
         div.flex.flex-wrap
            div.flex-grow.p-2 
               div Varietal:
               input(type="text" v-model="wine.varietal")
            div.flex-grow.p-2 
               div Vintage:
               input(type="text" v-model="wine.vintage")
         div.flex
            div.flex-grow.p-2 
               div Notes:
               textarea.w-full(v-model="wine.notese")
         div.flex
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
                  input.w-full(type="text" v-model="b.binX" @change="patchBottle({id: b.id, binX: b.binX}, b)")
               div.w-28.p-2 
                  input.w-full(type="text" v-model="b.binY" @change="patchBottle({id: b.id, binY: b.binY}, b)")
               div.w-28.p-2 
                  input.w-full(type="text" v-model="b.depth" @change="patchBottle({id: b.id, depth: b.depth}, b)")
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
import { Wine, Bottle } from '~/lib/Wine'

export default Vue.extend({
   props: {
      storeId: {
         type: Number,
         default: 1
      }
   },
   data () {
      return {
         wine: {
            vineyard: '',
            label: '',
            varietal: '',
            vintage: 0,
            notes: ''
         } as Wine,
         bottle: {} as Bottle,
         bottles: [] as Bottle[]
      }
   },
   mounted () {
      if (this.wine.id)
         this.getBottles()
   },
   methods: {
      async addWine () {
         const result = await this.$api.wine.put(this.wine)
         if (result.success) {
            this.wine = result.data
            this.getBottles()
         } else {
            alert('Failed to add wine')
         }
      },
      async addBottle () {
         this.bottle.wineId = this.wine.id
         this.bottle.storageId = this.storeId
         const result = await this.$api.wine.putBottle(this.bottle)
         if (result.success) {
            this.bottle.binX = undefined
            this.bottle.binY = undefined
            this.bottle.depth = undefined
            this.getBottles()
         } else {
            alert('Failed to add bottle')
         }
      },
      async patchBottle (patch: Bottle, theBottle: Bottle) {
         const result = await this.$api.wine.patchBottle(patch)
         if (result.success) {
            theBottle = result.data
         } else {
            alert('Failed to update the bottle')
         }
      },
      async getBottles () {
         const result = await this.$api.wine.getBottles(this.wine.id)
         if (result.success) {
            this.bottles = result.data
         } else {
            alert('Failed to get bottles')
         }
      }
   }
})
</script>

<style>
   input {
      border: 1px solid black;
      background-color: white;
   }
   textarea {
      border: 1px solid black;
      background-color: white;
   }
</style>