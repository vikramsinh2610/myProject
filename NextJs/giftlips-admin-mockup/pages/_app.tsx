import React from "react";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.scss";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <AuthProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <ToastContainer position="top-right" autoClose={2000} theme="light" />
      </SessionProvider>
    </AuthProvider>
  );
}
