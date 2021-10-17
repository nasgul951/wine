<template>
  <div>
    <h1 class="font-title">Wine List</h1>
    <table>
      <thead>
        <tr>
          <th>Variatal</th>
          <th>Vineyard</th>
          <th>Label</th>
          <th>Vintage</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="wine in wines" 
          v-bind:key="wine.id" 
        >
          <td>{{wine.varietal}}</td>
          <td>{{wine.vineyard}}</td>
          <td>{{wine.label}}</td>
          <td>{{wine.vintage}}</td>
          <td>{{wine.count}}</td>
        </tr>
      </tbody>
    </table>
  </div>  
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  async asyncData ({$axios, $config, error}) {
    const url = `${$config.apiBaseUrl}/wine/`
    try {
      const response = await $axios.get(url, {
        headers: {
          'x-api-key': $config.apiKey
        }
      });
      if (response && response.data) {
        return {
          wines: response.data.data
        }
      } else {
        throw { statusCode: 500, message: 'Data Error!'}
      }
    } catch (ex) {
      error(ex)
    }
  }
})
</script>
