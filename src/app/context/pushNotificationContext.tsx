'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscribeUser, unSubscribeUser } from '#@/app/actions/notifications';
import {
  getOrCreateDeviceId,
  urlBase64ToUint8Array,
} from '#@/lib/utils/pushUtils';

interface PushContextType {
  isSupported: boolean;
  isSubscribed: boolean;
  deviceId: string;
  subscription: PushSubscription | null;
  subscribeToPush: () => Promise<void>;
  unsubscribeFromPush: () => Promise<void>;
}

const PushNotificationContext = createContext<PushContextType | undefined>(
  undefined,
);

export function PushNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      const id = getOrCreateDeviceId();
      setDeviceId(id);
      navigator.serviceWorker.ready.then(async (registration) => {
        const sub = await registration.pushManager.getSubscription();

        if (sub) {
          setSubscription(sub);
          setIsSubscribed(true);
        }
      });
    }
  }, []);

  const subscribeToPush = async () => {
    if (!deviceId) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error('VAPID public key missing');
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,

        applicationServerKey: urlBase64ToUint8Array(publicKey) as any,
      });

      // THE FIX: Use .toJSON() to extract the hidden keys and cast it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serializedSub = sub.toJSON() as any;

      const response = await subscribeUser(serializedSub, deviceId);

      if (response?.success) {
        setSubscription(sub);
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  const unsubscribeFromPush = async () => {
    if (!deviceId || !subscription) {
      return;
    }

    try {
      const response = await unSubscribeUser(deviceId);

      if (response?.success) {
        await subscription.unsubscribe();
        setSubscription(null);
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Error unsubscribing', error);
    }
  };

  return (
    <PushNotificationContext.Provider
      value={{
        isSupported,
        isSubscribed,
        deviceId,
        subscription,
        subscribeToPush,
        unsubscribeFromPush,
      }}
    >
      {children}
    </PushNotificationContext.Provider>
  );
}

// Custom Hook to easily consume the context
export function usePushNotifications() {
  const context = useContext(PushNotificationContext);

  if (context === undefined) {
    throw new Error(
      'usePushNotifications must be used within a PushNotificationProvider',
    );
  }

  return context;
}
