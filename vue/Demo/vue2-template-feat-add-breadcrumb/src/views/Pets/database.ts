import { Pet } from "./model";

const dogs: Pet[] = [
  {
    label: "African",
    to: {
      name: "PetBreed",
      params: { breed: "7777" },
      query: {
        breed: "African",
      },
    },
    children: [
      {
        label: "African 1",
        image: "https://images.dog.ceo/breeds/african/n02116738_10024.jpg",
      },
      {
        label: "African 2",
        image: "https://images.dog.ceo/breeds/african/n02116738_10038.jpg",
      },
    ],
  },
  {
    label: "Boxer",
    to: {
      name: "PetBreed",
      params: { breed: "8888" },
      query: {
        breed: "Boxer",
      },
    },
    children: [
      {
        label: "Boxer 1",
        image: "https://images.dog.ceo/breeds/boxer/28082007167-min.jpg",
      },
      {
        label: "Boxer 2",
        image: "https://images.dog.ceo/breeds/boxer/IMG_3394.jpg",
      },
    ],
  },
];

const cats: Pet[] = [];

export const fakePets = { cats, dogs };
