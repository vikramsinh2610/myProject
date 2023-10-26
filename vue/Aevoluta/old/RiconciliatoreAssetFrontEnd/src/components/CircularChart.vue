<template>
    <div class="text-center" style="height:100%">
        <v-btn class="btnSyle" @click.prevent="caricaMatch(0)" >
          <v-col>
            <v-progress-circular
            :rotate="-90"
            :size="140"
            :width="15"
            :value="80"
            color="#00d640"
            >
               <p class="pStyle" >{{ match90 }}  </p> 
            </v-progress-circular>
            <p style="color:forestgreen"> Score: > 60 </p>
            </v-col>
        </v-btn>
        <v-btn class="btnSyle" @click.prevent="caricaMatch(1)">
           <v-col>
           <v-progress-circular
            :rotate="-90"
            :size="140"
            :width="15"
            :value="60"
            color="amber darken-4"
            >
            <p class="pStyle">{{ match60 }}  </p> 
            </v-progress-circular>
            <p style="color:#FF6F00"> Score: &lt;=60 e >40 </p>
            </v-col>
        </v-btn>

        <v-btn class="btnSyle" @click.prevent="caricaMatch(2)">
           <v-col>
            <v-progress-circular
            :rotate="-90"
            :size="140"
            :width="15"
            :value="40"
            color="#ff0000"
            >
           <p class="pStyle">{{ match40}}  </p> 
            </v-progress-circular>
            <p style="color:#ff0000"> Score: &lt;= 40</p>
            </v-col>
        </v-btn>

        <v-btn class="btnSyle" @click.prevent="caricaMatch(3)">
           <v-col>
            <v-progress-circular
            :rotate="-90"
            :size="140"
            :width="15"
            :value="360"
            color="blue"
            >
           <p class="pStyle">{{ match40 + match60 + match90}}  </p> 
            </v-progress-circular>
            <p style="color:#ff0000"> Ricerca libera su tutti i match</p>
            </v-col>
        </v-btn>
  </div>
    
</template>

<script>
export default {
  
    data () {
      return {
        disable40:false,
        disable60:false,
        disable90:false,
        interval: {},
        value: 0,
        match40: 0,
        match60: 0,
        match90: 0,
        
      }
    },
    
    beforeDestroy () {
      clearInterval(this.interval)
    },
    created(){
    },

    async mounted () {
      await this.$store.dispatch('match/LoadMatchesByConfidence');
      console.log("loaded matches by confidence");
      console.log(this.$store.getters["match/getMatchesByConfidence"].high_conficende);
      console.log("confidence: " + this.$store.getters["match/getMatchesByConfidence"].low_confidence 
      + " " + this.$store.getters["match/getMatchesByConfidence"].medium_confidence
      + " " + this.$store.getters["match/getMatchesByConfidence"].high_confidence
      )
      this.match40=this.$store.getters["match/getMatchesByConfidence"].low_confidence;
      this.match60=this.$store.getters["match/getMatchesByConfidence"].medium_confidence;
      this.match90=this.$store.getters["match/getMatchesByConfidence"].high_confidence;
      
      this.interval = setInterval(() => {
        if (this.value === 100) {
          return (this.value = 0)
        }
        this.value += 10
      }, 1000)
      

    },
    methods:{
      count40(){
        console.log("prova")
        var i=0
        for(const match of this.matches){
          console.log(match)
          if(this.matches[match].grado <= 40)
          i++
        }
         this.match40 = i
         if(this.match40==0){
           this.disable40==true
         }
      },
      count60(){
        console.log("prova")
        var i=0
        for(const match of this.matches){
          console.log(match)
          if(this.matches[match].grado <= 60 && this.matches[match].grado > 40)
          i++
        }
         this.match60 = i
         if(this.match60==0){
           this.disable60==true
         }
      },
      count90(){
        console.log("prova")
        var i=0
        for(const match of this.matches){
          console.log(match)
          if(this.matches[match].grado >= 60)
          i++
        }
         this.match90 = i
         if(this.match90==0){
           this.disable90==true
         }
      },
      async caricaMatch(tipo){
            console.log("tipo: " + tipo);
            let min=0;
            let max=100;
           // loading data
           switch (tipo) {
            case 3:
              min=0
              max=100
              break;
            case 2:
              min=0
              max=40
              break;
            case 1:
              min=40
              max=60
              break;
            case 0:
              min=60
              max=100
          }
          this.$store.commit('match/setFiltroMARagioneSociale', "")
          this.$store.commit('match/setFiltroMAValuta', "")
          if(tipo === 3) {
            this.$store.commit('match/setMatches', null)
            this.$store.commit('match/setIsRicercaOn', true)
            this.$router.push({name: "matchassociated1", params: {numMatch: 0}});
          } else {
            let params = new URLSearchParams();
            params.append('minscoring', min);
            params.append('maxscoring', max);
            this.$store.commit('match/setIsRicercaOn', false)
            await this.$store.dispatch("match/LoadMatches", {params: params, soloAperti:true});
            this.$router.push({name: "matchassociated1", params: {numMatch: 10, ricercaOn: false}});
          }
      }
    }
    
  }

</script>
<style scoped>
.v-progress-circular {
  margin: 1rem;
}
.btnSyle{
    background-color: transparent !important;
    height:auto !important;
    margin: 15px 35px;
    font-size: 18px;
}
.pStyle{
    color:black;
    margin:0;
    font-size: 25px;
}
</style>