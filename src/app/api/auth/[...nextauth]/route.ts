import { FetchHelper } from "@/app/FetchHelper";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const getData = async (email: string, password: string) => {
  const res = await fetch(`http://localhost:5029/api/v1/get-user?Email=${encodeURIComponent(email)}&Password=${encodeURIComponent(password)}`)
  if (!res.ok) {
    return null
  }
  return res.json()
}
const getUserById = async (userId: string) => {
  const res = await fetch(`http://localhost:5029/api/v1/get-user-by-id/${userId}`)
  if (!res.ok) {
    return null
  }
  return res.json()
}
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@mail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email != null && credentials.password != null) {
          const user = await getData(credentials?.email, credentials?.password)
          if (user) {
            return user;
          }
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          userId: user.userId,
          userName: user.userName,
          email: user.email,
          role: user.role
        };
      }
      return token;
    },
    async session({ session, token }) {
      const updatedUser = await getUserById(token.userId as string)
      if (updatedUser) {
        session.user = {
          userId: updatedUser.userId,
          userName: updatedUser.userName,
          email: updatedUser.email,
          role: updatedUser.role
        };
      }else{
        session.user = {
          userId: token.userId as string,
          userName: token.userName as string,
          email: token.email as string,
          role: token.role as string
        };
      }

      return session;
    },
  }
});

export { handler as GET, handler as POST };
