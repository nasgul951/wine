<template lang="pug">
   div(class="fixed top-0 right-0 w-full h-full bg-gray-500 bg-opacity-70")
      div.flex.h-full.items-center.justify-center
         div(class="md:w-96 w-full max-h-full border-2 bg-white")
            div.flex(class="p-3 bg-gray-500 font-semibold text-white") 
               div.flex-grow {{wine.vineyard}}
               div.cursor-pointer(@click="$emit('close')") x
            div.flex
               div.p-2 {{wine.vintage}}
               div.p-2 {{wine.label}}
               div.p-2 {{wine.varietal}}
            h3.p-2.bg-gray-500.font-semibold.text-white Bottles
            div.flex
               table.w-full
                  tr.font-semibold.bg-gray-300
                     td.p-2 Location
                     td.p-2.text-center X
                     td.p-2.text-center Y
                     td.p-2.text-center Depth
                     td.p-2 &nbsp;
                  tr.border-b-2(v-for="b in bottles" v-bind:key="b.bottleid")
                     td.p-2 {{b.storageDescription}}
                     td.p-2.text-center {{b.binX}}
                     td.p-2.text-center {{b.binY}}
                     td.p-2.text-center {{b.depth}}
                     td.p-2.font-bold.text-center.cursor-pointer x
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
   props: {
      wine: {
         type: Object,
         required: true
      }
   },
   data () {
      return {
         bottles: []
      }
   },
   mounted () {
      this.getBottles()
   },
   methods: {
      async getBottles () {
         const url = `${this.$config.apiBaseUrl}/wine/bottles/?wineid=${this.wine.id}`
         const response = await this.$axios.get(url, {
         headers: {
            'x-api-key': this.$config.apiKey
         }
         })
         if (response && response.data && response.data.data) {
            this.bottles = response.data.data
         }
      }
   }
})
</script>