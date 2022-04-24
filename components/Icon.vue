<template>
<div>
   <svg v-if="type='chevron'" 
      viewBox="0 0 512 512" 
      xmlns="http://www.w3.org/2000/svg">
   <polyline points="112 328 256 184 400 328" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"/>
   </svg>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
   name: 'Icon',
   props: {
      type: {
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
