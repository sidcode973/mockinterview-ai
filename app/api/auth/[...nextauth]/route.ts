import dbConnect from "@/backend/config/dbconnect";
import User from "@/backend/models/user-model";
import NextAuth, { Account, Profile, Session, User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// ─── Interfaces ───────────────────────────────────────────────────────────────

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

// ─── Options ──────────────────────────────────────────────────────────────────

const options = {

  // ── Providers ───────────────────────────────────────────────────────────────
  providers: [

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        await dbConnect();

        const user = await User
          .findOne({ email: credentials?.email })
          .select("+password");

        if (!user) {
          throw new Error("Invalid Email or Password");
        }

        const isPasswordMatched = await user.comparePassword(
          credentials?.password ?? ""
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

  // ── Session ─────────────────────────────────────────────────────────────────
  session: {
    strategy: "jwt" as const,
  },

  // ── Callbacks ───────────────────────────────────────────────────────────────
  callbacks: {

    // ── signIn ────────────────────────────────────────────────────────────────
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
        //new user signing in with OAuth for the first time
        if (!existingUser) {

          const newUser = new User({
            email: user?.email,
            name: user?.name,
            profilePicture: {
              id: "",
              url: profile?.image ?? user?.image ?? "",
            },
            authProviders: [
              {
                provider: account?.provider ?? "",
                providerId: profile?.id ?? profile?.sub ?? "",
              },
            ],
          });

          await newUser.save();
          user.id = newUser._id.toString();
        // user already exists in DB
        } else  {
          // Check if this provider (google/github) is already saved for this user

          const existingProvider = existingUser.authProviders.find(
            (p: { provider: string }) => p.provider === account?.provider
          );
            // If NOT saved yet → add it (user might have used Google first, now using GitHub)
          if (!existingProvider) {
            existingUser.authProviders.push({
              provider: account?.provider ?? "",
              providerId: profile?.id ?? profile?.sub ?? "",
            });

            await existingUser.save();
          }
                // If profile picture is missing in DB → save it from OAuth
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

    // ── jwt ───────────────────────────────────────────────────────────────────
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

      // First sign-in
      if (user) {
        token.user     = user;
        token.provider = account?.provider ?? "credentials";
        token.image    = user?.image ?? (user as ExtendedUser)?.profilePicture?.url ?? "";
      }

      // Subsequent requests — refresh from DB
      if (!user && token.user) {
        await dbConnect();

        const dbUser = await User.findById(
          (token.user as ExtendedUser)?._id ?? (token.user as ExtendedUser)?.id
        );

        if (dbUser) {
          token.user = dbUser;

          if (!dbUser.profilePicture?.url && token.image) {
            (token.user as ExtendedUser).image = token.image as string;
          }
        }
      }

      // Profile update trigger
      if (trigger === "update") {
        const u = token.user as ExtendedUser;
        const id = u?._id ?? u?.id;

        if (id) {
          await dbConnect();

          const updatedUser = await User.findById(id);

          if (updatedUser) {
            token.user = updatedUser;

            if (!updatedUser.profilePicture?.url && token.image) {
              (token.user as ExtendedUser).image = token.image as string;
            }
          }
        }
      }

      return token;
    },

    // ── session ───────────────────────────────────────────────────────────────
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) {
      session.user     = token.user as ExtendedUser;
      session.provider = token.provider as string;

      if (token.image && !(session.user as ExtendedUser)?.profilePicture?.url) {
        (session.user as ExtendedUser).image = token.image as string;
      }

      delete (session.user as ExtendedUser).password;

      return session;
    },

  },

  // ── Pages ────────────────────────────────────────────────────────────────────
  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

};

// ─── Exports ──────────────────────────────────────────────────────────────────
export const GET  = NextAuth(options);
export const POST = NextAuth(options);