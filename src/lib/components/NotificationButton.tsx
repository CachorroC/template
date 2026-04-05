'use client';

import { usePushNotifications } from '#@/app/context/pushNotificationContext';

export default function NotificationButton() {
  const { isSubscribed, subscribeToPush, unsubscribeFromPush, deviceId } =
    usePushNotifications();

  return (
    <button
      onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
      disabled={!deviceId}
    >
      {isSubscribed
        ? 'Notifications Enabled (Click to Disable)'
        : 'Enable Notifications'}
    </button>
  );
}
