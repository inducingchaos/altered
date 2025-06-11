/**
 *
 */

import { Alert } from "react-native"

import { authClient } from "~/utils/auth"

export const useLogoutDialog = () => {
    const signOut = authClient.useSignOut()

    return {
        show: () =>
            Alert.alert(
                "Log Out?",
                "You will have to sign in again.",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Confirm",
                        style: "destructive",
                        onPress: () => {
                            void signOut()
                        }
                    }
                ],
                { cancelable: true }
            )
    }
}
