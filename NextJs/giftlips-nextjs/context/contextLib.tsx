import { createContext, useContext } from "react";

export const PageProgressContext = createContext({});
export const ModalContext = createContext({});
export const UserContext = createContext({});

export function usePageProgressContext(): any {
  return useContext(PageProgressContext);
}

export function useModalContext(): any {
  return useContext(ModalContext);
}

export function useUserContext(): any {
  return useContext(UserContext);
}
