
//store/modules/match.js
import EventBus, { ACTIONS } from '../../components/Helpers/EventBus.js';

import axios from 'axios';

const state = {
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
  statiProcessoMatch: null,
  matches: null,
  matchesChiusi: null,
  matchesByConfidence: null,
  valute: null,
  valuteOrdinate: null,
  documenti: null,
  documentiDaVerificare: null,
  tipiDocumento: null,
  filtroMAValuta: null,
  filtroMARagioneSociale: null,
  filtroMADaData: null,
  filtroMAAData: null,
  documentoCorrente: null,
  isSorted: false,
  isRicercaOn: false,
};
const getters = {
  getPartite(state) {
    return state.partite;
  },
  getPartiteFiltrate(state) {
    if(!state.partite) return [];
    console.log("Numero partite da filtrare: " + Object.keys(state.partite).length + " con filtro: " + state.filtroMMPartite +","+ state.filtroMMPartiteSapId+","+ state.filtroMMPartiteImporto)

    let partiteFiltrate = state.partite.items.filter(partita => {
      let ok = true;
      if(partita.ragionesociale && state.filtroMMPartite && state.filtroMMPartite.length > 2) {
        ok = ok && (partita.ragionesociale
        .toLowerCase()
        .indexOf(state.filtroMMPartite.toLowerCase()) != -1)
      }
      if(partita.sapid && state.filtroMMPartiteSapId && state.filtroMMPartiteSapId.length > 2) {
        ok = ok && (partita.sapid
        .toLowerCase()
        .indexOf(state.filtroMMPartiteSapId.toLowerCase()) != -1)
      }
      if(partita.valutalordo && state.filtroMMPartiteImporto && state.filtroMMPartiteImporto.length > 1) {
        ok = ok && partita.valutalordo && (partita.valutalordo
          .toString()
          .indexOf(state.filtroMMPartiteImporto.toString()) != -1);
      } 
      if(partita.numerodocumento && state.filtroMMPartitePartitaID && state.filtroMMPartitePartitaID.length > 2) {
        ok = ok && partita.numerodocumento && (partita.numerodocumento
          .toString()
          .indexOf(state.filtroMMPartitePartitaID.toString()) != -1);
      } 
      return ok;
    });
    console.log("Numero partite filtrate: " + partiteFiltrate.length)
    return partiteFiltrate;
  },
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
  getMovimentiFiltrati(state) {
    console.log("Numero movimenti da filtrare: " + Object.keys(state.movimenti).length + " con filtri: " + state.filtroMMMovimentiImporto + " "+ state.filtroMMMovimentiRagioneSociale + " "+ state.filtroMMMovimentiValuta + " "+ state.filtroMMMovimentiConto + " " )

    let movimentiFiltrati = state.movimenti.items.filter(movimento => {
        let ok = true;
        if(state.filtroMMMovimentiImporto  && state.filtroMMMovimentiImporto.length > 1) {
            ok = ok && movimento.valuta_importo && (movimento.valuta_importo
              .toString()
              .indexOf(state.filtroMMMovimentiImporto.toString()) != -1);
        }
        if(state.filtroMMMovimentiRagioneSociale && state.filtroMMMovimentiRagioneSociale.length > 2) {
          ok = ok && movimento.ragionesociale && (movimento.ragionesociale
            .toLowerCase()
            .indexOf(state.filtroMMMovimentiRagioneSociale.toLowerCase()) != -1);
      }
        if(state.filtroMMMovimentiValuta && state.filtroMMMovimentiValuta.length > 2) {
          ok = ok && movimento.valuta && (movimento.valuta
            .toLowerCase()
            .indexOf(state.filtroMMMovimentiValuta.toLowerCase()) != -1);
        }
        if(state.filtroMMMovimentiConto  && state.filtroMMMovimentiConto.length > 2) {
          ok = ok && movimento.conto && (movimento.conto
            .toLowerCase()
            .indexOf(state.filtroMMMovimentiConto.toLowerCase()) != -1);
        }
        return ok;
    });
    console.log("Numero movimenti filtrati: " + movimentiFiltrati.length)
    return movimentiFiltrati;
  },
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
  getRelevantStakeholders: (state, getters)  => (chiusi) => {
    let matches = null;
    if(chiusi && getters.getMatchesChiusi) {
      console.log("Getting matches CHIUSI per gli stakeholders")
      matches = getters.getMatchesChiusi.items;
    } else if(!chiusi && getters.getMatches) {
      console.log("Getting matches APERTI per gli stakeholders")
      matches = getters.getMatches.items;
    }
    let stakeHolderFiltrati = [];
    if(matches) {
      for(const match of matches) {
        for(const partita of match.partite) {
          if(partita.sapid && partita.ragionesociale)  {
            //aggiungi se non già presente
            if(stakeHolderFiltrati.findIndex(x => x.sapid===partita.sapid) === -1) {
              stakeHolderFiltrati.push({sapid: partita.sapid, ragionesociale: partita.ragionesociale});
            }
          }
        }
      }
      console.log("Trovati: " + stakeHolderFiltrati.length + " stakeholders");
      return {items: stakeHolderFiltrati};
    } else {
      console.log("non ci sono stakeholder")
      return {items: []};
    }
  },
  getRelevantValute: (state, getters)  => (chiusi) => {
    let matches = null;
    let tutteValute = getters.getValute
    if(chiusi && getters.getMatchesChiusi) {
      console.log("Getting matches CHIUSI per le valute ")
      matches = getters.getMatchesChiusi.items;
    } else if(!chiusi && getters.getMatches) {
      console.log("Getting matches APERTI per le valute")
      matches = getters.getMatches.items;
    }
    let valuteFiltrate = [];
    if(matches) {
      for(const match of matches) {
        for(const movimento of match.movimenti) {
          if(movimento.valuta)  {
            //aggiungi se non già presente
            if(valuteFiltrate.findIndex(x => x.codice_iso===movimento.valuta) === -1) {
              let valuta = tutteValute.find(valuta => valuta.codice_iso === movimento.valuta);
              valuteFiltrate.push(valuta);
            }
          }
        }
      }
      console.log("Trovati: " + valuteFiltrate.length + " valute");
      return {items: valuteFiltrate};
    } else {
      console.log("non ci sono stakeholder")
      return {items: []};
    }
  },
  getContiDifferenzeIncassiPartite(state) {
    return state.contiDifferenzeIncassiPartite;
  },
  getStatiProcessoMatch(state) {
    return state.statiProcessoMatch;
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
  getMatchesChiusiFiltrati(state) {
    return filtraMatches(state, state.matchesChiusi);
  },
  getMatchesFiltrati(state) {
    return filtraMatches(state, state.matches);
  },
  getMatchesByConfidence(state) {
    return state.matchesByConfidence;
  },
  getTipiDocumento(state) {
    return state.tipiDocumento;
  },
  getDocumenti(state) {
    return state.documenti;
  },
  getDocumentiDaVerificare(state) {
    return state.documentiDaVerificare;
  },
  getFiltroMAValuta(state) {
    return state.filtroMAValuta;
  },
  getFiltroMARagioneSociale(state) {
    return state.filtroMARagioneSociale;
  },
  getFiltroMADaData(state) {
    return state.filtroMADaData;
  },
  getFiltroMAAData(state) {
    return state.filtroMAAData;
  },
  getDocumentoCorrente(state) {
    return state.documentoCorrente;
  },
  getIsSorted(state) {
    return state.isSorted;
  },
  getIsRicercaOn(state) {
    return state.isRicercaOn;
  },
  getDocumento: (state) => (idToFind) => {
    console.log("get documento for: " + idToFind);
    if(state.documenti && state.documenti.items) {
      let ilDocumento = state.documenti.items.find(documento => {
          return documento.idfile === idToFind;
      })
      if(ilDocumento) {
          return ilDocumento;
      }
    }
    console.log("documento non trovato");
    return "";
  },
};
const actions = {
  async LoadPartite({commit}, params) {
    try{
      await commit('auth/setIsLoading', true, { root: true }) 
      params.append('page', 1);
      params.append('size', 9999);
      console.log("carica partite con parametri: " + params);
      let response = await axios.get('partite', { params });
      let partiteInfo = {
        page: response.data.page, 
        size: Math.min(response.data.size, response.data.total), 
        pageSize: Math.min(response.data.size, response.data.total),
        total:response.data.total,
        params: params.toString(),
        items: response.data.items
    }
      console.log("num partite: " + partiteInfo.size + " su " + partiteInfo.total);

      await commit('setPartite', partiteInfo);
    } catch(error){
      await commit('setPartite', null);
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log(error)
      EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema caricamento Partite");
    }
    await commit('auth/setIsLoading', false, { root: true }) 

  },
  async LoadMorePartite({commit, state}) {
    await commit('auth/setIsLoading', true, { root: true }) 
    try{

      let currentPartite = state.partite;
      let params = new URLSearchParams(currentPartite.params);
      params.set('page', currentPartite.page + 1);
      console.log("carica altre partite con parametri: " + params);

      let response = await axios.get('partite', { params });
      console.log("partite: " + response.data.items);

      let partiteInfo = {
        page: currentPartite.page+1, 
        size: currentPartite.size + Math.min(response.data.size, response.data.items.length), 
        pageSize: Math.min(response.data.size, response.data.total), 
        total:response.data.total,
        params: params.toString(),
        items: currentPartite.items.concat(response.data.items)
      }

      console.log("numero partite: " + currentPartite.items.length + " page: " + partiteInfo.page);

      await commit('setPartite', partiteInfo);
    } catch(error){
      await commit('setPartite', null);
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log(error)
      EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema caricamento Partite");
    }
    await commit('auth/setIsLoading', false, { root: true }) 
  },

  async UpdateMovimento ({commit}, payload) {
    try{
      console.log("Update Movimento: with id: " + payload.idMov + " e op: " + payload.op);
      await commit('auth/setIsLoading', true, { root: true }) 
      let params = new URLSearchParams();
      params.append("artificial_id_movimento", payload.idMov);
      if(payload.op === "disattiva") {
        params.append("flag_disabilitato", true);
      } else if(payload.op === "attiva") {
        params.append("flag_disabilitato", false);
      } else if(payload.op === "cambiaRS") {
        params.append("id_stakeholder", payload.idStakeholder);
      }
    
      let response = await axios.put('update-movimento/?' + params.toString());
      console.log("response:");
      console.log(response);
    } catch(error){
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log(error)
      throw error;
    }
    await commit('auth/setIsLoading', false, { root: true }) 
  },

  async RunMatcher ({commit}) {
    try{
      console.log("Run Matcher: ");
      await commit('auth/setIsLoading', true, { root: true }) 
    
      let response = await axios.put('put_execution_in_queue/');
      EventBus.$emit(ACTIONS.SNACKBAR_OK, "Richiesta matcher inserita in coda");
      console.log("response:");
      console.log(response);
    } catch(error){
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log(error)
      EventBus.$emit(ACTIONS.SNACKBAR_KO, "Non è stato possibile effettuare la richiesta");
      throw error;
    }
    await commit('auth/setIsLoading', false, { root: true }) 
  },

  async LoadSuperMovimento ({commit}, idMov) {
    let response;
    try{
      console.log("Load Movimento: with id: " + idMov);
      await commit('auth/setIsLoading', true, { root: true }) 
    
      response = await axios.get('supermovimento/' + idMov + "/");
      console.log("response:");
      console.log(response);
    } catch(error){
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log(error)
      throw error;
    }
    await commit('auth/setIsLoading', false, { root: true }) 
    return response.data;
  },

  async UpdateDocumento ({commit}, payload) {
    try{
      console.log("Update Documento: with id: " + payload.idDoc + " e op: " + payload.op);
      await commit('auth/setIsLoading', true, { root: true }) 
      let params = new URLSearchParams();
      if(payload.op === "conferma") {
        params.append("conferma", true);
        params.append("scarta", false);
      } else {
        params.append("scarta", true);
        params.append("conferma", false);
      }
      
      let response = await axios.put('aggiorna-stato-documento/' + payload.idDoc +"/?" + params.toString());
      console.log("response:");
      console.log(response);
    } catch(error){
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log(error)
      throw error;
    }
    await commit('auth/setIsLoading', false, { root: true }) 
  },

  async LoadMovimenti ({commit}, params) {
      try{
        await commit('auth/setIsLoading', true, { root: true }) 
        params.append('page', 1);
        params.append('size', 9999);
        console.log("carica movimenti con parametri: " + params);
        let response = await axios.get('movimenti', { params });
        let movimentiInfo = {
          page: response.data.page, 
          size: Math.min(response.data.size, response.data.total), 
          pageSize: Math.min(response.data.size, response.data.total),
          total:response.data.total,
          params: params.toString(),
          items: response.data.items
        }
        console.log("num movimenti: " + movimentiInfo.size + " su " + movimentiInfo.total);

        await commit('setMovimenti', movimentiInfo);
      } catch(error){
        await commit('setMovimenti', null);
        await commit('auth/setIsLoading', false, { root: true }) 
        console.log(error)
        EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema caricamento Movimenti");
      }
      await commit('auth/setIsLoading', false, { root: true }) 
  },
  async LoadMoreMovimenti({commit, state}) {
    try{
      await commit('auth/setIsLoading', true, { root: true }) 
      let currentMovimenti = state.movimenti;
      let params = new URLSearchParams(currentMovimenti.params);
      params.set('page', currentMovimenti.page + 1);
      console.log("carica altri movimenti con parametri: " + params);

      let response = await axios.get('movimenti', { params });

      let movimentiInfo = {
        page: currentMovimenti.page+1, 
        size: currentMovimenti.size + Math.min(response.data.size, response.data.items.length), 
        pageSize: Math.min(response.data.size, response.data.total), 
        total:response.data.total,
        params: params.toString(),
        items: currentMovimenti.items.concat(response.data.items)
      }

      console.log("numero movimenti: " + movimentiInfo.items.length + " page: " + movimentiInfo.page);
      await commit('setMovimenti', movimentiInfo);
    } catch(error){
      await commit('setMovimenti', null);
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log(error)
      EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema caricamento Movimenti");
    }
    await commit('auth/setIsLoading', false, { root: true }) 
  },

  async LoadStakeholders ({commit}) {
    await commit('setStakeholders', null);
    let params = new URLSearchParams();
    params.set('page', 1);
    params.set('size', 9999);
    let response = await axios.get('stakeholders', { params });
    await commit('setStakeholders', response.data);
    console.log("num stakeholders size: " + response.data.size + " total: " + response.data.total);
  },

  async LoadMatches ({commit}, payload) {
    let params = payload.params;
    let soloAperti = payload.soloAperti;
    try{
        console.log("LoadMatches. Solo aperti? " + soloAperti)
        await commit('auth/setIsLoading', true, { root: true }) 
        params.append('page', 1);
        params.append('size', 1500);
        if(!soloAperti) {
          params.append('onlyclosedmatch', true);
          params.append('onlyopenmatch', false);
          if(payload.chiusiDa) params.append('closedatefrom', payload.chiusiDa);
          if(payload.chiusiA) params.append('closedateto', payload.chiusiA);
          
        } else {
          params.append('onlyclosedmatch', false);
          params.append('onlyopenmatch', true);
        }
        console.log("carica match con parametri: " + params);
        let response = await axios.get('matches', { params });

        differenzaMovimentiMenoPartite(response.data.items);

        let matchesInfo = {
          page: response.data.page, 
          size: Math.min(response.data.size, response.data.total), 
          pageSize: Math.min(response.data.size, response.data.total),
          total:response.data.total,
          params: params.toString(),
          items: response.data.items,
          isSoloAperti: soloAperti,
        }
        console.log("num matches: " + matchesInfo.size + " su " + matchesInfo.total);
        if(!soloAperti) {  
          await commit('setMatchesChiusi', matchesInfo);
        } else {
          await commit('setMatches', matchesInfo);
        }
      } catch(error){
        if(!soloAperti) {  
          await commit('setMatchesChiusi', null);
        } else {
          await commit('setMatches', null);
        }
        await commit('auth/setIsLoading', false, { root: true }) 
        console.log(error)
        EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema caricamento Matches");
      }
      await commit('auth/setIsLoading', false, { root: true }) 
    },

  async SaveMatch ({commit}, match) {
    try{
      console.log("Save Match: with id: " + match.idmatch + " e differenza: " + match.differenze);
      console.log(match);
      await commit('auth/setIsLoading', true, { root: true }) 
      let params = {}
      if(match.differenze) {
        params.partitedipareggio = match.differenze
        console.log("save differenze: " + JSON.stringify(params));
        console.log(match.differenze);
      } else {
        params.partitedipareggio = [];
      }
      
      let response = await axios.put('close-match/' + match.idmatch, params );
      console.log("response:");
      console.log(response);
    } catch(error){
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log(error)
      throw error;
    }
    await commit('auth/setIsLoading', false, { root: true }) 
  },

  async DeleteMatch ({commit}, match) {
    try{
      console.log("Cancella Match: with id: " + match.idmatch);
      console.log(match);
      await commit('auth/setIsLoading', true, { root: true }) 
      
      let response = await axios.delete('delete-match/' + match.idmatch );
      console.log("response:");
      console.log(response);
    } catch(error){
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log(error)
      throw error;
    }
    await commit('auth/setIsLoading', false, { root: true }) 
  },

  async CreaESalvaMatch ({commit}, creaEChiudi) {
    try{
      console.log("Crea Match: with partite, movimenti, differenze: ");
      console.log(creaEChiudi.listaPartite);
      console.log(creaEChiudi.listaMovimenti);
      console.log(creaEChiudi.differenze);
      await commit('auth/setIsLoading', true, { root: true }) 
      let params = {}
      if(creaEChiudi.differenze) {
        params.partite_pareggio = creaEChiudi.differenze;
      } else {
        params.partite_pareggio = [];
      }
      params.artificial_movimento_bancario_list = creaEChiudi.listaMovimenti;
      params.partite_list = creaEChiudi.listaPartite;
      console.log("save new match: " + JSON.stringify(params));
      
      let response = await axios.post('post-manual-match', params );
      console.log("response:");
      console.log(response);
    } catch(error){
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log(error)
      EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema salvataggio Match");
      throw error;
    }
    await commit('auth/setIsLoading', false, { root: true }) 
  },


  async LoadMoreMatches({commit, state}, payload) {
    let soloAperti = payload.soloAperti;
    let currentMatches = null;
    if(soloAperti) {
     currentMatches = state.matches;
    } else {
      currentMatches = state.matchesChiusi;
    }
    try{
      await commit('auth/setIsLoading', true, { root: true }) 
      let params = new URLSearchParams(currentMatches.params);
      params.set('page', currentMatches.page + 1);
      console.log("carica altri match con parametri: " + params);

      let response = await axios.get('matches', { params });

      differenzaMovimentiMenoPartite(response.data.items);

      let matchesInfo = {
        page: currentMatches.page+1, 
        size: currentMatches.size + Math.min(response.data.size, response.data.items.length), 
        pageSize: Math.min(response.data.size, response.data.total), 
        total:response.data.total,
        params: params.toString(),
        items: currentMatches.items.concat(response.data.items),
        isSoloAperti: currentMatches.isSoloAperti,
      }

      console.log("numero matches: " + matchesInfo.items.length + " page: " + matchesInfo.page);
      if(!currentMatches.isSoloAperti) {  
        await commit('setMatchesChiusi', matchesInfo);
      } else {
        await commit('setMatches', matchesInfo);
      }
    } catch(error){
      if(!currentMatches.isSoloAperti) {  
        await commit('setMatchesChiusi', null);
      } else {
        await commit('setMatches', null);
      }
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log(error)
      EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema caricamento Match");
    }
    await commit('auth/setIsLoading', false, { root: true }) 
  },

  async LoadMatchesByConfidence ({commit}, params) {
    let response = await axios.get('matches-by-confidence', { params });
    await commit('setMatchesByConfidence', response.data);
  },
  async LoadConfiguration ({commit}) {
    try {
      await commit('auth/setIsLoading', true, { root: true }) 
      // LOAD VALUTE
      let params = new URLSearchParams();
      params.append('page', 1);
      params.append('size', 500);
      let response = await axios.get('valute', { params });
      if(response.data.items) {
        await commit('setValute', response.data.items);
      } else {
        console.log("non ci sono valute nel DB");
      }

      // LOAD TIPI DOCUMENTO
      params.append('visualizza_solo_se_ospitano_movimenti', true)
      response = await axios.get('tipi-documento', { params });
      await commit('setTipiDocumento', response.data.documenti);

      // LOAD CONTI DIFFERENZE INCASSI PARTITE
      response = await axios.get('conti-differenze-incassi-partite');
      await commit('setContiDifferenzeIncassiPartite', response.data.contidifferenzeincassipartite);
      console.log("num conti differenze size: " + response.data.contidifferenzeincassipartite.length);

      // LOAD STATI PROCESSO MATCH
      response = await axios.get('stato-trasferimento-list');
      await commit('setStatiProcessoMatch', response.data);

      console.log("num stati processo match: " + response.data.length);
    } catch(error){
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log("Problema nel setup della configurazione.")
      console.log(error)
      EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema nell'accesso alle API per l'inizializzazione della applicazione");
    }

  },

  async LoadDocumenti({commit}, params) {
    try{
      await commit('auth/setIsLoading', true, { root: true }) 
      params.append('page', 1);
      params.append('size', 1000);
      console.log("carica Documenti con parametri: " + params);
      let response = await axios.get('documenti', { params });
      let documentiInfo = {
        page: response.data.page, 
        size: Math.min(response.data.size, response.data.total), 
        pageSize: Math.min(response.data.size, response.data.total),
        total:response.data.total,
        params: params.toString(),
        items: response.data.items
    }
      console.log("num documenti: " + documentiInfo.size + " su " + documentiInfo.total);

      await commit('setDocumenti', documentiInfo);
    } catch(error){
      await commit('setDocumenti', null);
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log(error)
      EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema caricamento Documenti");
    }
    await commit('auth/setIsLoading', false, { root: true }) 
  },

  async LoadMoreDocumenti({commit, state}) {
    await commit('auth/setIsLoading', true, { root: true }) 
    try{

      let currentDocumenti = state.documenti;
      let params = new URLSearchParams(currentDocumenti.params);
      params.set('page', currentDocumenti.page + 1);
      console.log("carica altro documenti con parametri: " + params);

      let response = await axios.get('documenti', { params });
      console.log("documenti: " + response.data.items);

      let documentiInfo = {
        page: currentDocumenti.page+1, 
        size: currentDocumenti.size + Math.min(response.data.size, response.data.items.length), 
        pageSize: Math.min(response.data.size, response.data.total), 
        total:response.data.total,
        params: params.toString(),
        items: currentDocumenti.items.concat(response.data.items)
      }

      console.log("numero documenti: " + currentDocumenti.items.length + " page: " + documentiInfo.page);

      await commit('setDocumenti', documentiInfo);
    } catch(error){
      await commit('setDocumenti', null);
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log(error)
      EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema caricamento Documenti");
    }
    await commit('auth/setIsLoading', false, { root: true }) 
  },

  async LoadDocumentiDaVerificare({commit}, params) {
    try{
      await commit('auth/setIsLoading', true, { root: true }) 
      params.append('page', 1);
      params.append('size', 1000);
      params.append('solo_non_confermati', true);
      console.log("carica Documenti da verificare con parametri: " + params);
      let response = await axios.get('get-documenti-da-revisionare', { params });
      let documentiInfo = {
        page: response.data.page, 
        size: Math.min(response.data.size, response.data.total), 
        pageSize: Math.min(response.data.size, response.data.total),
        total:response.data.total,
        params: params.toString(),
        items: response.data.items
    }
      console.log("num documenti da verificare: " + documentiInfo.size + " su " + documentiInfo.total);

      await commit('setDocumentiDaVerificare', documentiInfo);
    } catch(error){
      await commit('setDocumentiDaVerificare', null);
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log(error)
      EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema caricamento Documenti da Verificare");
    }
    await commit('auth/setIsLoading', false, { root: true }) 
  },

  async LoadMoreDocumentiDaVerificare({commit, state}) {
    await commit('auth/setIsLoading', true, { root: true }) 
    try{

      let currentDocumentiDaVerificare = state.documentiDaVerificare;
      let params = new URLSearchParams(currentDocumentiDaVerificare.params);
      params.set('page', currentDocumentiDaVerificare.page + 1);
      console.log("carica altri documenti da verificare con parametri: " + params);

      let response = await axios.get('get-documenti-da-revisionare', { params });
      console.log("documenti da verificare: " + response.data.items);

      let documentiInfo = {
        page: currentDocumentiDaVerificare.page+1, 
        size: currentDocumentiDaVerificare.size + Math.min(response.data.size, response.data.items.length), 
        pageSize: Math.min(response.data.size, response.data.total), 
        total:response.data.total,
        params: params.toString(),
        items: currentDocumentiDaVerificare.items.concat(response.data.items)
      }

      console.log("numero documenti da verificare: " + currentDocumentiDaVerificare.items.length + " page: " + documentiInfo.page);

      await commit('setDocumentiDaVerificare', documentiInfo);
    } catch(error){
      await commit('setDocumentiDaVerificare', null);
      await commit('auth/setIsLoading', false, { root: true }) 
      console.log(error)
      EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema caricamento Documenti da Verificare");
    }
    await commit('auth/setIsLoading', false, { root: true }) 
  },

  async LoadDocumento({commit}, idDocumento) {
    try{
      await commit('auth/setIsLoading', true, { root: true }) 
      console.log("Carica documento ID: " + idDocumento);
      let params = new URLSearchParams();
      params.append("file_id", idDocumento);

      let response = await axios.get('get-documento/', {params, responseType: 'blob'});
      let docURL = new Blob([response.data], { type: "application/pdf"});
      console.log(response.headers["content-type"]);
      console.log();
      console.log(response.headers["filename"]);
      var filename = "";
      var disposition = response.headers["content-disposition"];
      if (disposition && disposition.indexOf('attachment') !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) { 
            filename = matches[1].replace(/['"]/g, '');
          }
      }     
      await commit('setDocumentoCorrente', {doc: docURL, fileName: filename, docID: idDocumento});

      console.log("testo documento: " + docURL);
    } catch(error){
      await commit('auth/setIsLoading', false, { root: true });
      await commit('setDocumentoCorrente', null);
      console.log("Errore nello scaricamento del documento");
      console.log(error)
      EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema caricamento Documento");
    }
    await commit('auth/setIsLoading', false, { root: true }) 
  },

};
const mutations = {
  setPartite(state, aPartite) {
    state.partite = aPartite;
  },
  setMovimenti(state, aMovimenti) {
    state.movimenti = aMovimenti;
  },
  setDocumenti(state, aDocumenti) {
    state.documenti = aDocumenti;
  },
  setDocumentiDaVerificare(state, aDocumenti) {
    state.documentiDaVerificare = aDocumenti;
  },
  setStakeholders(state, aStakeholders) {
    console.log("stakeholders caricati: " + aStakeholders);
    state.stakeholders = aStakeholders;
  },
  setContiDifferenzeIncassiPartite(state, aContiDifferenzeIncassiPartite) {
    console.log("ContiDifferenzeIncassiPartite caricati: " + aContiDifferenzeIncassiPartite);
    state.contiDifferenzeIncassiPartite = aContiDifferenzeIncassiPartite;
  },
  setStatiProcessoMatch(state, aStatiProcessoMatch) {
    console.log("Stati Processo Match caricati: " + aStatiProcessoMatch);
    state.statiProcessoMatch = aStatiProcessoMatch;
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
  setFiltroMAValuta(state, aFiltro) {
    state.filtroMAValuta = aFiltro;
  },
  setFiltroMARagioneSociale(state, aFiltro) {
    state.filtroMARagioneSociale = aFiltro;
  },
  setFiltroMADaData(state, aFiltro) {
    state.filtroMADaData = aFiltro;
  },
  setFiltroMAAData(state, aFiltro) {
    state.filtroMAAData = aFiltro;
  },

  setValute(state, aValute) {
    state.valute = aValute;
    var priority = {
      
        "EUR - Euro": 1,
        "GBP - Sterlina Inglese": 2,
        "SGD - Dollaro di Singapore": 3,
        "------------" :4
      }

      let valuteOrdinate = structuredClone(aValute);

      for (var valuta of valuteOrdinate) {
        if(valuta.descrizione) {
          valuta.descrizione = valuta.codice_iso + " - " + valuta.descrizione;
        }
      }

      valuteOrdinate.push({
        "descrizione" : "------------",
        "codice_iso" : "---",
        "codice" : 0,
        "divider": true,
        "disabled": true
      })

      valuteOrdinate.sort(function(a, b) {
        if(a.descrizione && b.descrizione) {
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
          if(a.descrizione) {
            // sort in alto
            return -1;
          } else {
            // sort in basso
            return 11;
          }
        }
      });
      state.valuteOrdinate = valuteOrdinate;
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
  setIsRicercaOn(state, aIsRicercaOn) {
    state.isRicercaOn = aIsRicercaOn;
  },
};

// HELPERS
function differenzaMovimentiMenoPartite(matches) {
  for(let match of matches ) {
    let sommaMovimenti = 0;
    match.movimenti.forEach(function(movimento) {
        if (movimento.valuta_importo) {
            sommaMovimenti += movimento.valuta_importo;
        }
    })
    let sommaPartite = 0;
    match.partite.forEach(function(partita) {
        if (partita.valutalordo) {
            sommaPartite += partita.valutalordo;
        }
    })
    match.saldo = (sommaMovimenti - sommaPartite).toFixed(2);
    console.log("Saldo: " + match.saldo);
  }
}

function filtraMatches(state, matchesDaFiltrare) {
  if(!matchesDaFiltrare || !matchesDaFiltrare.items) { 
    console.log("non ci sono movimenti da filtrare"); 
    return null; 
  }
  console.log("Numero match da filtrare: " + matchesDaFiltrare.length)
  console.log("Con filtro: " + state.filtroMARagioneSociale + " e " + state.filtroMAValuta + " e da data: " + state.filtroMADaData + " e a data: " + state.filtroMAAData)

  let matchesFiltrati = matchesDaFiltrare.items.filter(match => {
    let ok = true;
    if(state.filtroMARagioneSociale && state.filtroMARagioneSociale.length > 0) {
      for(const partita of match.partite) {
        if(partita.sapid)  {
          let rsTrovata = false;
          for(const ragioneSociale of state.filtroMARagioneSociale) {
//            console.log("provo RS: " + ragioneSociale + " contro valuta partita: " + partita.sapid)
            rsTrovata = rsTrovata || (partita.sapid
              .toLowerCase()
              .indexOf(ragioneSociale.toLowerCase()) != -1)
          }
          ok = ok && rsTrovata;
        }
      }
    }
    if(state.filtroMAValuta && state.filtroMAValuta.length > 0) {
      for(const partita of match.partite) {
        let valutaTrovata = false;
        for(const valuta of state.filtroMAValuta) {
           valutaTrovata = valutaTrovata || (partita.valuta
          .toLowerCase()
          .indexOf(valuta.toLowerCase()) != -1);
        }
        ok = ok && partita.valuta && valutaTrovata;
      }
    }
    if(state.filtroMADaData) {
      for(const movimento of match.movimenti) {
        console.log("Da Data: " + movimento.dataoperazione + " filtro: " + state.filtroMADaData)
        let a = new Date(movimento.dataoperazione);
        a.setHours(0, 0, 0, 0);
        let b = new Date(state.filtroMADaData);
        b.setHours(0, 0, 0, 0);
                ok = ok && movimento.dataoperazione && (a.getTime() >= b.getTime());
      }
    }
    if(state.filtroMAAData) {
      for(const movimento of match.movimenti) {
        console.log("Da Data: " + movimento.dataoperazione + " filtro: " + state.filtroMAAData)
        let a = new Date(movimento.dataoperazione);
        a.setHours(0, 0, 0, 0);
        let b = new Date(state.filtroMAAData);
        b.setHours(0, 0, 0, 0);
        ok = ok && movimento.dataoperazione && (a.getTime() <= b.getTime());
      }
    }
    return ok;
  });
  console.log("Numero match filtrati: " + matchesFiltrati.length)
  return matchesFiltrati;
}



export default {
  namespaced:true,
  state,
  getters,
  actions,
  mutations
};

