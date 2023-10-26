<template>
<div>
    <div class="topnav" id="myTopnav">
      <a href="/home" title="Home v0.3.4">
        <img class="logoStyle" src="../assets/Logo_Loro-Piana.png">
      </a>
      <a href="javascript:void(0);"  class="icon" v-on:click="myFunction()">&#9776;</a>

      <v-btn class="menulink"
          v-for="item in menu"
          :key="item.icon"
          :to="{name: item.route}"
          text
          :title="item.title"
        ><p class="menunameStyle" >{{ item.title }} </p>
        </v-btn>
        <v-btn class="menulink"
          text
          title="Run Matcher"
          v-on:click="runMatcher"
        ><p class="menunameStyle" >Run Matcher </p>
        </v-btn>

      <button style=" margin: 10px 10px 5px 0px; float:right" class="flexcol" v-on:click="logOut()">
        <v-icon size="20">mdi-logout</v-icon> 
        <p style="margin-bottom: 0px !important; font-size: 10px">Logout</p>
      </button>
      <div style=" margin: 10px 10px 5px 0px; float:right" class="flexcol">
        <v-icon size="35">mdi-account-circle</v-icon>
        <span> {{this.$store.getters["auth/StateUser"]}} </span>
      </div>
    </div>
    <v-breadcrumbs :items="$route.meta.items" class="breadcrumbs" divider="|" style=""></v-breadcrumbs>
    </div>
</template>
<script>


export default ({
    name: 'Topbar-item',
 data () {
    return {
      menu: [
        { title: 'Match Associati', route: "matchassociated" },
//        { title: 'Match Manuali', route: "manualmatch"},
        { title: 'Match Wizard', route: "wizard"},
        { title: 'Match Chiusi', route: "closedmatch" },
        { title: 'View Partite', route: "viewpartite" },
        { title: 'Doc Check', route: "unmatcheddocuments" },
        { title: 'Statistics', route: "biview" },
      ]
    }
 },
      methods: {
    menuItems () {
      return this.menu
    },
    myFunction() {
      var x = document.getElementById("myTopnav");
      if (x.className === "topnav") {
        x.className += " responsive";
      } else {
        x.className = "topnav"; }
    },
    async runMatcher() {
        console.log("RunMatcher");
        try {
          this.$store.dispatch('match/RunMatcher');
        } catch (error) {
          await this.$store.commit("auth/setIsLoading", false, { root: true });
          console.log(error);
        }

    },
    logOut(){
      try {
          console.log("Calling logout");
          this.$store.dispatch('auth/LogOut');
          console.log("Logged out"); 
          console.log("logged out ok, pushing to login view ");
          this.$router.push({name: "login"});

          this.showError = false
      } catch (error) {
         console.log(error);
      }
    }
  }
})
</script>

<style scoped>
.breadcrumbs{
  margin-top:60px;
}
@media screen and (max-width: 920px) {
  .topnav a:not(:first-child){
    display: none !important;
  }
  .topnav a.icon {
    float: left !important;
    display: block !important;
  }
}

@media screen and (max-width: 920px) {
  
  .topnav.responsive {position: relative;}
  .topnav.responsive .icon {
    position: absolute !important;
    right: 0;
    top: 0;
  }
  .topnav.responsive a {
    float: none !important;
    display: block !important;
    text-align: left !important;
  }
  
}
.topnav .icon {
  display: none;
  float: left;
  font-size:25px;
  margin: 10px 20px;
  color: black;
}
.topnav{
  overflow: hidden;
  background-color: white;
  padding: 1px;
  margin-bottom: 5px;
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
  position: fixed ;
  top: 0;
  width: 100%;
  z-index: 2;
  
}

.logoStyle{
  max-height: 50px;
  padding-top:2px;
}
.topnav a {
  float: left;
  display: block;
  text-align: center;
  text-decoration: none;
  font-size: 14px;
  padding: 1px;
  margin: auto;
}
.menulink{
  box-shadow: none;
  padding-top:20px !important;
  padding-bottom:20px !important;
  height: 100% !important;
  margin-left: 5px !important;
}
.menuVoiceStyle{
  background-color: transparent !important;
  box-shadow: none;
}
.menunameStyle{
  vertical-align: middle;
  margin:auto;
  text-transform: capitalize;
  /*font-family: "'EB Garamond SC',ebGaramond12SC_WGDI,'Times New Roman',serif";*/
}


.hidden-sm-and-down{
  height: 45px;
}
.fixed-bar{
  height:53px !important;
}
.imgStyle{
  width: 100%;
  height: 50px;
  padding-top:2px;
}
.flexcol .v-btn__content{
    flex-direction:column;
}

.v-breadcrumb:before {
    color: #00ff00;
}
.v-breadcrumb li, .breadcrumb:last-child {
   color: #00ff00;
}

</style>
