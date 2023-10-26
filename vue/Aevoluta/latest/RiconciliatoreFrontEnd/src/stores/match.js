import { defineStore } from "pinia";
import axios from "axios";
import { useUtilsStore } from "@/stores/utils";

export const useMatchStore = defineStore("match", {
  state: () => ({
    risultatoMatch: null,
    partite: null,
    filtroMMPartite: "",
    filtroMMPartiteSapId: "",
    filtroMMPartiteImporto: "",
    filtroMMPartitePartitaID: "",
    movimenti: null,
    filtroMMMovimentiImporto: "",
    filtroMMMovimentiRagioneSociale: "",
    filtroMMMovimentiConto: "",
    filtroMMMovimentiValuta: "",
    stakeholders: null,
    contiDifferenzeIncassiPartite: null,
    matches: null,
    matchesChiusi: null,
    homeReport: null,
    matchesDocumentDaVali: null,
    docimenti: null,
    matchesByConfidence: {
      count: 0,
      relative_low_confidence: 0,
      relative_medium_confidence: 0,
      relative_high_confidence: 0,
      low_confidence: 0,
      medium_confidence: 0,
      high_confidence: 0,
    },
    valute: null,
    valuteOrdinate: null,
    documenti: null,
    tipiDocumento: null,
    filtroMAValuta: null,
    filtroMARagioneSociale: null,
    documentoCorrente: null,
    isSorted: false,
  }),
  getters: {
    getPartite(state) {
      return state.partite;
    },
    // getPartiteFiltrate(state) {
    //   console.log(
    //     "Numero partite da filtrare: " +
    //     Object.keys(state.partite).length +
    //     " con filtro: " +
    //     state.filtroMMPartite +
    //     "," +
    //     state.filtroMMPartiteSapId +
    //     "," +
    //     state.filtroMMPartiteImporto
    //   );

    //   let partiteFiltrate = state.partite.items.filter((partita) => {
    //     let ok = true;
    //     if (
    //       partita.ragionesociale &&
    //       state.filtroMMPartite &&
    //       state.filtroMMPartite.length > 2
    //     ) {
    //       ok =
    //         ok &&
    //         partita.ragionesociale
    //           .toLowerCase()
    //           .indexOf(state.filtroMMPartite.toLowerCase()) != -1;
    //     }
    //     if (
    //       partita.sapid &&
    //       state.filtroMMPartiteSapId &&
    //       state.filtroMMPartiteSapId.length > 2
    //     ) {
    //       ok =
    //         ok &&
    //         partita.sapid
    //           .toLowerCase()
    //           .indexOf(state.filtroMMPartiteSapId.toLowerCase()) != -1;
    //     }
    //     if (
    //       partita.valutalordo &&
    //       state.filtroMMPartiteImporto &&
    //       state.filtroMMPartiteImporto.length > 1
    //     ) {
    //       ok =
    //         ok &&
    //         partita.valutalordo &&
    //         partita.valutalordo
    //           .toString()
    //           .indexOf(state.filtroMMPartiteImporto.toString()) != -1;
    //     }
    //     if (
    //       partita.numerodocumento &&
    //       state.filtroMMPartitePartitaID &&
    //       state.filtroMMPartitePartitaID.length > 2
    //     ) {
    //       ok =
    //         ok &&
    //         partita.numerodocumento &&
    //         partita.numerodocumento
    //           .toString()
    //           .indexOf(state.filtroMMPartitePartitaID.toString()) != -1;
    //     }
    //     return ok;
    //   });
    //   console.log("Numero partite filtrate: " + partiteFiltrate.length);
    //   return partiteFiltrate;
    // },
    getfiltroMMPartite(state) {
      return state.filtroMMPartite;
    },
    getfiltroMMPartiteSapId(state) {
      return state.filtroMMPartiteSapId;
    },
    getfiltroMMPartiteImporto(state) {
      return state.filtroMMPartiteImporto;
    },
    getfiltroMMPartitePartitaID(state) {
      return state.filtroMMPartitePartitaID;
    },
    getMovimenti(state) {
      return state.movimenti;
    },
    // getMovimentiFiltrati(state) {
    //   console.log(
    //     "Numero movimenti da filtrare: " +
    //     Object.keys(state.movimenti).length +
    //     " con filtri: " +
    //     state.filtroMMMovimentiImporto +
    //     " " +
    //     state.filtroMMMovimentiRagioneSociale +
    //     " " +
    //     state.filtroMMMovimentiValuta +
    //     " " +
    //     state.filtroMMMovimentiConto +
    //     " "
    //   );

    //   let movimentiFiltrati = state.movimenti.items.filter((movimento) => {
    //     let ok = true;
    //     if (
    //       state.filtroMMMovimentiImporto &&
    //       state.filtroMMMovimentiImporto.length > 1
    //     ) {
    //       ok =
    //         ok &&
    //         movimento.valuta_importo &&
    //         movimento.valuta_importo
    //           .toString()
    //           .indexOf(state.filtroMMMovimentiImporto.toString()) != -1;
    //     }
    //     if (
    //       state.filtroMMMovimentiRagioneSociale &&
    //       state.filtroMMMovimentiRagioneSociale.length > 2
    //     ) {
    //       ok =
    //         ok &&
    //         movimento.ragionesociale &&
    //         movimento.ragionesociale
    //           .toLowerCase()
    //           .indexOf(state.filtroMMMovimentiRagioneSociale.toLowerCase()) !=
    //         -1;
    //     }
    //     if (
    //       state.filtroMMMovimentiValuta &&
    //       state.filtroMMMovimentiValuta.length > 2
    //     ) {
    //       ok =
    //         ok &&
    //         movimento.valuta &&
    //         movimento.valuta
    //           .toLowerCase()
    //           .indexOf(state.filtroMMMovimentiValuta.toLowerCase()) != -1;
    //     }
    //     if (
    //       state.filtroMMMovimentiConto &&
    //       state.filtroMMMovimentiConto.length > 2
    //     ) {
    //       ok =
    //         ok &&
    //         movimento.conto &&
    //         movimento.conto
    //           .toLowerCase()
    //           .indexOf(state.filtroMMMovimentiConto.toLowerCase()) != -1;
    //     }
    //     return ok;
    //   });
    //   console.log("Numero movimenti filtrati: " + movimentiFiltrati.length);
    //   return movimentiFiltrati;
    // },
    getFiltroMovimentiImporto(state) {
      return state.filtroMMMovimentiImporto;
    },
    getFiltroMovimentiRagioneSociale(state) {
      return state.filtroMMMovimentiRagioneSociale;
    },
    getfiltroMMMovimentiValuta(state) {
      return state.filtroMMMovimentiValuta;
    },
    getfiltroMMMovimentiConto(state) {
      return state.filtroMMMovimentiConto;
    },
    getStakeholders(state) {
      return state.stakeholders;
    },
    getContiDifferenzeIncassiPartite(state) {
      return state.contiDifferenzeIncassiPartite;
    },
    getValute(state) {
      return state.valute;
    },
    getValuteOrdinate(state) {
      return state.valuteOrdinate;
    },
    getMatches(state) {
      return state.matches;
    },
    getMatchesChiusi(state) {
      return state.matchesChiusi;
    },
    getHomeReport(state){
      return state.homeReport;
    },
    getmatchesDocumentDaVali(state) {
      return state.matchesDocumentDaVali
    },
    // getMatchesFiltrati(state) {
    //   console.log(
    //     "Numero partite da filtrare: " +
    //     Object.keys(state.matches).length +
    //     " con filtro: " +
    //     state.filtroMARagioneSociale +
    //     " e " +
    //     state.filtroMAValuta
    //   );

    //   let matchesFiltrati = state.matches.items.filter((match) => {
    //     let ok = true;
    //     if (state.filtroMARagioneSociale) {
    //       for (const partita of match.partite) {
    //         if (partita.ragionesociale) {
    //           ok =
    //             ok &&
    //             partita.ragionesociale
    //               .toLowerCase()
    //               .indexOf(state.filtroMARagioneSociale.toLowerCase()) != -1;
    //         }
    //       }
    //     }
    //     if (state.filtroMAValuta && state.filtroMAValuta.length > 2) {
    //       for (const partita of match.partite) {
    //         ok =
    //           ok &&
    //           partita.valuta &&
    //           partita.valuta
    //             .toLowerCase()
    //             .indexOf(state.filtroMAValuta.toLowerCase()) != -1;
    //       }
    //     }
    //     return ok;
    //   });
    //   console.log("Numero match filtrati: " + matchesFiltrati.length);
    //   return matchesFiltrati;
    // },
    getMatchesByConfidence(state) {
      return state.matchesByConfidence;
    },
    getTipiDocumento(state) {
      return state.tipiDocumento;
    },
    getDocumenti(state) {
      return state.documenti;
    },
    getFiltroMAValuta(state) {
      return state.filtroMAValuta;
    },
    getFiltroMARagioneSociale(state) {
      return state.filtroMARagioneSociale;
    },
    getDocumentoCorrente(state) {
      return state.documentoCorrente;
    },
    getIsSorted(state) {
      return state.isSorted;
    },
    getDocumento: (state) => (idToFind) => {
      console.log("get documento for: " + idToFind);
      if (state.documenti && state.documenti.items) {
        let ilDocumento = state.documenti.items.find((documento) => {
          return documento.idfile === idToFind;
        });
        if (ilDocumento) {
          return ilDocumento;
        }
      }
      console.log("documento non trovato");
      return "";
    },
    getRelevantValute: (state) => {
      let matches = null;
      let tutteValute = state.getValute;
      if (state && state.getMatchesChiusi) {
        console.log("Getting matches CHIUSI per le valute ");

        matches = state.getMatchesChiusi.items;
      } else if (state.getMatches) {
        console.log("Getting matches APERTI per le valute");
        matches = getters.getMatches.items;
      }
      let valuteFiltrate = [];
      if (matches) {
        for (const match of matches) {
          for (const movimento of match.movimenti) {
            if (movimento.valuta) {
              //aggiungi se non già presente
              if (
                valuteFiltrate.findIndex(
                  (x) => x.codice_iso === movimento.valuta
                ) === -1
              ) {
                let valuta = tutteValute.find(
                  (valuta) => valuta.codice_iso === movimento.valuta
                );

                valuteFiltrate.push(valuta);
              }
            }
          }
        }
        console.log(
          "Trovati:123 " +
          valuteFiltrate.length +
          " ----apps valute --> " +
          valuteFiltrate.value
        );
        return { items: valuteFiltrate };
      } else {
        console.log("non ci sono stakeholder");
        return { items: [] };
      }
    },
  },
  actions: {
    async LoadPartite(payload) {
      try {
        let params = payload.params;
        console.log("carica partite con parametri: " + params);
        let response = await axios.get("partite/", { params });
        let partiteInfo = {
          page: response.data.page,
          size: Math.min(response.data.size, response.data.total),
          pageSize: Math.min(response.data.size, response.data.total),
          total: response.data.total,
          params: params.toString(),
          items: response.data.items,
        };
        console.log(
          "num partite: " + partiteInfo.size + " su " + partiteInfo.total
        );
        this.partite = partiteInfo;
        //await commit("setPartite", partiteInfo);
      } catch (error) {
        // await commit("utils/setIsLoading", false, { root: true });
        console.log(error.response.data.error);
      }
      //await commit("utils/setIsLoading", false, { root: true });
    },
    async LoadMorePartite({ commit, state }) {
      await commit("utils/setIsLoading", true, { root: true });
      try {
        let currentPartite = state.partite;
        let params = new URLSearchParams(currentPartite.params);
        params.set("page", currentPartite.page + 1);
        console.log("carica altre partite con parametri: " + params);

        let response = await axios.get("partite/", { params });
        console.log("partite: " + response.data.items);

        let partiteInfo = {
          page: currentPartite.page + 1,
          size:
            currentPartite.size +
            Math.min(response.data.size, response.data.items.length),
          pageSize: Math.min(response.data.size, response.data.total),
          total: response.data.total,
          params: params.toString(),
          items: currentPartite.items.concat(response.data.items),
        };

        console.log(
          "numero partite: " +
          currentPartite.items.length +
          " page: " +
          partiteInfo.page
        );

        await commit("setPartite", partiteInfo);
      } catch (error) {
        await commit("utils/setIsLoading", false, { root: true });
        console.log(error.response.data.error);
      }
      await commit("utils/setIsLoading", false, { root: true });
    },

    async UpdateMovimento(payload) {
      try {
        console.log(
          "Update Movimento: with id: " + payload.idMov + " e op: " + payload.op
        );
       // await commit("utils/setIsLoading", true, { root: true });
        let params = new URLSearchParams();
        params.append("artificial_id_movimento", payload.idMov);
        if (payload.op === "disattiva") {
          params.append("flag_disabilitato", true);
        } else if (payload.op === "cambiaRS") {
          params.append("id_stakeholder", payload.idStakeholder);
        }

        let response = await axios.put(
          "update-movimento/?" + params.toString()
        );
        console.log("response:");
        console.log(response);
      } catch (error) {
       // await commit("utils/setIsLoading", false, { root: true });
        console.log(error);
        throw error;
      }
     // await commit("utils/setIsLoading", false, { root: true });
    },

    async LoadMovimenti(payload) {
      try {
        // await commit("utils/setIsLoading", true, { root: true });
        let params = payload.params;
        console.log("carica movimenti con parametri: " + params);
        let response = await axios.get("movimenti/", { params });
        let movimentiInfo = {
          page: response.data.page,
          size: Math.min(response.data.size, response.data.total),
          pageSize: Math.min(response.data.size, response.data.total),
          total: response.data.total,
          params: params.toString(),
          items: response.data.items,
        };
        console.log(
          "num movimenti: " + movimentiInfo.size + " su " + movimentiInfo.total
        );
        this.movimenti = movimentiInfo
        // await commit("setMovimenti", movimentiInfo);
      } catch (error) {
        // await commit("utils/setIsLoading", false, { root: true });
        console.log(error.response.data.error);
      }
      // await commit("utils/setIsLoading", false, { root: true });
    },
    async LoadMoreMovimenti({ commit, state }) {
      try {
        await commit("utils/setIsLoading", true, { root: true });
        let currentMovimenti = state.movimenti;
        let params = new URLSearchParams(currentMovimenti.params);
        params.set("page", currentMovimenti.page + 1);
        console.log("carica altri movimenti con parametri: " + params);

        let response = await axios.get("movimenti/", { params });

        let movimentiInfo = {
          page: currentMovimenti.page + 1,
          size:
            currentMovimenti.size +
            Math.min(response.data.size, response.data.items.length),
          pageSize: Math.min(response.data.size, response.data.total),
          total: response.data.total,
          params: params.toString(),
          items: currentMovimenti.items.concat(response.data.items),
        };

        console.log(
          "numero movimenti: " +
          movimentiInfo.items.length +
          " page: " +
          movimentiInfo.page
        );
        await commit("setMovimenti", movimentiInfo);
      } catch (error) {
        await commit("utils/setIsLoading", false, { root: true });
        console.log(error.response.data.error);
      }
      await commit("utils/setIsLoading", false, { root: true });
    },

    async LoadStakeholders(payload) {
      try { 
       let params = []
        
        if(payload == undefined){ 
          console.log("MovimentiAssociare Stakeholder call")
          params = new URLSearchParams();
          params.append("page", 1);
          params.append("size", 50);
          
        }else{ 
          console.log("Ragione Socilae Page Call")
          params = payload.params;
        }
        
        let response = await axios.get("stakeholders/", { params });
        let stakeholders = {
          page: response?.data?.page,
          size: Math.min(response?.data?.size, response?.data?.total),
          pageSize: Math.min(response?.data?.size, response?.data?.total),
          total: response?.data?.total,
          params: params.toString(),
          items: response?.data?.items,
        };
        this.stakeholders = stakeholders;
      } catch (error) {
        console.log(error);
      }
    },

    //Document da validate
    async LoadDocumentiDaVerificare(payload) {
      try {
        let params = payload.params;
        //await commit("auth/setIsLoading", true, { root: true });
        console.log("carica Documenti da verificare con parametri: " + params);
        let response = await axios.get("get-documenti-da-revisionare/", { params });
        let documentiInfo = {
          page: response.data.page,
          size: Math.min(response.data.size, response.data.total),
          pageSize: Math.min(response.data.size, response.data.total),
          total: response.data.total,
          params: params.toString(),
          items: response.data.items,
        };
        console.log(
          "num documenti da verificare: " +
          documentiInfo.size +
          " su " +
          documentiInfo.total
        );
        this.matchesDocumentDaVali = documentiInfo;
        // --- matchesDocumentDaVali
        //await commit("setDocumentiDaVerificare", documentiInfo);
      } catch (error) {
        //await commit("setDocumentiDaVerificare", null);
        //await commit("auth/setIsLoading", false, { root: true });
        console.log(error);
        // EventBus.$emit(
        //   ACTIONS.SNACKBAR_KO,
        //   "Problema caricamento Documenti da Verificare"
        // );
      }
      //await commit("auth/setIsLoading", false, { root: true });
    },

    async LoadDocumentDelete(payload) {
      try {
        let params = new URLSearchParams();
        params.append("scarta", true);
        params.append("conferma", false);
        //let response = await axios.delete("aggiorna-stato-documento/", { params });
        let response = await axios.put(
          "aggiorna-stato-documento/" + payload.idDoc + "/?" + params.toString()
        );
      } catch (error) {
        console.log(error);
      }
    },
    async LoadDocumentUpdate(payload) {
      try {
        let params = new URLSearchParams();
        params.append("scarta", false);
        params.append("conferma", true);
        params.append("note", payload.note)
        //let response = await axios.delete("aggiorna-stato-documento/", { params });
        let response = await axios.put(
          "aggiorna-stato-documento/" + payload.idDoc + "/?" + params.toString()
        );
      } catch (error) {
        console.log(error);
      }
    },

    async HomeReport() {
      try {
        let response = await axios.get("home-report/");
        this.homeReport = response.data;
      } catch (error) {
        console.log(error.response.data.error);
      }
    },

    async LoadMatches(payload) {
      try {
        let params = payload.params;
        let soloAperti = payload.soloAperti;
        console.log("LoadMatches. Solo aperti? " + soloAperti);
        await useUtilsStore().setIsLoading(true, { root: true });
        if (!soloAperti) {
          params.append("onlyclosedmatch", true);
          params.append("onlyopenmatch", false);
        } else {
          params.append("onlyclosedmatch", false);
          params.append("onlyopenmatch", true);
        }
        console.log("carica match con parametri: " + params);
        let response = await axios.get("matches/", { params });

        differenzaMovimentiMenoPartite(response.data.items);

        let matchesInfo = {
          page: response.data.page,
          size: Math.min(response.data.size, response.data.total),
          pageSize: Math.min(response.data.size, response.data.total),
          total: response.data.total,
          params: params.toString(),
          items: response.data.items,
          isSoloAperti: soloAperti,
        };
        console.log(
          "num matches: " + matchesInfo.size + " su " + matchesInfo.total
        );
        if (!soloAperti) {
          this.matchesChiusi = matchesInfo;
        } else {
          this.matches = matchesInfo;
        }
      } catch (error) {
        await useUtilsStore().setIsLoading(false, { root: true });
        console.log(error.response.data.error);
      }
      await useUtilsStore().setIsLoading(false, { root: true });
    },

    async SaveMatch({ commit }, match) {
      try {
        console.log(
          "Save Match: with id: " +
          match.idmatch +
          " e differenza: " +
          match.differenze
        );
        console.log(match);
        await commit("utils/setIsLoading", true, { root: true });
        let params = {};
        if (match.differenze) {
          params.partitedipareggio = match.differenze;
          console.log("save differenze: " + JSON.stringify(params));
          console.log(match.differenze);
        } else {
          params.partitedipareggio = [];
        }

        let response = await axios.put("close-match/" + match.idmatch, params);
        console.log("response:");
        console.log(response);
      } catch (error) {
        await commit("utils/setIsLoading", false, { root: true });
        console.log(error);
        throw error;
      }
      await commit("utils/setIsLoading", false, { root: true });
    },

    async DeleteMatch(match) {
      try {
        console.log("Cancella Match: with id: " + match.idmatch);
        console.log(match);
        // await commit("utils/setIsLoading", true, { root: true });

        let response = await axios.delete("delete-match/" + match.idmatch);
        console.log("response:");
        console.log(response);
      } catch (error) {
        //await commit("utils/setIsLoading", false, { root: true });
        console.log(error.response.data.error);
        throw error;
      }
      //await commit("utils/setIsLoading", false, { root: true });
    },

    async CreaESalvaMatch( creaEChiudi) {
      try {
        console.log("Crea Match: with partite, movimenti, differenze: ");
        console.log(creaEChiudi.listaPartite);
        console.log(creaEChiudi.listaMovimenti);
        console.log(creaEChiudi.differenze);
        // await commit("utils/setIsLoading", true, { root: true });
        let params = {};
        let partitedipareggio = {};
        partitedipareggio.partitedipareggio = creaEChiudi.differenze;
        if (creaEChiudi.differenze) {
          params.partite_pareggio = creaEChiudi.differenze;
        }
        params.artificial_movimento_bancario_list = creaEChiudi.listaMovimenti;
        params.partite_list = creaEChiudi.listaPartite;
        console.log("save new match: " + JSON.stringify(params));

        let response = await axios.post("post-manual-match/", params);
        console.log("response:");
        console.log(response);
      } catch (error) {
        //await commit("utils/setIsLoading", false, { root: true });
        console.log(error.response.data.error);
      }
      //await commit("utils/setIsLoading", false, { root: true });
    },

    async LoadMoreMatches({ commit, state }) {
      try {
        await commit("utils/setIsLoading", true, { root: true });
        let currentMatches = state.matches;
        let params = new URLSearchParams(currentMatches.params);
        params.set("page", currentMatches.page + 1);
        console.log("carica altri match con parametri: " + params);

        let response = await axios.get("matches/", { params });

        differenzaMovimentiMenoPartite(response.data.items);

        let matchesInfo = {
          page: currentMatches.page + 1,
          size:
            currentMatches.size +
            Math.min(response.data.size, response.data.items.length),
          pageSize: Math.min(response.data.size, response.data.total),
          total: response.data.total,
          params: params.toString(),
          items: currentMatches.items.concat(response.data.items),
          isSoloAperti: currentMatches.soloAperti,
        };

        console.log(
          "numero matches: " +
          matchesInfo.items.length +
          " page: " +
          matchesInfo.page
        );
        if (!currentMatches.soloAperti) {
          this.matchesChiusi = matchesInfo;
          //await commit('setMatchesChiusi', matchesInfo);
        } else {
          this.matches = matchesInfo;
          //await commit('setMatches', matchesInfo);
        }
      } catch (error) {
        await commit("utils/setIsLoading", false, { root: true });
        console.log(error.response.data.error);
      }
      await commit("utils/setIsLoading", false, { root: true });
    },

    async LoadMatchesByConfidence(params) {
      axios
        .get("matches-by-confidence/", { params })
        .then((response) => (this.matchesByConfidence = response.data))
        .catch(
          (error) =>
          (this.matchesByConfidence = {
            count: 0,
            relative_low_confidence: 0,
            relative_medium_confidence: 0,
            relative_high_confidence: 0,
            low_confidence: 0,
            medium_confidence: 0,
            high_confidence: 0,
          })
        );
    },

    async LoadConfiguration() {
      try {
        useUtilsStore().setIsLoading(true);
        //await commit('utils/setIsLoading', true, { root: true })
        // LOAD VALUTE
        let params = new URLSearchParams();
        params.append("page", 1);
        params.append("size", 100); //500
        let response = await axios.get("valute/", { params });
        if (response.data.items) {
          this.setValute(response.data.items);
          //await commit('setValute', response.data.items);
        } else {
          console.log("non ci sono valute nel DB");
        }

        // LOAD TIPI DOCUMENTO
        response = await axios.get("tipi-documento/", { params });
        this.tipiDocumento = response.data.documenti;
        //await commit('setTipiDocumento', response.data.documenti);

        // LOAD CONTI DIFFERENZE INCASSI PARTITE
        response = await axios.get("conti-differenze-incassi-partite/");
        this.contiDifferenzeIncassiPartite =
          response.data.contidifferenzeincassipartite;
        //await commit('setContiDifferenzeIncassiPartite', response.data.contidifferenzeincassipartite);
        console.log(
          "num conti differenze size: " +
          response.data.contidifferenzeincassipartite.length
        );
      } catch (error) {
        useUtilsStore().setIsLoading(false);
        //await commit('utils/setIsLoading', false, { root: true })
        console.log("Problema nel setup della configurazione.");
        console.log(error.response.data.error);
      }
    },

    async LoadDocumenti(payload) {
      try {
        let params = payload.params;
        let response = await axios.get("documenti/", { params });
        let documenti = {
          page: response?.data?.page,
          size: Math.min(response?.data?.size, response?.data?.total),
          pageSize: Math.min(response?.data?.size, response?.data?.total),
          total: response?.data?.total,
          params: params.toString(),
          items: response?.data?.items,
        };
        this.documenti = documenti;
      } catch (error) {
        console.log(error);
      }
    },

    async LoadMoreDocumenti({ commit, state }) {
      await commit("utils/setIsLoading", true, { root: true });
      try {
        let currentDocumenti = state.documenti;
        let params = new URLSearchParams(currentDocumenti.params);
        params.set("page", currentDocumenti.page + 1);
        console.log("carica altre partite con parametri: " + params);

        let response = await axios.get("partite/", { params });
        console.log("partite: " + response.data.items);

        let documentiInfo = {
          page: currentDocumenti.page + 1,
          size:
            currentDocumenti.size +
            Math.min(response.data.size, response.data.items.length),
          pageSize: Math.min(response.data.size, response.data.total),
          total: response.data.total,
          params: params.toString(),
          items: currentDocumenti.items.concat(response.data.items),
        };

        console.log(
          "numero documenti: " +
          currentDocumenti.items.length +
          " page: " +
          documentiInfo.page
        );

        await commit("setDocumenti", documentiInfo);
      } catch (error) {
        await commit("utils/setIsLoading", false, { root: true });
        console.log(error.response.data.error);
      }
      await commit("utils/setIsLoading", false, { root: true });
    },
    async LoadTipoDocumenti() {
      try {
        let response = await axios.get("tipi-documento");
        this.tipiDocumento = response.data.documenti
      } catch (error) {
        console.log(error);
      }
    },
    // LOAD CONTI DIFFERENZE INCASSI PARTITE
    async LoadContiDifferenzeIncassiPartite(){
      try{
        let response = await axios.get("conti-differenze-incassi-partite/")
        this.contiDifferenzeIncassiPartite = response.data.contidifferenzeincassipartite;

      } catch (error) {
        console.log(error)
      }
    },
    async LoadDocumento(idDocumento) {
      try {
        //await commit("utils/setIsLoading", true, { root: true });
        console.log("Carica documento ID: " + idDocumento);
        let params = new URLSearchParams();
        params.append("file_id", idDocumento);

        let response = await axios.get("get-documento/", {
          params,
          responseType: "blob",
        });
        let docURL = new Blob([response.data], { type: "application/pdf" });
        console.log(response.headers["content-type"]);
        console.log();
        console.log(response.headers["filename"]);
        var filename = "";
        var disposition = response.headers["content-disposition"];
        if (disposition && disposition.indexOf("attachment") !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, "");
          }
        }
        // await commit("setDocumentoCorrente", {
        //   doc: docURL,
        //   fileName: filename,
        //   docID: idDocumento,
        // });

        this.documentoCorrente = {
          doc: docURL,
          fileName: filename,
          docID: idDocumento,
        };

        console.log("testo documento: " + docURL);
      } catch (error) {
        // await commit("utils/setIsLoading", false, { root: true });
        this.documentoCorrente = null;
        //await commit("setDocumentoCorrente", null);
        console.log("Errore nello scaricamento del documento");
        console.log(error.response.data.error);
      }
      // await commit("utils/setIsLoading", false, { root: true });
    },
    //ex mutations -- INIZIO --
    setValute(aValute) {
      this.valute = aValute;
      var priority = {
        "EUR - Euro": 1,
        "GBP - Sterlina Inglese": 2,
        "SGD - Dollaro di Singapore": 3,
        "------------": 4,
      };

      let valuteOrdinate = structuredClone(aValute);

      for (var valuta of valuteOrdinate) {
        if (valuta.descrizione) {
          valuta.descrizione = valuta.codice_iso + " - " + valuta.descrizione;
        }
      }

      valuteOrdinate.push({
        descrizione: "------------",
        codice_iso: "---",
        codice: 0,
        divider: true,
        disabled: true,
      });

      valuteOrdinate.sort(function (a, b) {
        if (a.descrizione && b.descrizione) {
          if (priority[a.descrizione] && priority[b.descrizione]) {
            //if both items are priority
            return priority[a.descrizione] - priority[b.descrizione];
          } else if (priority[a.descrizione]) {
            //only `a` is in priority, sort it to front
            return -1;
          } else if (priority[b.descrizione]) {
            //only `b` is in priority, sort it to back
            return 1;
          } else {
            //no priority to account for, return alphabetic sort
            return a.descrizione.localeCompare(b.descrizione);
          }
        } else {
          if (a.descrizione) {
            // sort in alto
            return -1;
          } else {
            // sort in basso
            return 11;
          }
        }
      });
      this.valuteOrdinate = valuteOrdinate;
    },
    setFiltroMARagioneSociale(aFiltro) {
      this.filtroMARagioneSociale = aFiltro;
    },
    setFiltroMAValuta(aFiltro) {
      this.filtroMAValuta = aFiltro;
    },
    //ex mutations -- FINE --
  },
  persist: true,
});

