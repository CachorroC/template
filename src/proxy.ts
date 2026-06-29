import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const {
  auth
} = NextAuth( authConfig );

export default auth( ( req ) => {
  const isLoggedIn = !!req.auth;
  const {
    nextUrl
  } = req;

  // Since we use the Matcher below, we know this code ONLY runs on protected routes.
  // We just need to check if they are logged in.
  if ( !isLoggedIn ) {
    // Create the redirect URL to the login page
    const redirectUrl = new URL(
      '/login', nextUrl.origin
    );

    // Add the callbackUrl so they go back to the Note/Tarea they were trying to view
    redirectUrl.searchParams.append(
      'callbackUrl', nextUrl.pathname
    );

    return NextResponse.redirect( redirectUrl );
  }

  // If logged in, let them pass
  return NextResponse.next();
} );

// PERFORMANCE OPTIMIZATION:
// This Matcher acts as a "Whitelist". The middleware will ONLY start up
// for the paths listed here. It will completely ignore /api, /, /about, etc.
export const config = {
  matcher: [
    // 1. Carpeta routes (covers /Carpeta and /Carpeta/123)
    //'/Carpeta/:path*',
    //'/Carpetas/:path*',
    '/Carpetas_alt/:path*', // Adjust spelling as needed
  ],
};
