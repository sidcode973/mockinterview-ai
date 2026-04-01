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

        const user = await User.findOne({ email: credentials?.email }).select("+password");

        if (!user) throw new Error("Invalid Email or Password");

        const isPasswordMatched = await user.comparePassword(credentials?.password ?? "");
        if (!isPasswordMatched) throw new Error("Invalid Email or Password");

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
            profilePicture: { id: "", url: profile?.image ?? user?.image ?? "" },
            authProviders: [
              {
                provider: account?.provider ?? "",
                providerId: profile?.id ?? profile?.sub ?? "",
              },
            ],
          });

          await newUser.save();
          user.id = newUser._id.toString();
        } else {
          const existingProvider = existingUser.authProviders.find(
            (p: { provider: string }) => p.provider === account?.provider
          );

          if (!existingProvider) {
            existingUser.authProviders.push({
              provider: account?.provider ?? "",
              providerId: profile?.id ?? profile?.sub ?? "",
            });

            await existingUser.save();
          }

          // ✅ Fix — always update profilePicture from OAuth if DB url is empty
          if (!existingUser.profilePicture?.url) {
            existingUser.profilePicture = {
              id: existingUser.profilePicture?.id ?? "",
              url: profile?.image ?? user?.image ?? "",
            };
            await existingUser.save();
          }

          user.id = existingUser._id.toString();
        }
      }

      return true;
    },

    async jwt({
      token,
      user,
      account,
      trigger,
    }: {
      token: JWT;
      user?: ExtendedUser;
      account?: Account | null;
      trigger?: string;
    }) {
      // ✅ First sign-in — store user + provider + image in token
      if (user) {
        token.user = user;
        token.provider = account?.provider ?? "credentials";
        token.image = user?.image ?? (user as ExtendedUser)?.profilePicture?.url ?? "";
      }

      // Refresh user from DB on subsequent requests
      if (!user && token.user) {
        await dbConnect();
        const dbUser = await User.findById(
          (token.user as ExtendedUser)?._id ?? (token.user as ExtendedUser)?.id
        );
        if (dbUser) {
          token.user = dbUser;
          // ✅ Preserve OAuth image if DB profilePicture is null
          if (!dbUser.profilePicture?.url && token.image) {
            (token.user as ExtendedUser).image = token.image as string;
          }
        }
      }

      // Triggered by update() call from client
      if (trigger === "update") {
        const u = token.user as ExtendedUser;
        const id = u?._id ?? u?.id;
        if (id) {
          await dbConnect();
          const updatedUser = await User.findById(id);
          if (updatedUser) {
            token.user = updatedUser;
            // ✅ Preserve OAuth image after profile update too
            if (!updatedUser.profilePicture?.url && token.image) {
              (token.user as ExtendedUser).image = token.image as string;
            }
          }
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = token.user as ExtendedUser;
      session.provider = token.provider as string;

      // ✅ Forward OAuth image to session so HeaderUser can use data?.user?.image
      if (token.image && !(session.user as ExtendedUser)?.profilePicture?.url) {
        (session.user as ExtendedUser).image = token.image as string;
      }

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