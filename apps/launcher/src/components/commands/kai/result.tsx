/**
 *
 */

import { useEffect } from "react"
import {
    Action,
    ActionPanel,
    Clipboard,
    closeMainWindow,
    Detail,
    getPreferenceValues,
    Icon,
    popToRoot,
    showToast,
    Toast,
    useNavigation
} from "@raycast/api"
import { useMutation } from "@tanstack/react-query"

import { trpc } from "../../../lib/networking/rpc/client"

/**
 * @todo [P1] Replace when auth is implemented.
 */
const { "user-id": userId } = getPreferenceValues()

export function KAIResult({ prompt, setPrompt }: { prompt: string; setPrompt: (prompt: string) => void }) {
    const { pop } = useNavigation()

    const generateThought = useMutation(
        trpc.thoughts.generate.mutationOptions({
            onError: error => {
                showToast({
                    style: Toast.Style.Failure,
                    title: "Error Generating Thought",
                    message: "Unable to generate thought."
                })

                console.error(error.message)
            }
        })
    )

    useEffect(() => {
        generateThought.mutate({ userId, query: prompt })
    }, [prompt])

    const handleClose = async (copy: boolean = false) => {
        const shouldCopy = copy && generateThought.data

        if (shouldCopy) await Clipboard.copy(generateThought.data)

        popToRoot({ clearSearchBar: true })
        closeMainWindow()

        if (shouldCopy)
            showToast({
                style: Toast.Style.Success,
                title: "Thought Copied to Clipboard",
                message: "The generated thought has been copied to your clipboard."
            })
    }
    return (
        <Detail
            markdown={generateThought.data}
            actions={
                <ActionPanel>
                    <Action
                        title="Close"
                        icon={Icon.XMarkTopRightSquare}
                        shortcut={{ modifiers: [], key: "return" }}
                        onAction={handleClose}
                    />
                    <Action
                        title="Copy & Close"
                        icon={Icon.CopyClipboard}
                        shortcut={{ modifiers: ["shift"], key: "return" }}
                        onAction={() => handleClose(true)}
                    />
                    <Action
                        title="New Generation"
                        icon={Icon.PlusCircle}
                        shortcut={{ modifiers: ["cmd"], key: "n" }}
                        onAction={() => {
                            setPrompt("")
                            pop()
                        }}
                    />
                </ActionPanel>
            }
            isLoading={generateThought.isPending}
        />
    )
}
