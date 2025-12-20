import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Check if credentials are provided
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Hardcoded admin user for static site
        // You can add more users here or use environment variables
        const staticUser = {
          id: "1",
          email: "admin@example.com",
          name: "Admin User",
          password: "password", // In production, use env vars or hash checking
          role: "admin"
        };

        // Simple check against hardcoded user
        if (credentials.email === staticUser.email && credentials.password === staticUser.password) {
          return {
            id: staticUser.id,
            email: staticUser.email,
            name: staticUser.name,
            role: staticUser.role
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to JWT token when user signs in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user info to the session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/signin",
    error: "/signin"
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Extend the basic types provided by next-auth
declare module "next-auth" {
  interface User {
    id: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      name: string;
      email: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}