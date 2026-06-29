import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized( {
      auth, request: {
        nextUrl
      }
    } ) {
      const isLoggedIn = !!auth?.user;

      // Check if the path starts with /Carpeta

      const isProtectedRoute
        = nextUrl.pathname.startsWith( '/Carpetas_alt' );
        /*
        || nextUrl.pathname.startsWith( '/Carpeta' )
        || nextUrl.pathname.startsWith( '/Carpetas' );
        */

      if ( isProtectedRoute ) {
        if ( isLoggedIn ) {
          return true;
        }

        return false; // Redirect unauthenticated users to login page
      }

      return true;
    },
    // Add other JWT/Session callbacks here if needed for the frontend
    async jwt( {
      token, user
    } ) {
      if ( user ) {
        token.sub = user.id;
      }

      return token;
    },
    async session( {
      session, token
    } ) {
      if ( session.user && token.sub ) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  providers: [], // Providers are added in auth.ts to avoid Edge issues
} satisfies NextAuthConfig;
