import { open, Toast } from "@raycast/api"

export default async function OpenChat() {
    try {
        await open("https://chat.altered.app")

        const toast = new Toast({
            style: Toast.Style.Success,
            title: "Opened Chat",
            message: "ALTERED Chat opened in browser."
        })

        toast.show()
    } catch {
        const toast = new Toast({
            style: Toast.Style.Failure,
            title: "Failed to open Chat",
            message: "Failed to open ALTERED Chat in browser."
        })

        toast.show()
    }
}
