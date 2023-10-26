import {useContext,useReducer, createContext } from "react";
import { CartReducer } from "./Reducer";

const Cart=createContext();

const Context =({children})=>{
    const [state, dispatch] = useReducer(CartReducer, {
        cart:[]
    })
    return <Cart.Provider value={{state,dispatch }}>{children}</Cart.Provider>
}

export default Context;

export const CartState=()=>{
    return useContext(Cart)
}