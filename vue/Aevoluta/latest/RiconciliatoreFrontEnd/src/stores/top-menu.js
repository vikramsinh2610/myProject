import { defineStore } from "pinia";

export const useTopMenuStore = defineStore("topMenu", {
  state: () => ({
    menu: [
      {
        icon: "HomeIcon",
        pageName: "top-menu-home",
        title: "Dashboard",
      },
      {
        icon: "CopyIcon",
        pageName: "top-menu-match",
        title: "Match",
        subMenu: [
          {
            icon: "",
            pageName: "top-menu-match",
            title: "Match Validati",
          },
          {
            icon: "",
            pageName: "movimenti-da-matchare",
            title: "Movimenti da Associare",
          },          
        ],
      },
      {
        icon: "NotebookIcon",
        pageName: "top-menu-anagrafica",
        title: "Anagrafica",
        subMenu: [
          {
            icon: "",
            pageName: "documenti-da-validare",
            title: "Documenti da Validare",
          },
          {
            icon: "",
            pageName: "documenti",
            title: "Documenti",
          },
          {
            icon: "",
            pageName: "ragionisociali",
            title: "Ragioni Sociali",
          }          
        ],
      },
    ],
  }),
});
