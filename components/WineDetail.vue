<template>
   <v-dialog
      :value="value"
      transition="dialog-bottom-transition"
      max-width="600"
      @input="(val) => $emit('input', val)"
   >
      <v-card> 
         <v-toolbar color="primary">
            <v-card-title>
               <span v-if="!wineid">Add Wine</span>
               <span v-else>Wine Detail</span>
            </v-card-title>
            <v-spacer />
            <v-btn icon @click="close">
               <v-icon>mdi-close</v-icon>
            </v-btn>
         </v-toolbar>
         <v-container>
            <v-row>
               <v-col cols="6">
                  <v-text-field 
                     dense 
                     outlined 
                     label="Vineyard" 
                     v-model="wine.vineyard" 
                     @change="patchWine('vineyard')"
                  />
               </v-col>
               <v-col cols="6">
                  <v-text-field 
                     dense 
                     outlined 
                     label="Label" 
                     v-model="wine.label" 
                     @change="patchWine('label')"
                  />
               </v-col>
            </v-row>
            <v-row>
               <v-col cols="6">
                  <v-text-field 
                     dense 
                     outlined 
                     label="Varietal" 
                     v-model="wine.varietal" 
                     @change="patchWine('varietal')"
                  />
               </v-col>
               <v-col cols="6">
                  <v-text-field 
                     dense 
                     outlined 
                     label="Vintage" 
                     v-model="wine.vintage" 
                     @change="patchWine('vintage')"
                  />
               </v-col>
            </v-row>
            <v-row>
               <v-col cols="12">
                  <v-textarea 
                     outlined 
                     dense 
                     label="Notes" 
                     v-model="wine.notes" 
                     @change="patchWine('notes')"
                  />
               </v-col>
            </v-row>
            <v-card-actions>
               <v-spacer />
                  <v-btn
                     color="primary" 
                     v-if="!wine.id" 
                     @click="addWine()"
                  >Add Wine</v-btn>
            </v-card-actions>
            <v-divider />
            <v-data-table
               :items="bottles"
               :headers="bottleHeaders"
            >
               <template #[`item.binX`]="{item}">
                  <v-text-field 
                     v-model="item.binX"
                     @change="patchBottle({id: item.id, binX: item.binX})" 
                  />
               </template>
               <template #[`item.binY`]="{item}">
                  <v-text-field 
                     v-model="item.binY"
                     @change="patchBottle({id: item.id, binY: item.binY})" 
                  />
               </template>
               <template #[`item.depth`]="{item}">
                  <v-text-field 
                     v-model="item.depth"
                     @change="patchBottle({id: item.id, depth: item.depth})" 
                  />
               </template>
               <template #[`item.action`]="{item}">
                  <v-btn
                     icon
                     @click="patchBottle({id: item.id, consumed: true})"
                  >
                     <v-icon>mdi-close-octagon-outline</v-icon>
                  </v-btn>
               </template>

               <template #body.append>
                  <tr v-if="wine.id">
                     <td>
                        <v-text-field 
                           v-model="bottle.binX"
                        />
                     </td>
                     <td>
                        <v-text-field 
                           v-model="bottle.binY"
                        />
                     </td>
                     <td>
                        <v-text-field 
                           v-model="bottle.depth"
                        />
                     </td>
                     <td>
                        <v-btn
                           icon
                           @click="addBottle()"
                        >
                           <v-icon>mdi-plus</v-icon>
                        </v-btn>
                     </td>
                  </tr>
               </template>
            </v-data-table>
         </v-container>
      </v-card>
   </v-dialog>
            <!-- //- div.flex.flex-col(v-if="wine.id")
            //-    h3.flex-grow.p-2.bg-gray-500.font-semibold.text-white Bottles
            //-    div.flex.flex-wrap
            //-       div.w-28.p-2 
            //-          div BinX:
            //-       div.w-28.p-2 
            //-          div BinY:
            //-       div.w-28.p-2 
            //-          div Depth:
            //-    div.flex.flex-wrap(v-for="b in bottles" v-bind:key="b.id")
            //-       div.w-28.p-2 
            //-          v-text-field(dense v-model="b.binX" @change="patchBottle({id: b.id, binX: b.binX})")
            //-       div.w-28.p-2 
            //-          v-text-field(dense v-model="b.binY" @change="patchBottle({id: b.id, binY: b.binY})")
            //-       div.w-28.p-2 
            //-          v-text-field(dense v-model="b.depth" @change="patchBottle({id: b.id, depth: b.depth})")
            //-       div.w-7.p-2 
            //-          button(
            //-             class="px-3 bg-blue-400 rounded-lg font-extrabold text-white"
            //-             @click="patchBottle({id: b.id, consumed: true})"   
            //-          ) -
            //-    div.flex.flex-wrap
            //-       div.w-28.p-2 
            //-          v-text-field(dense  v-model="bottle.binX")
            //-       div.w-28.p-2 
            //-          v-text-field(dense v-model="bottle.binY")
            //-       div.w-28.p-2 
            //-          v-text-field(dense v-model="bottle.depth")
            //-       div.w-7.p-2 
            //-          button(
            //-             class="px-3 bg-blue-400 rounded-lg font-extrabold text-white"
            //-             @click="addBottle"   
            //-          ) + -->
</template>

<script lang="ts">
import Vue from 'vue'
import { Wine, Bottle } from '~/lib/Wine'

export default Vue.extend({
   props: {
      value: {
         type: Boolean,
         default: false
      },
      wineid: {
         type: Number,
         default: null,
      },
      storeId: {
         type: Number,
         default: 5
      }
   },
   data () {
      return {
         wine: {
            vineyard: '',
            label: '',
            varietal: '',
         } as Wine,
         bottle: {
         } as Bottle,
         bottles: [] as Bottle[],
         bottleHeaders: [
            {
               text: 'Bin X',
               value: 'binX',
            },
            {
               text: 'Bin Y',
               value: 'binY'
            },
            {
               text: 'Depth',
               value: 'depth'
            },
            {
               value: 'action'
            }
         ],
         updated: false
      }
   },
   watch: {
      value (newVal, oldVal) {
         if (!newVal && oldVal && this.updated) {
            this.$emit('updated', this.wineid)
            this.updated = false
         }
      },
      wineid (newVal) {
         this.getWine()
      }
   },
   methods: {
      close () {
         this.$emit('input', false)
      },
      async addWine () {
         const result = await this.$api.wine.put(this.wine)
         if (result.success) {
            this.wine = result.data
            this.getBottles()
         } else {
            alert('Failed to add wine')
         }
      },
      async getWine () {
         const result = await this.$api.wine.get(this.wineid)
         if (result.success) {
            this.wine = result.data
            this.getBottles()
         } else {
            alert('Failed to get wine detail')
         }
      },
      async patchWine (f: string) {
         if (!this.wine.id)
            return; // nothing to patch

         const b = {
            id: this.wine.id,
            [f]: (this.wine as any)[f]
         }
         const url = `${this.$config.apiBaseUrl}/wine/`
         const response = await this.$axios.patch(url, b)
         if (response && response.data && response.data.data) {
            this.wine = response.data.data
            this.updated = true
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
            this.updated = true
         } else {
            alert('Failed to add bottle')
         }
      },
      async patchBottle (b: Bottle) {
         const result = await this.$api.wine.patchBottle(b)
         if (result.success) {
            this.getBottles()
            this.updated = true
         } else {
            alert('Failed to update bottle')
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