<template>
  <div class="loginView" >
    
    <div class="center">
      
      <img style="margin:auto; width: 90%" src="../assets/Logo_Loro-Piana.png">
      <p style="text-align:center; margin-top:20px; font-style: italic; font-size:14px">LOGIN</p>
      <form @submit.prevent="submit">
        <div style="text-align:center">
          <div style="text-align:center">
            <v-icon class="icoStyle">mdi-account</v-icon>
          <label style="font-size:18px" for="username">Username:</label>
          </div>
          
          <input  class="input" value="prova" type="text" name="username" v-model="form.username" />
        </div>
        <div style="text-align:center">
          <div style="text-align:center">
            <v-icon class="icoStyle">mdi-lock</v-icon>
          <label style="font-size:18px" for="password">Password:</label>
          </div>
          <input class="input" type="password" name="password" v-model="form.password" />
        </div>
        <div style="text-align:center; margin-top:20px">
          <button class="btnSubmitStyle" type="submit">Submit</button>
        </div>
        
      </form>
      <p v-if="showError" id="error">Username or Password is incorrect</p>
    </div>
  </div>
</template>

<script>

export default {
  name: "LoginView",
  components: {},
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      showError: false
    };
  },      
  mounted() {
        this.$store.commit('auth/setIsLoading', false);
  },
  methods: {
    async submit() {
      const User = new FormData();
      User.append("username", this.form.username);
      User.append("password", this.form.password);
      try {
          console.log("Calling login");
          await this.$store.dispatch('auth/LogIn', User);
          console.log("Logged in");
          await this.$store.dispatch('match/LoadConfiguration');
          console.log("Config Loaded");
          await this.$store.dispatch("match/LoadStakeholders");
          console.log("Stakeholders Loaded");
          const myRoute = this.$store.getters["auth/getRequestedPage"]; 
          console.log("logged in ok, pushing: " + myRoute  + " ok?");
          this.$router.push({name: "home"});

          this.showError = false
      } catch (error) {
        console.log("there was an error");
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.icoStyle{
  margin:10px;
  padding-bottom:8px;
}

.input{
  margin-left:0px;
  padding-left:0px;
  color: rgb(0, 0, 0);
  border-radius: 3px;
  width: 100%;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.152);
}
* {
  box-sizing: border-box;
}
label {
  padding: 12px 12px 12px 0;
  display: inline-block;
}
button[type=submit] {
  background-color: #9D502F;
  color: white;
  padding: 12px 20px;
  cursor: pointer;
  border-radius:3px;
  width:100%;
  text-align: center;
  
}
button[type=submit]:hover {
  background-color: #ce5a29;
}
input {
  margin: 5px;
  box-shadow:0 0 15px 4px rgba(0,0,0,0.06);
  padding:10px;
  border-radius:30px;
}
#error {
  color: red;
}


.center {
  margin-left: auto;
  margin-right: auto;
  width: 40%;
  margin-top: 30px;
}
</style>

