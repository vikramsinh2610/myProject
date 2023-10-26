import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req) {
        const payload: any = {
          email: credentials.email,
          password: credentials.password,
        };

        const res = await fetch(
          process.env.NEXT_PUBLIC_SERVICE_BASE_URL + "/auth/admin/login",
          {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await res.json();

        if (res.ok && data) {
          return {
            id: data.user.id,
            accessToken: data.accessToken,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            profilePhoto: data.user.profilePhoto,
            isStaff: data.user.isStaff,
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
    async jwt({ token, user }: any) {
      if (user) {
        token.user = user;
      }

      return token;
    },
  },
};

export default NextAuth(authOptions);
