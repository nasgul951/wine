<template>
    <v-navigation-drawer
      :value="value"
      right
      width="300"
      app
      temporary
      touchless
      style="z-index: 2000"
      @input="(val) => $emit('input', val)"
   >
    <v-card elevation="0">
      <v-card-title class="primary">Layout</v-card-title>
      <v-card-text class="pt-5">
         <div class="absolute top-0 left-0" v-if="selectedBin">
            <v-list>
               <v-subheader>
                  Shelf: {{ selectedBin.y }} - {{ selectedBin.x }}
               </v-subheader>
               <v-list-item-group color="primary">
                  <v-list-item 
                     v-for="wine in selectedBin.binList" 
                     v-bind:key="wine.bottleid"
                     @click="selectWine(wine.wineid)"
                  >
                     <v-list-item-content>
                        <v-list-item-title>{{ wine.depth }}: {{ wine.vineyard }}</v-list-item-title>
                        <v-list-item-subtitle>{{ wine.vintage }} {{ wine.label }} {{ wine.varietal }}</v-list-item-subtitle>
                     </v-list-item-content>
                  </v-list-item>
               </v-list-item-group>
            </v-list>
         </div>  

         <div 
            class="pa-5 grid grid-cols-6 gap-1 border-4 pink red--border text-center" 
            v-if="loaded"
         >
            <div class="bin h1 text-white d-flex items-center justify-center box-content"
               v-for="bin in store" 
               v-bind:key="bin.id"
               @click="getBinList(bin.id)"
               :class="[bin.isDouble ? 'row-span-2 h2 pb-1' : '', bin.isRow ? 'col-span-6' : '', {'pink lighten-5': bin.count != 0}, {'pink lighten-4': bin.count === 0}]"
            >
               <div v-if="bin.count != 0">{{bin.count}}</div>
            </div>
         </div>
         <div v-else>
            <v-progress-circular />
         </div> 
       </v-card-text>
    </v-card>
  </v-navigation-drawer>    
 </template>
 
<script lang="ts">
   import Vue from 'vue'
   import { StoreLocation, StoreItem } from '~/lib/Wine'

   interface IBin {
      x: number,
      y: number,
      binList: Array<StoreItem>
   }
   interface ILocation {
      id: number
      count: number
      isDouble: boolean
      isRow: boolean
   }

   export default Vue.extend({
      props: {
         value: {
            type: Boolean,
            default: false
         },
         storeId: {
            type: Number,
            default: 5,
         }
      },
      data () {
         return {
            loaded: false,
            loading: false,
            data: undefined as StoreLocation[] | undefined,
            store: Array<ILocation>(),
            selectedBin: undefined as IBin | undefined,
            showBinContent: false
         }
      },
      watch: {
         value (newVal, oldVal) {
            if (!oldVal && newVal) {
               this.selectedBin = undefined
               this.getStore()
            }
         }
      },
      methods: {
         closeDrawer () {
            this.$emit('input', false)
         },
         selectWine (id: number) {
            this.$emit('selected', id)
            this.closeDrawer()
         },
         async getBinList(binId: number) {
            const bin = this.unpackBinId(binId)
            const result = await this.$api.wine.getBinList(this.storeId, binId)
            if (result.success) {
               bin.binList = result.data
               this.selectedBin = bin
            }
         },
         async getStore () {
            console.log('getting store info...')
            this.loading = true
            const result = await this.$api.wine.getStore(this.storeId)
            if (result.success) {
               this.data = result.data
               console.log('got store info...')
               this.parseContents()
               this.loaded = true
            }
            this.loading = false
         },
         packBinId(x: number, y: number): number {
            return this.storeId * 1000 + (x*100) + y;
         },
         unpackBinId(binId: number): IBin {
            return {
               x: Math.floor((binId % (1000 * this.storeId)) / 100),
               y: (binId % (1000 * this.storeId)) % 100,
               binList: []
            }
         },
         closeBin () {
            this.selectedBin = undefined
         },
         parseContents () {
            this.store = Array<ILocation>()
            let y = 0
            let ix = 0
            let d = this.data![ix] as StoreLocation

            // treat 0 as single bin
            let topCount = 0;
            while (d.binY == 0) {
               topCount += d.binCount
               d = this.data![++ix] as StoreLocation
            }
            this.store.push({
               id: this.packBinId(0,0),
               count: topCount,
               isDouble: false,
               isRow: true
            })

            for(let y=1; y<=15; y++) {
               for(let x=1; x<=6; x++) {
                  if (d && (y == d.binY) && (x == d.binX)) {
                     this.store.push({
                        id: this.packBinId(x,y),
                        count: d.binCount,
                        isRow: false, //y === 0 || y === 16,
                        isDouble: false //y === 16
                     })
                     d = this.data![++ix] as StoreLocation
                  } else {
                     this.store.push({
                        id: this.packBinId(x,y),
                        count: 0, 
                        isRow: false, // y === 0 || y === 16,
                        isDouble: false //y === 16
                     })
                  }
               }
            }

            // bottom as single bin
            let bottomCount = 0
            while (d && d.binY == 16) {
               bottomCount += d.binCount
               d = this.data![++ix] as StoreLocation
            }
            this.store.push({
               id: this.packBinId(0,16),
               count: bottomCount,
               isDouble: true,
               isRow: true
            })

         },

      }
   })
 </script>

 <style scoped>
   .bin {
      cursor: pointer;
   }
   .h1 {
      height: 2rem;
      line-height: 2rem;
   } 
   .h2 {
      height: 4rem;
      line-height: 4rem;
   }
   .grid {
      display: grid;
   }
   .grid-cols-6 {
      grid-template-columns: repeat(6, minmax(0, 1fr));
   } 
   .col-span-3 {
      grid-column: span 3 / span 3;
   }
   .col-span-6 {
      grid-column: span 6 / span 6;
   }
   .row-span-2 {
      grid-row: span 2 / span 2;
   }
   .gap-1 {
      gap: 0.25rem;
   } 
   .border-4 {
      border-width: 4px;
   } 
   .text-center {
      text-align: center;
   }
   .box-content {
      box-sizing: content-box;
   }
</style>