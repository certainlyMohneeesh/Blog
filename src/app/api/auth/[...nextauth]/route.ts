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
      const adminUsers = (process.env.ALLOWED_GITHUB_USERS || '').split(',').map(u => u.trim().toLowerCase());
      console.log('GitHub login:', githubProfile.login, 'email:', githubProfile.email, 'admins:', adminUsers);
      const isAdmin = adminUsers.includes((githubProfile.login || '').toLowerCase()) || adminUsers.includes((githubProfile.email || '').toLowerCase());
      if (!isAdmin) {
        return false;
      }
      if (!githubProfile.email) {
        return false;
      }
      await prisma.user.upsert({
        where: { email: githubProfile.email },
        create: {
          email: githubProfile.email,
          name: githubProfile.name || githubProfile.login,
          image: githubProfile.avatar_url,
          role: isAdmin ? 'admin' : 'user',
        },
        update: {
          name: githubProfile.name || githubProfile.login,
          image: githubProfile.avatar_url,
          role: isAdmin ? 'admin' : 'user',
        }
      });
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        // Fetch role from DB and attach to session
        const dbUser = await prisma.user.findUnique({ where: { email: session.user.email! } });
        (session.user as any).role = dbUser?.role || 'user';
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
