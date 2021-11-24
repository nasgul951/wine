<template lang="pug">
   div(class="fixed top-0 right-0 w-full h-full bg-gray-500 bg-opacity-70")
      div.flex.h-full.items-center.justify-center
         div(class="md:w-80 w-full max-h-full border-2 bg-white")
            h3(class="p-3 bg-gray-500 font-semibold text-white") Varietals
            ul(class="h-full overflow-y-scroll")
               li(v-on:click="$emit('selectItem', null)" class="p-3 cursor-pointer") All
               li(v-for="item in items" v-bind:key="item[valueKey]"
                  class="flex p-3 cursor-pointer"
                  v-on:click="$emit('selectItem', item)"
               )
                  slot(v-bind:item="item")
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
   name: 'ItemPicker',
   props: {
      items: {
         type: Array,
         required: true
      },
      valueKey: {
         type: String,
         required: true
      }
   },
   data () {
      return {

      }
   }
})
</script>