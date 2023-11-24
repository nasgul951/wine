<template>
  <div>
   <v-app-bar
      color="orange"
   >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Wine List</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu
         bottom
         left-0
      >
         <template v-slot:activator="{ on, attrs }">
            <v-btn
               icon
               color="yellow"
               v-bind="attrs"
               v-on="on"
            >
               <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
         </template>

         <v-list>
            <v-list-item>
               <v-list-item-title>Click Me 1</v-list-item-title>
          </v-list-item>
         </v-list>      
      </v-menu>
   </v-app-bar>

   <v-data-table
      :headers="headers"
      :items="wines"
      :loading="loading"
      show-group-by
      items-per-page="50"
   >
      <template #[`item.detail`]="{item}">
         <v-btn
            icon
            color="yellow"
            @click="selectedWine=item"
         >
            <v-icon>mdi-dots-horizontal</v-icon>
         </v-btn>
      </template>
   </v-data-table>

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
import Icon from '~/components/Icon.vue';

export default Vue.extend({
   components: { ItemPicker, WineDetail, AddWine, Icon },
   async asyncData ({$axios, $config, error}) {
      const url = `${$config.apiBaseUrl}/wine/`
      try {
         const response = await $axios.get(url);
         if (response && response.data && response.data.data) {
            return {
               wines: response.data.data
            }
         } else {
            throw { statusCode: 500, message: 'Failed to fetch wine data!'}
         }
      } catch (ex: any) {
         error(ex)
      }
   },
   data () {
      return {
         filterBy: '',
         filterValue: '',
         sortField: '',
         sortDir: 'asc',
         loading: false,
         wines: [],
         selectedWine: null,
         varietals: [],
         status: '',
         menuItems: [
            { name: 'Add Wine' },
            { name: 'Pick Varietal'}
         ],
         headers: [
            {
               text: 'Varital',
               value: 'varietal',
            },
            {
               text: 'Vineyard',
               value: 'vineyard'
            },
            {
               text: 'Label',
               value: 'label',
               groupable: false
            },
            {
               text: 'Vintage',
               value: 'vintage',
               align: 'left',
               groupable: false
            },
            {
               text: 'Count',
               value: 'count',
               align: 'left',
               groupable: false
            },
            {
               text: '',
               value: 'detail',
               sortable: false,
               groupable: false
            }
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
         this.loading = true
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
         this.loading = false
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