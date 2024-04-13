<template>
  <div>
      <v-app-bar
         color="deep-purple accent-4"
      >
         <v-toolbar-title>Wine List</v-toolbar-title>
         <v-spacer></v-spacer>
         <v-btn
            icon
            @click=" showWineDetail = true"
         >
            <v-icon>mdi-plus</v-icon>
         </v-btn>
         <v-btn
            icon
            @click=" showStoreLayout = true"
         >
            <v-icon>mdi-grid</v-icon>
         </v-btn>
      </v-app-bar>

      <v-data-table
         :headers="headers"
         :items="wines"
         :loading="loading"
         show-group-by
         :items-per-page="pageSize"
      >
         <template #[`item.detail`]="{item}">
            <v-btn
               icon
               color="yellow"
               @click="selectWine(item.id)"
            >
               <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
         </template>
      </v-data-table>

      <wine-detail 
         v-model="showWineDetail" 
         :wineid="selectedWineId" 
         @updated="getWine()"
      />
      <wine-store
         v-model="showStoreLayout"
         @selected="selectWine"
      />
  </div>  
</template>

<script lang="ts">
import Vue from 'vue'
import ItemPicker from '~/components/ItemPicker.vue';
import WineDetail from '~/components/WineDetail.vue';
import AddWine from '~/components/AddWine.vue';
import Icon from '~/components/Icon.vue';
import WineStore from '~/components/WineStore.vue';
import { Wine } from '~/lib/Wine'
import { numberLiteralTypeAnnotation } from '@babel/types';

export default Vue.extend({
   components: { ItemPicker, WineDetail, AddWine, WineStore, Icon },
   data () {
      return {
         pageSize: 50,
         filterBy: '',
         filterValue: '',
         sortField: '',
         sortDir: 'asc',
         loading: false,
         wines: [] as Wine[],
         selectedWine: null as Wine | null,
         selectedWineId: null as number | null,
         varietals: [],
         showAddWine: false,
         showStoreLayout: false,
         showWineDetail: false,
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
   mounted () {
      this.getWine()
   },
   watch: {
      showWineDetail(newVal, oldVal) {
         if (oldVal && !newVal)
            this.selectedWineId = null
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
         let params = undefined
         if (this.filterBy !== '') {
            if (!params) params = []
            params.push(`${this.filterBy}=${this.filterValue}`)
         }

         if (this.sortField !== '') {
            if (!params) params = []
            params.push(`sort=${this.sortField}`)
            params.push(`dir=${this.sortDir}`)
         }

         const response = await this.$api.wine.getWines(params)
         if (response.success) {
            this.wines = response.data
         }
         this.loading = false
      },
      selectWine (id: number) {
         this.selectedWineId = id
         this.showWineDetail = true
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