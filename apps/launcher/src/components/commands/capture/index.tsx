/**
 *
 */

import { useState } from "react"
import {
    Action,
    ActionPanel,
    Clipboard,
    closeMainWindow,
    Form,
    getPreferenceValues,
    getSelectedText,
    Icon,
    LaunchProps,
    popToRoot,
    showToast,
    Toast
} from "@raycast/api"
import { useForm } from "@raycast/utils"
import { useMutation } from "@tanstack/react-query"

import { trpc } from "../../../lib/networking/rpc/client"
import { withContext } from "../../ui/headless/context-providers"

/**
 * @todo [P1] Replace when auth is implemented.
 */
const { "user-id": userId } = getPreferenceValues()

interface CaptureFormSchema {
    content: string
}

type CustomCaptureProps = { inputMethod: "form" | "audio" | "selection" }
type CaptureProps = LaunchProps<{ draftValues: CaptureFormSchema }> & CustomCaptureProps

export function initCapture({ inputMethod }: CustomCaptureProps) {
    return (props: CaptureProps) => Capture({ ...props, inputMethod })
}

export default function Capture(props: CaptureProps) {
    return withContext(<_Capture {...props} />)
}

/**
 * @todo [P3] Implement the `inputMethod = "form"` prop when initializing from specialized commands.
 */
function _Capture({ draftValues }: CaptureProps) {
    const [content, setContent] = useState<string | undefined>(draftValues?.content)

    const toast = new Toast({
        style: Toast.Style.Animated,
        title: "Creating Thought"
    })

    const createThought = useMutation(
        trpc.thoughts.create.mutationOptions({
            onSuccess: async () => {
                toast.style = Toast.Style.Success
                toast.title = "Thought Created"
                toast.message = "Your thought has been created."

                await popToRoot({ clearSearchBar: true })
            },
            onError: error => {
                toast.style = Toast.Style.Failure
                toast.title = "Error Creating Thought"
                toast.message = "Unable to create thought."

                if (content) Clipboard.copy(content)
                console.error(error.message)
            }
        })
    )

    const { handleSubmit, itemProps } = useForm<CaptureFormSchema>({
        async onSubmit(values) {
            await closeMainWindow()
            await toast.show()

            createThought.mutate({ userId, content: values.content })
        },

        validation: { content: value => (!value ? "Content is required." : undefined) }
    })

    const insertFromSelection = async () => {
        try {
            const selection = await getSelectedText()
            if (!selection || !selection.length) {
                showToast({ title: "No Text Selected", style: Toast.Style.Failure })
                return
            }

            setContent((content ?? "") + selection)
        } catch (error) {
            showToast({ title: "Unable to Get Selection", style: Toast.Style.Failure })
            console.error(error)
        }
    }

    const recordAudio = async () => {
        console.log("recordAudio")
    }

    return (
        <Form
            enableDrafts
            actions={
                <ActionPanel>
                    <Action.SubmitForm onSubmit={handleSubmit} />
                    <ActionPanel.Section title="Import">
                        <Action
                            title={"Insert from Selection"}
                            icon={Icon.TextSelection}
                            onAction={insertFromSelection}
                            shortcut={{ modifiers: ["cmd", "shift"], key: "v" }}
                        />
                        <Action
                            title={"Record Audio"}
                            icon={Icon.Microphone}
                            onAction={recordAudio}
                            shortcut={{ modifiers: ["cmd", "shift"], key: "r" }}
                        />
                    </ActionPanel.Section>
                </ActionPanel>
            }
            isLoading={createThought.isPending}
        >
            <Form.TextArea
                {...itemProps.content}
                title="Content"
                placeholder="Your thought..."
                value={content}
                onChange={setContent}
            />
        </Form>
    )
}
