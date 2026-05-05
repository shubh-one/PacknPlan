import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password');
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password');
        if (!user) {
          throw new Error('No account found with this email');
        }

        if (!user.password) {
          throw new Error('This account uses Google Sign-In. Please use the Google button.');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || user.avatar,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();

          // Drop the old password index if it exists (one-time migration)
          try {
            const collection = User.collection;
            const indexes = await collection.indexes();
            const passwordIndex = indexes.find(i => i.key?.password);
            if (passwordIndex) {
              await collection.dropIndex(passwordIndex.name);
            }
          } catch (e) { /* index doesn't exist, fine */ }

          const existingUser = await User.findOne({ email: user.email.toLowerCase() });

          if (!existingUser) {
            await User.create({
              name: user.name || user.email.split('@')[0],
              email: user.email.toLowerCase(),
              image: user.image || '',
              avatar: '🧑‍✈️',
              provider: 'google',
              // No password — Google users don't need one
            });
          } else {
            // Update profile pic if missing
            if (!existingUser.image && user.image) {
              existingUser.image = user.image;
            }
            if (!existingUser.provider) {
              existingUser.provider = 'google';
            }
            await existingUser.save({ validateModifiedOnly: true });
          }
        } catch (error) {
          console.error('Google signIn error:', error.message || error);
          // Still allow sign-in even if DB save fails
          // The user will just not have a DB record until next login
          return true;
        }
      }
      return true;
    },

    async jwt({ token, user, account, trigger }) {
      // On initial sign-in
      if (user) {
        token.id = user.id;
        token.image = user.image;
        token.provider = account?.provider;
      }

      // For Google users, look up DB ID
      if (account?.provider === 'google' && token.email) {
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: token.email.toLowerCase() });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.image = dbUser.image || token.image;
          }
        } catch (error) {
          console.error('JWT callback error:', error.message);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.image = token.image;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
