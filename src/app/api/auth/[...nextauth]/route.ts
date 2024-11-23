import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import prisma from "@/lib/db";
import { GitHubProfile } from "@/types";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const githubProfile = profile as GitHubProfile;
      
      if (githubProfile.login !== process.env.ALLOWED_GITHUB_USER) {
        return false;
      }

      if (!githubProfile.email) {
        return false;
      }

      const dbUser = await prisma.user.upsert({
        where: { email: githubProfile.email },
        create: {
          email: githubProfile.email,
          name: githubProfile.name || githubProfile.login,
          image: githubProfile.avatar_url
        },
        update: {
          name: githubProfile.name || githubProfile.login,
          image: githubProfile.avatar_url
        }
      });

      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
