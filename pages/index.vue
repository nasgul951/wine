<template>
  <div>
    <h1 class="text-lg">Wine List <span v-if="filter !== ''">({{filter}})</span></h1>
    <table class="min-w-full border-collapse block md:table">
        <thead class="block md:table-header-group">
          <tr class="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
              <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell"
                v-on:click="showVarietalPicker()"
              >Variatal</th>
              <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell"
              >Vineyard</th>
              <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell"
              >Label</th>
              <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell"
              >Vintage</th>
              <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell"
              >Count</th>
          </tr>
        </thead>
        <tbody class="block md:table-row-group">
          <tr 
            class="odd:bg-gray-300 even:bg-white border border-grey-500 md:border-none block md:table-row"
            v-for="wine in wines" 
            v-bind:key="wine.id"
            v-on:click="selectedWine = wine"
          >
            <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
              <span class="inline-block w-1/3 md:hidden font-bold">Variatal</span>{{wine.varietal}}
            </td>
            <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
              <span class="inline-block w-1/3 md:hidden font-bold">Vineyard</span>{{wine.vineyard}}
            </td>
            <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
              <span class="inline-block w-1/3 md:hidden font-bold">Label</span>{{wine.label}}
            </td>
            <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
              <span class="inline-block w-1/3 md:hidden font-bold">Vintage</span>{{wine.vintage}}
            </td>
            <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
              <span class="inline-block w-1/3 md:hidden font-bold">Count</span>{{wine.count}}
            </td>
          </tr>
        </tbody>
      </table>

      <item-picker v-if="varietals.length > 0" 
         :items="varietals" 
         valueKey="varietal" 
         @selectItem="selectVarietal"
      >
         <template v-slot:default="p">
            <div class="flex-grow">{{p.item.varietal}}</div>
            <div>{{p.item.count}}</div>
         </template>
      </item-picker>

      <wine-detail v-if="selectedWine" :wine="selectedWine" @close="selectedWine = null"/>
   </div>  
</template>

<script lang="ts">
import Vue from 'vue'
import ItemPicker from '~/components/ItemPicker.vue';
import WineDetail from '~/components/WineDetail.vue';

export default Vue.extend({
   components: { ItemPicker, WineDetail },
   async asyncData ({$axios, $config, error}) {
      const url = `${$config.apiBaseUrl}/wine/`
      try {
         const response = await $axios.get(url, {
         headers: {
            'x-api-key': $config.apiKey
         }
      });
      if (response && response.data && response.data.data) {
         return {
            wines: response.data.data
         }
      } else {
         throw { statusCode: 500, message: 'Data Error!'}
      }
      } catch (ex) {
      error(ex)
      }
   },
   data () {
      return {
      filter: '',
      wines: [],
      selectedWine: null,
      varietals: []
      }
   },
   methods: {
      async showVarietalPicker () {
         const url = `${this.$config.apiBaseUrl}/wine/varietals/`
         const response = await this.$axios.get(url, {
            headers: {
               'x-api-key': this.$config.apiKey
            }
         })
         if (response && response.data && response.data.data) {
            this.varietals = response.data.data
         }
      },
      async selectVarietal (v: any) {
         if (!v) {
            return this.clearFilter()
         }

         this.varietals = []
         const url = `${this.$config.apiBaseUrl}/wine/?varietal=${v.varietal}`
         const response = await this.$axios.get(url, {
            headers: {
               'x-api-key': this.$config.apiKey
            }
         })
         if (response && response.data && response.data.data) {
            this.wines = response.data.data
            this.filter = v.varietal
         }
      },
      async clearFilter () {
         this.varietals = []
         const url = `${this.$config.apiBaseUrl}/wine/`
         const response = await this.$axios.get(url, {
            headers: {
               'x-api-key': this.$config.apiKey
            }
         })
         if (response && response.data && response.data.data) {
         this.wines = response.data.data
         this.filter = ''
         }

      }
   }
})
</script>

<style scoped>
</style>