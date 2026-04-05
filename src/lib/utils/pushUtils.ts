export interface WebPushSubscription {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const getOrCreateDeviceId = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }

  let deviceId = localStorage.getItem('anonymous_device_id');

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('anonymous_device_id', deviceId);
  }

  return deviceId;
};

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray as unknown as Uint8Array;
}
