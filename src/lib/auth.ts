import Credentials from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { login } from '@/services/Auth';

const providers: NextAuthOptions['providers'] = [
  Credentials({
    name: 'Credentials',
    credentials: {
      userName: { label: 'User Name', type: 'text' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const { userName, password } = credentials || {};
      if (!userName || !password) {
        throw new Error('Invalid credentials');
      }
      const user = await login({
        username: userName,
        password,
      });

      if (user) {
        // Any object returned will be saved in `user` property of the JWT
        return user;
      } else {
        // If you return null then an error will be displayed advising the user to check their details.
        return null;

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      }
    },
  }),
];

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    // signIn: '/login',
  },
  callbacks: {
    async signIn(params) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, user }) {
      // const now = Math.floor(Date.now() / 1000);
      if (user) {
        return {
          accessToken: (user as any)?.accessToken,
          refreshToken: (user as any)?.refreshToken,
          // accessTokenExp: account?.expires_at || token.exp,
          // refreshTokenExp: now + 60 * 60 * 24 * 30,
          // provider: account?.provider || 'credentials',
          name: (user as any)?.userName,
          email: user?.email,
          id: user.id,
          role: (user as any)?.role,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = String(token.id);
        session.user.email = token.email;
        session.user.name = token.name;
        session.accessToken = String(token.accessToken);
        session.user.role = token?.role as string;
        // session.refreshToken = String(token.refreshToken);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
