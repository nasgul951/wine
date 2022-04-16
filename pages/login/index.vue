<template>
  <div class="w-full h-screen flex items-center justify-center">
   <div class="bg-gray-300 shadow-md rounded max-w-sm px-8 pt-6 pb-6 mb-4 flex flex-col">
      <form @submit.prevent="userLogin">
         <div>
         <label class="block text-grey-darker text-sm font-bold mb-2">Username</label>
         <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" 
            type="text" 
            v-model="login.username" />
         </div>
         <div>
         <label class="block text-grey-darker text-sm font-bold mb-2">Password</label>
         <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            type="password" 
            v-model="login.password" />
         </div>
         <p v-if="isFailure" class="text-red text-xs italic">Invalid username/password</p>
         <div class="flex items-center justify-end pt-2">
         <button 
         class="bg-blue-600 hover:bg-blue-dark text-white font-bold py-2 px-4 rounded" 
            type="submit">
               Submit
         </button>
         </div>
      </form>
   </div>
  </div>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      login: {
        username: '',
        password: ''
      },
      isFailure: false
    }
  },
  methods: {
    async userLogin() {
      try {
        let response = await this.$auth.loginWith('local', { data: this.login })
        console.log(response)
      } catch (err) {
         this.isFailure = true
        console.log(err)
      }
    }
  }
}
</script>