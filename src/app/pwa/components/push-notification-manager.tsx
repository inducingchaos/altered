/**
 *
 */

import { type JSX } from "react"
import { usePWANotification } from "~/packages/sdkit/src/components/context-providers"

export function PushNotificationManager(): JSX.Element {
    const { isSupported, isGrantedPermission, isSubscribed, isInstalled, os, error, handleSubscribe, handleUnsubscribe } =
        usePWANotification()

    if (error)
        return (
            <>
                <p>{error.info?.external?.label}</p>
                <p>{error.info?.external?.message}</p>
            </>
        )

    if (!isInstalled)
        return (
            <div>
                <h3 className="text-24px font-bold">Install App</h3>
                <p>
                    {os === "iOS"
                        ? "To install this app on your iOS device: tap the share button, and then 'Add to Home Screen'."
                        : os === "Android"
                          ? "To install this app: tap the three-dot menu and select 'Install App' or 'Add to Home Screen'."
                          : "To install this app: click the install icon in your browser's address bar."}
                </p>
            </div>
        )

    if (!isSupported)
        return (
            <p className="text-center text-red-500">
                Push notifications are not supported in this browser. Consider adding to the home screen (PWA) if on iOS.
            </p>
        )

    if (isGrantedPermission === false)
        return (
            <p className="text-center text-red-600">
                You have denied permission for push notifications. To enable, please update your browser settings.
            </p>
        )

    if (!isSubscribed)
        return (
            <>
                <p>{"You are not subscribed to push notifications."}</p>
                <button className="bg-main text-alternate" onClick={handleSubscribe}>
                    {"Subscribe"}
                </button>
            </>
        )

    return (
        <>
            <p>{"You are subscribed to push notifications."}</p>
            <button className="bg-main text-alternate" onClick={handleUnsubscribe}>
                {"Unsubscribe"}
            </button>
        </>
    )
}
