import User from "@/components/models/user";
import NextAuth from "next-auth";
import CredentialsProviders from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import bcrypt from "bcrypt";
import connectDB from "@/components/common/mongodb";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProviders({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your Email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          connectDB();
          const user = await User.findOne({
            email: credentials!.email,
          });

          if (!user) {
            throw new Error("Emai and Password is incorrect.");
          }

          const validPassword = await bcrypt.compare(
            credentials!.password,
            user.password
          );

          if (!validPassword) {
            throw new Error("Emai and Password is incorrect.");
          }

          return {
            id: user._id,
            name: user.fullName,
            email: user.email,
          };
          //   const authorizedUser = {
          //     id: user._id,
          //     name: user.userName,
          //     email: user.email,
          //   };

          //   return Promise.resolve(authorizedUser);
        } catch (error: any) {
          // console.error("Error during authorization:", error);
          throw new Error(error);
        }
      },
    }),
  ],
});
export { handler as GET, handler as POST };
