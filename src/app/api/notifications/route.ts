'use server';

import { sendNotification } from '#@/app/actions/notifications';
import type { WebPushSubscription } from 'web-push';

/**
 * POST handler for sending push notifications.
 * Expects JSON body: { message: string, subscription: WebPushSubscription }
 */
export async function POST(
  request: Request 
) {
  try {
    const {
      message, subscription 
    } = ( await request.json() ) as {
      message     : string;
      subscription: WebPushSubscription | null;
    };

    await sendNotification(
      message, subscription 
    );

    return new Response(
      JSON.stringify(
        {
          success: true 
        } 
      ), {
        status : 200,
        headers: {
          'Content-Type': 'application/json' 
        },
      } 
    );
  } catch ( error ) {
    console.error(
      'Error in notifications API:', error 
    );

    return new Response(
      JSON.stringify(
        {
          success: false,
          error  : ( error as Error ).message 
        } 
      ),
      {
        status : 500,
        headers: {
          'Content-Type': 'application/json' 
        },
      },
    );
  }
}
