<template>
<v-container>
    <div>
        <v-carousel v-model="model" class="carosello">
            <v-carousel-item
            v-for="(result, i) in asset_results_links"
            :key="result"
            :src="result.icon"
            router :to="{name: result.route}"
            >
      <v-sheet
        
        tile
      >
        <v-row
          align="center"
          justify="center"
        >
          <div class="title">
                <p>
                    {{ asset_results_links[i].text }}
                    </p>
          </div>
        </v-row>
      </v-sheet>
    </v-carousel-item>
    </v-carousel>
    </div>
    </v-container>
</template>

<script>

export default {
    name: 'Carosello-item',
    data: () => ({
      model: 0,
      colors: [
        'primary',
        'secondary',
        'yellow darken-2',
        'red',
        'orange',
      ],
      asset_results_links:[
                {icon: require("../assets/MatchAssociati.png"), text: 'Match associati automaticamente', route: 'matchassociated'},
                {icon: require("../assets/MatchDaAssociare.png"), text: 'Match da associare manualmente', route: 'manualmatch'},
                {icon: require("../assets/MatchConfermati.png"), text: 'Match associati complessivi', route: 'closedmatch'},
                {icon: require("../assets/DocumentiSenzaCorrispondenza.png"), text: 'Documenti senza corrispondenza', route: 'unmatcheddocuments'},
               // {icon: require("../assets/DocumentiDaVerificare.png"), text: 'Documenti da verificare', route: ''},
            ],
    }),
  }
</script>
<style >
.imgStyle{
    width:550px;
    margin: 70px;
}
.carosello .v-image__image--cover{
    background-size: 60%;
}
.title{
    padding-top:70px;
}
.title p{
    font-size: larger;
}
.theme--light.v-sheet{
    background-color: transparent;
}
.carosello{
    background-color: rgba(0, 0, 0, 0.101);
   height:440px;
}
</style>