<template lang="pug">
div(style="z-index: 1000")
   //- div(class="fixed top-0 right-0 w-full h-full bg-gray-500 bg-opacity-70 z-1")
   div(class="md:w-80 w-full max-h-full border-2 bg-white")
      div.flex.p-3.bg-gray-500.text-white.font-semibold
         h3.flex-grow(class=" text-white") {{this.title}}
         div.cursor-pointer(@click="$emit('close')") x
      ul(class="h-full overflow-y-scroll")
         li(v-if="showAll" v-on:click="$emit('selectItem', null)" class="p-3 cursor-pointer") All
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
      title: {
         type: String,
         required: true
      },
      items: {
         type: Array,
         required: true
      },
      valueKey: {
         type: String,
         required: true
      },
      showAll: {
         type: Boolean,
         default: true
      }
   },
   data () {
      return {

      }
   }
})
</script>