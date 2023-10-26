import Pets from "../views/Pets/Pets.vue";
import { bread, finder } from "./model";

//  Using finder - approach 1
const initial: bread[] = [{ label: "Home", name: "Home" }];

const TYPE_FINDER: finder = {
  name: "PetType",
  query: ["typeId"],
  params: ["typeId"],
};

const BREED_FINDER: finder = {
  name: "PetBreed",
  query: ["typeId", "breed"], //(e.g. Dogs - Boxer)
  params: ["typeId", "breed"], //(e.g. 123 - 789)
};

export const PETS = {
  name: "PetType",
  path: "/pets/:typeId",
  component: Pets,
  meta: {
    breadcrumb: {
      initialState: initial,
      /* 
        finders array will be used as reference to create the breadcrumb by param and query keys

        The array order will define the breadcrum order, so: 
        bread[finders[0]] > bread[finders[1]] ---- (e.g. Home > Dogs)
      */
      finders: [TYPE_FINDER],
    },
  },
  props: true,
  children: [
    {
      name: "PetBreed",
      path: "/pets/:typeId/breed/:breed",
      component: Pets,
      meta: {
        breadcrumb: {
          initialState: initial,

          /* 
          finders array will be used as reference to create the breadcrumb by params and query keys
          The array order will define the breadcrum order, so: 

          bread[finders[0]] > bread[finders[1]] > bread[finders[2]] ---- (e.g. Home > Dogs > Boxer)
          */
          finders: [TYPE_FINDER, BREED_FINDER],
        },
      },
      props: true,
    },
  ],
};
