import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions = {
  providers: [
    GoogleProvider({
      name: "googleLogin",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      name: "facebookLogin",
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req) {
        let payload: any = {
          email: credentials.email,
          password: credentials.password,
        };

        if (credentials.cardId !== "") {
          payload.cardId = credentials.cardId;
        }

        const res = await fetch(
          process.env.NEXT_PUBLIC_SERVICE_BASE_URL + "/auth/login",
          {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await res.json();

        if (res.ok && data) {
          return {
            accessToken: data.accessToken,
            id: data.user.id,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
          };
        }

        return null;
      },
    }),
    CredentialsProvider({
      id: "google-one-tap",
      name: "google one tap",
      credentials: {
        credential: { type: "text" },
      },
      async authorize(credentials: any, req) {
        const token = credentials.credential;
        const res = await fetch(
          process.env.NEXT_PUBLIC_SERVICE_BASE_URL + "/auth/google",
          {
            method: "POST",
            body: JSON.stringify({ token }),
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await res.json();

        if (res.ok && data) {
          return {
            accessToken: data.accessToken,
            id: data.user.id,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.user = user;
      }

      if (account?.provider === "google") {
        const res = await fetch(
          process.env.NEXT_PUBLIC_SERVICE_BASE_URL + "/auth/google",
          {
            method: "POST",
            body: JSON.stringify({ token: account.id_token }),
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await res.json();

        return {
          ...token,
          sub: data.user.sub,
          user: {
            ...token.user,
            accessToken: data.accessToken,
            id: data.user.id,
          },
        };
      } else if (account?.provider === "facebook") {
        const res = await fetch(
          process.env.NEXT_PUBLIC_SERVICE_BASE_URL + "/auth/facebook",
          {
            method: "POST",
            body: JSON.stringify({
              email: token.email,
              pictureUrl: token.picture,
              name: token.name,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await res.json();
        
        return {
          ...token,
          sub: data.user.sub,
          user: {
            ...token.user,
            accessToken: data.accessToken,
            id: data.user.id,
          },
        };
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
