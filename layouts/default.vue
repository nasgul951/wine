<template>
   <v-app>
      <v-app-bar
         color="deep-purple accent-4"
      >
         <v-toolbar-title>Wine List</v-toolbar-title>
         <v-spacer></v-spacer>
         <v-btn
            icon
            @click="showWineDetail = true"
         >
            <v-icon>mdi-plus</v-icon>
         </v-btn>
         <v-btn
            icon
            @click="showStoreLayout = true"
         >
            <v-icon>mdi-grid</v-icon>
         </v-btn>
      </v-app-bar>
      <v-main>
      <Nuxt />
      <wine-store
         v-model="showStoreLayout"
         @selected="selectWine"
      />
      <wine-detail 
         v-model="showWineDetail" 
         :wineid="selectedWineId" 
         @updated="getWine()"
      />
      </v-main>
   </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
   data () {
      return {
         selectedWineId: null as number | null,
         showWineDetail: false,
         showStoreLayout: false
      }
   },
   watch: {
      showWineDetail(newVal, oldVal) {
         if (oldVal && !newVal)
            this.selectedWineId = null
      }
   },
   methods: {
      selectWine (id: number) {
         this.selectedWineId = id
         this.showWineDetail = true
      }
   }
})
</script>
