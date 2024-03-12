
import authAPI from "@/api/auth";
import userAPI from "@/api/user";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "ranjau010401@gmail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          // Add logic here to look up the user from the credentials supplied
          const resp = await authAPI.login({
            email: credentials?.email as string,
            password: credentials?.password as string,
          })
          
          console.log("Resp ", resp.data)
        
          if (resp.status !== 200) {
            return null;
          }
        
          const user = resp?.data?.data;
        
          console.log("User ", user)

          const me = await userAPI.me(user.token)
          
          user.name = me?.name
          user.email = me?.email
          
          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null
  
            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        }catch (error: any) {
          console.log("Error ", error)
          return null
        }
      },
    })
  ],
  callbacks: {
    async signIn({ user }) {
      if (user) return true;

      return false;
    },
    async session({ session, token, user }: { session: any, token: any, user: any }) {
      session.user.isLoggedIn = true;
      session.user = token;
      return session;
    },
    async jwt({ token, user }) {
      return { ...token, ...user};
    },
  },
  pages: {
    signIn: "/auth/signin",
  }
}