// HELPERS
function differenzaMovimentiMenoPartite(matches) {
  for (let match of matches) {
    let sommaMovimenti = 0;
    match.movimenti.forEach(function (movimento) {
      if (movimento.valuta_importo) {
        sommaMovimenti += movimento.valuta_importo;
      }
    });
    let sommaPartite = 0;
    match.partite.forEach(function (partita) {
      if (partita.valutalordo) {
        sommaPartite += partita.valutalordo;
      }
    });
    match.saldo = (sommaPartite - sommaMovimenti).toFixed(2);
    //console.log("Saldo: " + match.saldo);
  }
}
/*const mutations = {
    setPartite(state, aPartite) {
      state.partite = aPartite;
      console.log("totali: " + aPartite.size + " " + state.partite.total);
    },
    setMovimenti(state, aMovimenti) {
      state.movimenti = aMovimenti;
      console.log("totali: " + aMovimenti.size + " " + state.movimenti.total);
    },
    setDocumenti(state, aDocumenti) {
      state.documenti = aDocumenti;
    },
    setStakeholders(state, aStakeholders) {
      console.log("stakeholders caricati: " + aStakeholders);
      state.stakeholders = aStakeholders;
    },
    setContiDifferenzeIncassiPartite(state, aContiDifferenzeIncassiPartite) {
      console.log("ContiDifferenzeIncassiPartite caricati: " + aContiDifferenzeIncassiPartite);
      state.contiDifferenzeIncassiPartite = aContiDifferenzeIncassiPartite;
    },
    setMatches(state, aMatches) {
      console.log("matches caricati: " + aMatches);
      state.matches = aMatches;
    },
    setMatchesChiusi(state, aMatchesChiusi) {
      console.log("matches chiusi caricati: " + aMatchesChiusi);
      state.matchesChiusi = aMatchesChiusi;
    },
    setfiltroMMPartite(state, aFiltro) {
      state.filtroMMPartite = aFiltro;
    },
    setfiltroMMPartiteSapId(state, aFiltro) {
      state.filtroMMPartiteSapId = aFiltro;
    },
    setfiltroMMPartiteImporto(state, aFiltro) {
      state.filtroMMPartiteImporto= aFiltro;
    },
    setfiltroMMPartitePartitaID(state, aFiltro) {
      state.filtroMMPartitePartitaID= aFiltro;
    },
    setfiltroMMMovimentiConto(state, aFiltro) {
      state.filtroMMMovimentiConto = aFiltro;
    },
    setfiltroMMMovimentiValuta(state, aFiltro) {
      state.filtroMMMovimentiValuta = aFiltro;
    },
    setfiltroMMMovimentiImporto(state, aFiltro) {
      state.filtroMMMovimentiImporto = aFiltro;
    },
    setfiltroMMMovimentiRagioneSociale(state, aFiltro) {
      state.filtroMMMovimentiRagioneSociale = aFiltro;
    },
    setMatchesByConfidence(state, aMatchByConfidence) {
      state.matchesByConfidence = aMatchByConfidence;
    },
    setTipiDocumento(state, aTipiDocumento) {
      state.tipiDocumento = aTipiDocumento;
    },
    setDocumentoCorrente(state, aDocumento) {
      state.documentoCorrente = aDocumento;
    },
    setIsSorted(state, aIsSorted) {
      state.isSorted = aIsSorted;
    },
  };
}*/
