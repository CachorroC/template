'use client';

import { subscribeUser, unSubscribeUser } from '#@/app/actions/notifications';
import { useState, useEffect } from 'react';

// Helper function to convert the VAPID public key
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

// NEW HELPER: Get or create the anonymous device ID
const getOrCreateDeviceId = () => {
  // Check if we already created one for this browser
  let deviceId = localStorage.getItem('anonymous_device_id');

  if (!deviceId) {
    // Generate a new standard UUID and save it
    deviceId = crypto.randomUUID();
    localStorage.setItem('anonymous_device_id', deviceId);
  }

  return deviceId;
};

export default function NotificationToggle() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  // Check if the user is already subscribed on mount
  useEffect(() => {
    // 1. Grab the anonymous ID on the client side only (avoids hydration errors)
    const id = getOrCreateDeviceId();
    setDeviceId(id);

    async function checkSubscription() {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      }
    }

    checkSubscription();
  }, []);

  const handleToggle = async () => {
    if (!deviceId) {
      return;
    } // Safeguard

    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;

      if (isSubscribed) {
        // --- DISABLE NOTIFICATIONS ---
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          // 1. Tell the server to delete it from MongoDB
          await unSubscribeUser(deviceId);
          // 2. Unsubscribe locally in the browser
          await subscription.unsubscribe();
          setIsSubscribed(false);
        }
      } else {
        // --- ENABLE NOTIFICATIONS ---
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_KEY!;
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        // 1. Ask browser for permission & generate subscription token
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });

        // 2. Send the new token to the Server Action to save in MongoDB
        await subscribeUser(JSON.parse(JSON.stringify(subscription)), deviceId);
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      alert('Failed to update notification preferences.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading || !deviceId}
    >
      {isLoading
        ? 'Updating...'
        : isSubscribed
          ? 'Disable Notifications'
          : 'Enable Notifications'}
    </button>
  );
}
