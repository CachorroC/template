'use server';

import clientPromise from '#@/lib/connection/mongodb';
import { revalidatePath } from 'next/cache';
import webpush from 'web-push';
import type { PushSubscription as WebPushSubscription } from 'web-push';

webpush.setVapidDetails(
  'mailto:juankpato87@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

// We use the subscription 'endpoint' as the unique ID for the device
export async function subscribeUser(
  subscription: WebPushSubscription,
  userId: string,
) {
  try {
    const client = await clientPromise;
    const db = client.db(
      'botany_db'
    ); // Replace with your DB name

    // Upsert ensures we don't create duplicate entries for the same device
    await db.collection(
      'push_subscriptions'
    ).updateOne(
      {
        endpoint: subscription.endpoint,
      },
      {
        $set: {
          subscription: subscription,
          userId      : userId,
          updatedAt   : new Date(),
        },
      },
      {
        upsert: true,
      },
    );

    revalidatePath(
      '/settings'
    ); // Refresh the UI state if needed

    return {
      success: true,
    };
  } catch ( error ) {
    console.error(
      'Failed to save subscription:', error
    );

    return {
      success: false,
      error  : 'Database error',
    };
  }
}

export async function unSubscribeUser(
  userId: string
) {
  try {
    const client = await clientPromise;
    const db = client.db(
      'botany_db'
    );

    // Delete all subscriptions tied to this specific userId (deviceId)
    await db.collection(
      'push_subscriptions'
    ).deleteMany(
      {
        userId: userId,
      }
    );

    return {
      success: true,
    };
  } catch ( error ) {
    console.error(
      'Failed to remove subscription:', error
    );

    return {
      success: false,
      error  : 'Database error',
    };
  }
}

export async function sendNotification(
  message: string,
  subscription: WebPushSubscription | null,
) {
  if ( !subscription ) {
    throw new Error(
      'No subscription available'
    );
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(
        {
          icon : '/icons/web-app-manifest-192x192.png',
          title: 'Test Notification',
          body : message,
        }
      ),
    );

    return {
      success: true,
    };
  } catch ( error ) {
    console.error(
      'Error sending push notification:', error
    );

    return {
      success: false,
      error  : 'Failed to send notification',
    };
  }
}
