<template>
  <div>
    <div class="relative h-14 w-full bg-gray-300">
      <div class="absolute top-0 left-0">
         <button class="relative group" v-on:click="status = 'menu'">
            <div class="relative flex overflow-hidden items-center justify-center w-14 h-14 bg-gray-400 ring-0 ring-gray-300 hover:ring-8 group-focus:ring-4 ring-opacity-30 shadow-md">
               <div class="flex flex-col justify-between w-5 h-5 transform transition-all duration-300 origin-center overflow-hidden group-focus:-translate-y-1.5 group-focus:-rotate-90">
                  <div class="bg-white h-1 w-7 transform transition-all duration-300 origin-left group-focus:rotate-[42deg] group-focus:w-2/3 delay-150"></div>
                  <div class="bg-white h-1 w-7 rounded transform transition-all duration-300 group-focus:translate-x-10"></div>
                  <div class="bg-white h-1 w-7 transform transition-all duration-300 origin-left group-focus:-rotate-[42deg] group-focus:w-2/3 delay-150"></div>
               </div>
            </div>
         </button>
      </div>

      <h1 class=" absolute top-0 left-14 text-lg font-bold pl-2 pt-3">Wine List <span v-if="filterValue !== ''">({{filterValue}})</span></h1>
      <item-picker v-if="status === 'menu'"
         class="absolute top-1 left-14" 
         title="Menu"
         :items="menuItems" 
         valueKey="name" 
         :showAll="false"
         @selectItem="selectMenuItem"
         @close="status = ''"
      >
         <template v-slot:default="p">
            <div class="flex-grow">{{p.item.name}}</div>
         </template>
      </item-picker>

      <item-picker v-if="varietals.length > 0" 
         class="absolute top-1 left-14" 
         title="Varietals"
         :items="varietals" 
         valueKey="varietal" 
         @selectItem="selectVarietal"
      >
         <template v-slot:default="p">
            <div class="flex-grow">{{p.item.varietal}}</div>
            <div>{{p.item.count}}</div>
         </template>
      </item-picker>

    </div>
    <table class="min-w-full border-collapse block md:table">
        <thead class="block md:table-header-group">
          <tr class="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
              <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell"
               @click="setSortField('varietal')"
              >Variatal
              </th>
              <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell"
               @click="setSortField('vineyard')"
              >Vineyard</th>
              <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell"
               @click="setSortField('label')"
              >Label</th>
              <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell"
               @click="setSortField('vintage')"
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

      <wine-detail 
         v-if="selectedWine" 
         :wineid="selectedWine.id" 
         @close="selectedWine = null"/>
      <add-wine 
         v-if="status === 'addWine'" 
         @close="status = ''"/>
   </div>  
</template>

<script lang="ts">
import Vue from 'vue'
import ItemPicker from '~/components/ItemPicker.vue';
import WineDetail from '~/components/WineDetail.vue';
import AddWine from '~/components/AddWine.vue';

export default Vue.extend({
   components: { ItemPicker, WineDetail, AddWine },
   async asyncData ({$axios, $config, error}) {
      const url = `${$config.apiBaseUrl}/wine/`
      try {
         const response = await $axios.get(url);
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
         filterBy: '',
         filterValue: '',
         sortField: '',
         sortDir: 'asc',
         wines: [],
         selectedWine: null,
         varietals: [],
         status: '',
         menuItems: [
            { name: 'Add Wine' },
            { name: 'Pick Varietal'}
         ]
      }
   },
   methods: {
      async showVarietalPicker () {
         const url = `${this.$config.apiBaseUrl}/wine/varietals/`
         const response = await this.$axios.get(url)
         if (response && response.data && response.data.data) {
            this.varietals = response.data.data
         }
      },
      async getWine () {
         let url = `${this.$config.apiBaseUrl}/wine/`
         if (this.filterBy !== '') {
            url += `?${this.filterBy}=${this.filterValue}`
         }

         if (this.sortField !== '') {
            if (url.endsWith('/'))
               url += '?'
            else
               url += '&'
            url += `sort=${this.sortField}&dir=${this.sortDir}`
         }

         const response = await this.$axios.get(url)
         if (response && response.data && response.data.data) {
            this.wines = response.data.data
         }
      },
      selectMenuItem (i: any) {
         switch (i.name) {
            case 'Add Wine':
               this.status = 'addWine'
               break
            case 'Pick Varietal':
               this.showVarietalPicker()
               this.status = ''
               break
         }

      },
      selectVarietal (v: any) {
        this.varietals = []
        if (v) {
            this.filterBy = 'varietal'
            this.filterValue = v.varietal
         } else {
            this.filterBy = ''
            this.filterValue = ''
         }
         this.getWine()
      },
      setSortField(f: string) {
         if (this.sortField === f) {
            this.sortDir = (this.sortDir === 'asc' ? 'desc' : 'asc')
         } else {
            this.sortField = f
            this.sortDir = 'asc'
         }
         this.getWine()
      }
   }
})
</script>

<style scoped>
</style>