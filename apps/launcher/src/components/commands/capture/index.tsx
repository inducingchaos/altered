/**
 *
 */

import { Action, ActionPanel, closeMainWindow, Form, getPreferenceValues, LaunchProps, popToRoot, Toast } from "@raycast/api"
import { useForm } from "@raycast/utils"
import { useMutation } from "@tanstack/react-query"

import { trpc } from "../../../lib/networking/rpc/client"
import { ContextProvider } from "../../ui/headless/context-providers"

const { "user-id": userId } = getPreferenceValues()

interface FormValues {
    content: string
}

type CaptureProps = LaunchProps<{ draftValues: FormValues }> & { input: "text" | "voice" | "selection" }

export default function Capture({ draftValues }: CaptureProps) {
    return (
        <ContextProvider>
            <_CreateThought initialValues={draftValues} />
        </ContextProvider>
    )
}

export function initCapture({ input }: { input: "text" | "voice" | "selection" }) {
    return (props: CaptureProps) => Capture({ ...props, input })
}

function _CreateThought({ initialValues }: { initialValues: FormValues | undefined }) {
    const { content: initialContent } = initialValues ?? { content: "" }

    const toast = new Toast({
        style: Toast.Style.Animated,
        title: "Creating Thought"
    })

    const createData = useMutation(
        trpc.thoughts.create.mutationOptions({
            onSuccess: async () => {
                toast.style = Toast.Style.Success
                toast.title = "Thought Created"
                toast.message = "Your thought has been created."

                popToRoot({ clearSearchBar: true })
            },
            onError: error => {
                toast.style = Toast.Style.Failure
                toast.title = "Error Creating Thought"

                console.error(error.message)
            }
        })
    )

    const { handleSubmit, itemProps } = useForm<FormValues>({
        async onSubmit(values) {
            await closeMainWindow()
            await toast.show()

            createData.mutate({ userId, content: values.content })
        },

        validation: {
            content: value => {
                if (!value) return "Content is required."
            }
        }
    })

    return (
        <Form
            enableDrafts
            actions={
                <ActionPanel>
                    <Action.SubmitForm onSubmit={handleSubmit} />
                </ActionPanel>
            }
            isLoading={createData.isPending}
        >
            <Form.TextArea
                title="Content"
                placeholder="Your next idea..."
                {...itemProps.content}
                defaultValue={initialContent}
            />
        </Form>
    )
}

// /**
//  *
//  */

// import { Clipboard, closeMainWindow, getPreferenceValues, Toast } from "@raycast/api"

// import { trpcClient } from "./lib/networking/rpc/client"

// //  get from https://developers.raycast.com/api-reference/environment#example-3

// // import { getSelectedText, Clipboard, showToast, Toast } from "@raycast/api";

// // export default async function Command() {
// //   try {
// //     const selectedText = await getSelectedText();
// //     const transformedText = selectedText.toUpperCase();
// //     await Clipboard.paste(transformedText);
// //   } catch (error) {
// //     await showToast({
// //       style: Toast.Style.Failure,
// //       title: "Cannot transform text",
// //       message: String(error),
// //     });
// //   }
// // }

// export default async function Warp() {
//     const toast = new Toast({
//         style: Toast.Style.Animated,
//         title: "Warping Thought"
//     })

//     const content = await Clipboard.readText()

//     if (!content) {
//         toast.style = Toast.Style.Failure
//         toast.title = "No Content"
//         toast.message = "No content to warp."

//         toast.show()
//         return
//     }

//     await closeMainWindow()
//     await toast.show()

//     const { "user-id": userId } = getPreferenceValues()

//     try {
//         await trpcClient.thoughts.create.mutate({ userId, content })

//         toast.style = Toast.Style.Success
//         toast.title = "Thought Warped: " + content.slice(0, 8) + (content.length > 8 ? "..." : "")
//         toast.message = "Your thought has been warped."
//     } catch (error) {
//         toast.style = Toast.Style.Failure
//         toast.title = "Error Warping Thought"
//         toast.message = "Failed to warp your thought."

//         console.error(error)
//     }
// }
