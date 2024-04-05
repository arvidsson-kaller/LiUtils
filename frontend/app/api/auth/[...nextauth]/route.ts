import NextAuth from "next-auth";
// import AzureADProvider from "next-auth/providers/azure-ad";
import DiscordProvider from "next-auth/providers/discord";
import { session } from "@/lib/session";
import { NextAuthOptions } from "next-auth";
import { BackendService, getUserBackendService } from "@/lib/backend";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    // AzureADProvider({
    //   clientId: process.env.AZURE_AD_CLIENT_ID!,
    //   clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
    //   tenantId: process.env.AZURE_AD_TENANT_ID,
    // }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      httpOptions: {
        timeout: 100000,
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      return session;
    },
    async jwt({ token, user, account, profile }) {
      const respone = await BackendService.oauth2SignIn({
        requestBody: {
          name: user.name!,
          email: user.email!,
          authProvider: "discord",
          authUserId: account?.providerAccountId!,
        },
      });
      token.backendJwt = respone.jwt;

      const me = await getUserBackendService(respone.jwt).getMyUser();
      console.log({ me });
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
