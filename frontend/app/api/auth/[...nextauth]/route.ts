import NextAuth from "next-auth";
// import AzureADProvider from "next-auth/providers/azure-ad";
import DiscordProvider from "next-auth/providers/discord";
import { session } from "@/lib/session";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
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
    async signIn({ account, profile }) {
      return true;
    },
    async redirect({ baseUrl, url }) {
      return "/";
    },
    session,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
