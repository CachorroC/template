/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import styles from '../styles/PushNotifications.module.css';
import { sendNotification } from '#@/app/actions/notifications';
import type { PushSubscription as WebPushSubscription } from 'web-push';

export function PushNotificationManager() {
  const {
    isSupported,
    isSubscribed,
    subscription,
    subscribeToPush,
    unsubscribeFromPush,
  } = usePushNotifications();
  const [
    message,
    setMessage
  ] = useState(
    ''
  );

  if ( !isSupported ) {
    return (
      <p className={styles.statusText}>Push notifications not supported.</p>
    );
  }

  async function sendTestNotification() {
    if ( subscription && message.trim() ) {
      const serializedSub = JSON.parse(
        JSON.stringify(
          subscription
        ),
      ) as WebPushSubscription;
      await sendNotification(
        message, serializedSub 
      );
      setMessage(
        '' 
      );
    }
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Push Notifications</h3>
      {isSubscribed
        ? (
            <div className={styles.flexGroup}>
              <p
                className={styles.statusText}
                style={{
                  color: '#16a34a',
                }}
              >
                Status: Subscribed
              </p>
              <button
                onClick={unsubscribeFromPush}
                className={`${ styles.button } ${ styles.btnGhost }`}
              >
                Unsubscribe
              </button>
              <div className={styles.row}>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Message..."
                  value={message}
                  onChange={(
                    e
                  ) => {
                    return setMessage(
                      e.target.value
                    );
                  }}
                />
                <button
                  onClick={sendTestNotification}
                  className={`${ styles.button } ${ styles.btnPrimary }`}
                >
                  Send Test
                </button>
              </div>
            </div>
          )
        : (
            <div>
              <p className={styles.statusText}>Not currently subscribed.</p>
              <button
                onClick={subscribeToPush}
                className={`${ styles.button } ${ styles.btnSuccess }`}
              >
                Enable Notifications
              </button>
            </div>
          )}
    </div>
  );
}

export function InstallPrompt() {
  const [
    isIOS,
    setIsIOS
  ] = useState(
    false
  );
  const [
    isStandalone,
    setIsStandalone
  ] = useState(
    false
  );

  useEffect(
    () => {
      const isIOSDevice
        = /iPad|iPhone|iPod/.test(
          navigator.userAgent
        ) && !( window as any ).MSStream;
      setIsIOS(
        isIOSDevice
      );
      setIsStandalone(
        window.matchMedia(
          '(display-mode: standalone)'
        ).matches
      );
    }, []
  );

  if ( isStandalone ) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Install App</h3>
      <button className={`${ styles.button } ${ styles.btnPrimary }`}>
        Add to Home Screen
      </button>
      {isIOS && (
        <p
          className={styles.statusText}
          style={{
            marginTop: '0.5rem',
          }}
        >
          Tap share icon ⎋ then Add to Home Screen ➕
        </p>
      )}
    </div>
  );
}
