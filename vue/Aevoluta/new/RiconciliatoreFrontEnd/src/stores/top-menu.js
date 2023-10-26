import { defineStore } from "pinia";
import Home from '@/assets/images/home.svg';
import Match from '@/assets/images/match.svg';
import Anagraphic from '@/assets/images/anagraphic.svg';
import DocValidation from '@/assets/images/doc_validation.svg';
import Doc from '@/assets/images/doc.svg';
import Business from '@/assets/images/business.svg';
import BigMatch from '@/assets/images/big_match.svg';
import BigMatchManual from '@/assets/images/big_match_manual.svg';
import BigMatchAutomatic from '@/assets/images/big_match_automatic.svg';

export const useTopMenuStore = defineStore("topMenu", {
  state: () => ({
    menu: [
      {
        icon: Home,
        pageName: "Home",
        title: "Home",
      },
      {
        icon: Match,
        pageName: "Match Validati",
        title: "Match",
        subMenu: [
          {
            icon: BigMatch,
            pageName: "Match Validati",
            title: "Match Validati",
          },
          {
            icon: BigMatchManual,
            pageName: "Movimenti da Associare",
            title: "Movimenti da Associare",
          },    
          {
            icon: BigMatchAutomatic,
            pageName: "Match con Confidenza Elevata",
            title: "Match con Confidenza Elevata",
          },    
          {
            icon: BigMatchAutomatic,
            pageName: "Match con Confidenza Intermedia",
            title: "Match con Confidenza Intermedia",
          },    
          {
            icon: BigMatchAutomatic,
            pageName: "Match con Confidenza Bassa",
            title: "Match con Confidenza Bassa",
          },          
        ],
      },
      {
        icon: Anagraphic,
        pageName: "top-menu-anagrafica",
        title: "Anagrafica",
        subMenu: [
          {
            icon: DocValidation,
            pageName: "Documenti da Validare",
            title: "Documenti da Validare",
          },
          {
            icon: Doc,
            pageName: "Documenti",
            title: "Documenti",
          },
          {
            icon: Business,
            pageName: "Ragioni Sociali",
            title: "Ragioni Sociali",
          }          
        ],
      },
    ],
  }),
});
