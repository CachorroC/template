import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from './lib/connection/prisma';
import { authConfig } from './auth.config';

// Schema to validate login input
const loginSchema = z.object( {
  email: z.string()
    .email(),
  password: z.string()
    .min( 6 ),
} );

export const {
  auth, handlers, signIn, signOut 
} = NextAuth( {
  ...authConfig, // <--- Spread the config here
  providers: [
    Credentials( {
      credentials: {
        email: {
          label: 'Email',
          type : 'email',
        },
        password: {
          label: 'Password',
          type : 'password',
        },
      },
      async authorize( credentials ) {
        const parsed = await loginSchema.safeParseAsync( credentials );

        if ( parsed.success ) {
          const {
            email, password 
          } = parsed.data;
          const user = await prisma.user.findUnique( {
            where: {
              email,
            },
          } );

          if ( !user ) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            password, user.password 
          );

          if ( passwordsMatch ) {
            return user;
          }
        }

        return null;
      },
    } ),
  ],
} );
