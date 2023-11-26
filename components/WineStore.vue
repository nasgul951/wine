<template>
    <v-navigation-drawer
      :value="value"
      right
      width="350"
      app
      temporary
      touchless
      style="z-index: 2000"
      @input="(val) => $emit('input', val)"
   >
    <v-card elevation="0">
      <v-card-title>Layout</v-card-title>
      <v-card-text>
         <div 
            class="w-80 grid grid-cols-6 gap-1 border-4 bg-gray-800 border-gray-800 text-center" 
            v-if="loaded"
         >
            <div class="h-12 text-white flex items-center justify-center box-content"
               v-for="bin in store" 
               v-bind:key="bin.id"
               @click="getBinList(bin.id)"
               :class="[bin.isDouble ? 'col-span-3 row-span-2 h-24 pb-1' : '', {'bg-gray-500': bin.count != 0}]"
            >
               <div v-if="bin.count != 0">{{bin.count}}</div>
            </div>  
            <!-- <div class="absolute top-0 left-0" v-if="showBinContent">
               <div class="flex bg-gray-300 p-2">
                  <div class="flex-grow">Bin ({{selectedBin.x}}, {{selectedBin.y}}) Contents</div>
                  <div class=cursor-pointer" @click="closeBin()">X</div>
               </div>
               <div class="flex flex-wrap bg-gray-500">
                  <div class="w-28.p-2"> 
                     <div>Varietal:</div>
                  </div>
                  <div class="w-28 p-2"> 
                     <div>Vintage:</div>
                  </div>
                  <div class="w-28 p-2"> 
                     <div>Vineyard:</div>
                  </div>
                  <div class="w-28 p-2"> 
                     <div>Label:</div>
                  </div>
                  <div class="w-28 p-2"> 
                     <div>Depth:</div>
                  </div>
               </div>
               <div class="flex flex-wrap odd:bg-gray-300 even:bg-white"
                  v-if="showBinContent"
                  
                  v-bind:key="w.bottleid"
               >
                  <div class="w-28 p-2"> 
                     <div>{{w.varietal}}</div>
                  </div>
                  <div class="w-28 p-2"> 
                     <div>{{w.vintage}}</div>
                  </div>
                  <div class="w-28 p-2"> 
                     <div>{{w.vineyard}}</div>
                  </div>
                  <div class="w-28 p-2"> 
                     <div>{{w.label}}</div>
                  </div>
                  <div class="w-28 p-2"> 
                     <div>{{w.depth}}</div>
                  </div>
               </div>
            </div> -->
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
   }

   export default Vue.extend({
      props: {
         value: {
            type: Boolean,
            default: false
         },
         storeId: {
            type: Number,
            default: 1,
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
               this.getStore()
            }
         }
      },
      methods: {
         closeDrawer () {
            this.$emit('input', false)
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
            return 1000 + (x*100) + y;
         },
         unpackBinId(binId: number): IBin {
            return {
               x: Math.floor((binId % 1000) / 100),
               y: (binId % 1000) % 100,
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
            let d = this.data![ix] as any
            const sr = new Array<string>()
            // first row is special (6 wide)
            for (let x=1; x<=6; x++) {
               if ((y == d.binY) && (x == d.binX)) {
                  this.store.push(
                     {
                        id: this.packBinId(x,y),
                        count: d.binCount,
                        isDouble: false
                     }
                  )
                  d = this.data![++ix] as any
               } else {
                  this.store.push({
                     id: this.packBinId(x,y),
                     count: 0, 
                     isDouble: false
                  })
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
                        id: this.packBinId(x,y),
                        count: d.binCount,
                        isDouble: (x > 3)
                     })
                     d = this.data![++ix] as any
                  } else {
                     this.store.push({
                        id: this.packBinId(x,y),
                        count: 0, 
                        isDouble: (x > 3)
                     })
                  }
               }
            }
         },

      }
   })
 </script>