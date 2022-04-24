<template lang="pug">
div
   div.w-80.grid.grid-cols-6.gap-1.border-4.bg-gray-800.border-gray-800.text-center
      div.h-12.text-white.flex.items-center.justify-center.box-content(
         v-for="bin in store"
         :class="[bin.isDouble ? 'col-span-3 row-span-2 h-24 pb-1' : '', {'bg-gray-500': bin.count != '0'}]"
      )
         div(v-if="bin.count != '0'") {{bin.count}}
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
   components: {  },
   async asyncData ({$axios, $config, error}) {
      const url = `${$config.apiBaseUrl}/wine/store/`
      try {
         const response = await $axios.get(url);
         if (response && response.data && response.data.data) {
            return {
               data: response.data.data
            }
         } else {
            throw { statusCode: 500, message: 'Data Error!'}
         }
      } catch (ex: any) {
         error(ex)
      }
   },
   data () {
      return {
         data: [],
         store: new Array<{}>()
      }
   },
   mounted () {
      this.parseContents()
   },
   methods: {
      parseContents () {
         let y = 0
         let ix = 0
         let d = this.data[ix] as any
         const sr = new Array<string>()
         // first row is special (6 wide)
         for (let x=1; x<=6; x++) {
            if ((y == d.binY) && (x == d.binX)) {
               this.store.push(
                  {
                     id: this.calcBinId(x,y),
                     count: d.binCount,
                     isDouble: false
                  }
               )
               d = this.data[++ix] as any
            } else {
               this.store.push({
                  id: this.calcBinId(x,y),
                  count:'0', 
                  isDouble:false})
            }
         }

         // the rest is uniform
         for(let y=1; y<=14; y++) {
            const sr = new Array<string>()
            for(let x=1; x<=4; x++) {
               if ((x === 4) && (y % 2 === 0))
                  continue
               
               if ((y == d.binY) && (x == d.binX)) {
                  this.store.push({
                     id: this.calcBinId(x,y),
                     count: d.binCount,
                     isDouble: (x > 3)
                  })
                  d = this.data[++ix] as any
               } else {
                  this.store.push({
                     id: this.calcBinId(x,y),
                     count:'0', 
                     isDouble: (x > 3)})
               }
            }
         }

      },
      calcBinId(x: number, y: number): number {
         return 1000 + (x*100) + y;
      }
   }
})
</script>

<style scoped>
</style>