<template>
  <div class="text-center">
    <v-menu >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          block
          v-bind="attrs"
          v-on="on"
        >
          Extra Info
        </v-btn>
      </template>
          <v-card
            class="mx-auto"
            max-width="600"
            @click.stop=""
            :ripple="false"
          >
          <v-card-text>
            <p class="text-h8 text--primary">
              <b>Note:</b> {{params.note}}
              <br>
              <b>Conto:</b> {{params.conto}}
              <br>
              <b>Tipo:</b> {{params.tipo}}
              <br>
              <b>ID Movimento:</b> {{params.idmovimento}}
              <br>
              <b>ID Dettaglio Movimento:</b> {{params.idmovimentodettaglio}}
              <br>
              <b>ID Documento:</b> {{params.iddocumento}}
              <br>
              <b>Visualizza Documento</b>
                    <v-btn style=" margin: 0px 5px 0px 5px;" icon class="flexcol" @click="openDoc(params.iddocumento)">
                    <v-icon size="20">mdi-open-in-new</v-icon>
                    </v-btn>
              <br>
              <b v-if="params.movimento.is_sottomovimento_con_supermovimento_aggregato"> Visualizza Macromovimento Aggregato:</b>
              <v-btn v-if="params.movimento.is_sottomovimento_con_supermovimento_aggregato" style=" margin: 0px 5px 0px 5px;" icon class="flexcol" @click="openMov(params.movimento)">
              <v-icon size="20">mdi-open-in-new</v-icon>
              </v-btn>
            </p>
          </v-card-text>
        </v-card>
      </v-menu>
  </div>
</template>


<script>
import EventBus, { ACTIONS } from '../Helpers/EventBus.js';

  export default {
    data () {
      return {
        dialog: false,
      }
    },
    props:{
      information: String,
    },
    methods:{
        openDoc(iddoc) {
          console.log("emit opendoc")
          EventBus.$emit(ACTIONS.OPEN_DOC, iddoc);
        },
        openMov(movimento) {
          console.log("emit openMov" + movimento)
          EventBus.$emit(ACTIONS.OPEN_MOV, movimento);
        },
    },

  }
</script>
