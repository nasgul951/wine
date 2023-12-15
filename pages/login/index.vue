<template>
<v-container>
  <v-row>
    <v-col cols="1" md="4">
      &nbsp;
    </v-col>
    <v-col cols="10" md="4">
      <v-card class="pa-5" elevation="10" rounded>
        <div>
          <v-text-field 
            label="User"
            v-model="login.username" />
        </div>
        <div>
          <v-text-field
            label="Password" 
            type="password" 
            v-model="login.password" />
        </div>
        <v-alert
          v-if="isFailure"
          color="red" 
        >
          Invalid username/password
        </v-alert>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            @click="userLogin" 
          >Submit</v-btn>
        </v-card-actions>

      </v-card>
    </v-col>
    <v-col cols="1" md="4">
      &nbsp;      
    </v-col>
  </v-row>
</v-container>
</template>

<script>
export default {
  auth: 'guest',
  data() {
    return {
      login: {
        username: '',
        password: ''
      },
      isFailure: false
    }
  },
  mounted () {
    if (this.$auth.loggedIn)
      this.$router.push('/')
  },
  methods: {
    async userLogin() {
      try {
        console.log('loggin in...')
        const result = await this.$auth.loginWith('local', { data: this.login })
        console.log(`logged in: ${this.$auth.loggedIn}`)
        this.$router.push('/')
      } catch (err) {
         this.isFailure = true
        console.log(err)
      }
    }
  }
}
</script>