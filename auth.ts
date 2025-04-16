import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "./database/db";
import { users } from "./database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const authOptions: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      async profile(profile) {
        let existingUser = [];
        try {
          existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, profile.email));
        } catch (err) {
          console.log("Error fetching user:", err);
        }

        if (!existingUser.length) {
          try {
            await db.insert(users).values({
              name: profile.name,
              email: profile.email,
            });
          } catch (err) {
            console.log("Error inserting user:", err);
          }
        }

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
    }),
    GitHub,
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials?.email.toString()))
          .limit(1);

        if (user.length === 0) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password.toString(),
          user[0].password as string
        );

        if (!isPasswordValid) return null;

        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
