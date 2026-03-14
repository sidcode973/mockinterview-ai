import dbConnect from "@/backend/config/dbconnect";
import User from "@/backend/models/user-model";
import NextAuth, { Account, Profile, Session, User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

interface ExtendedUser extends NextAuthUser {
  _id?: string;
  profilePicture?: { url: string };
  authProviders?: { provider: string; providerId: string }[];
  password?: string;
}

interface ExtendedProfile extends Profile {
  id?: string;
  image?: string;
  sub?: string;
}

declare module "next-auth" {
  interface Session {
    provider?: string;
  }
}

const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials?.email }).select(
          "+password"
        );

        if (!user) {
          throw new Error("Invalid Email or Password");
        }

        const isPasswordMatched = await user.comparePassword(
          credentials?.password
        );

        if (!isPasswordMatched) {
          throw new Error("Invalid Email or Password");
        }

        return user;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: ExtendedUser;
      account: Account | null;
      profile?: ExtendedProfile;
    }) {
      await dbConnect();

      if (account?.provider === "credentials") {
        user.id = user?._id ?? "";
      } else {
        const existingUser = await User.findOne({ email: user?.email });

        if (!existingUser) {
          const newUser = new User({
            email: user?.email,
            name: user?.name,
            profilePicture: { url: profile?.image ?? user?.image ?? "" },
            authProviders: [
              {
                provider: account?.provider ?? "",
                providerId: profile?.id ?? profile?.sub ?? "",
              },
            ],
          });

          await newUser.save();
          user.id = newUser._id;
        } else {
          const existingProvider = existingUser.authProviders.find(
            (provider: { provider: string }) =>
              provider.provider === account?.provider
          );

          if (!existingProvider) {
            existingUser.authProviders.push({
              provider: account?.provider ?? "",
              providerId: profile?.id ?? profile?.sub ?? "",
            });

            if (!existingUser.profilePicture.url) {
              existingUser.profilePicture = {
                url: profile?.image ?? user?.image ?? "",
              };
            }

            await existingUser.save();
          }

          user.id = existingUser._id;
        }
      }

      return true;
    },
    async jwt({ token, user ,account }: { token: JWT; user?: ExtendedUser; account?: Account | null }) {
      if (user) {
        token.user = user;
        token.provider = account?.provider ?? "credentials"
      } else {
        await dbConnect();

        const dbUser = await User.findById((token.user as ExtendedUser)?.id);
        if (dbUser) {
          token.user = dbUser;
        }
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = token.user as ExtendedUser;
      session.provider = token.provider as string;

      delete (session.user as ExtendedUser).password;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const GET = NextAuth(options);
export const POST = NextAuth(options);