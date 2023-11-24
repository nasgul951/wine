<template lang="pug">
div.relative
   div.w-80.grid.grid-cols-6.gap-1.border-4.bg-gray-800.border-gray-800.text-center
      div.h-12.text-white.flex.items-center.justify-center.box-content(
         v-for="bin in store" 
         v-bind:key="bin.id"
         @click="getBinList(bin.id)"
         :class="[bin.isDouble ? 'col-span-3 row-span-2 h-24 pb-1' : '', {'bg-gray-500': bin.count != '0'}]"
      )
         div(v-if="bin.count != '0'") {{bin.count}}
   
   div.absolute.top-0.left-0(v-if="selectedBin")
      div.flex.bg-gray-300.p-2
         div.flex-grow Bin ({{selectedBin.x}}, {{selectedBin.y}}) Contents
         div.cursor-pointer(@click="closeBin()") X
      div.flex.flex-wrap.bg-gray-500
         div.w-28.p-2 
            div Varietal:
         div.w-28.p-2 
            div Vintage:
         div.w-28.p-2 
            div Vineyard:
         div.w-28.p-2 
            div Label:
         div.w-28.p-2 
            div Depth:
      div.flex.flex-wrap(
         v-for="w in selectedBin.binList" 
         v-bind:key="w.bottleid"
         class="odd:bg-gray-300 even:bg-white")
         div.w-28.p-2 
            div {{w.varietal}}
         div.w-28.p-2 
            div {{w.vintage}}
         div.w-28.p-2 
            div {{w.vineyard}}
         div.w-28.p-2 
            div {{w.label}}
         div.w-28.p-2 
            div {{w.depth}}

</template>

<script lang="ts">
interface IBottle {
   bottleid: string,
   wineid: string,
   vineyard: string,
   label: string,
   varietal: string
}
interface IBin {
   x: number,
   y: number,
   binList: Array<IBottle>
}

import Vue from 'vue'

export default Vue.extend({
   layout: 'default',
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
         store: new Array<{}>(),
         selectedBin: null as IBin | null
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
      },
      uncalcBinId(binId: number): IBin {
         return {
            x: Math.floor((binId % 1000) / 100),
            y: (binId % 1000) % 100,
            binList: []
         }
      },
      closeBin () {
         this.selectedBin = null
      },
      async getBinList(binId: number) {
         const bin = this.uncalcBinId(binId)
         const url = `${this.$config.apiBaseUrl}/wine/store/?binid=${binId}`
         const response = await this.$axios.get(url);
         if (response && response.data && response.data.data) {
            bin.binList = response.data.data
            this.selectedBin = bin
         }
      }
   }
})
</script>

<style scoped>
</style>