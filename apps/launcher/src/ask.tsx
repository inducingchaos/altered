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
    Form,
    getPreferenceValues,
    LaunchProps,
    popToRoot,
    showToast,
    Toast,
    useNavigation
} from "@raycast/api"
import { useForm } from "@raycast/utils"
import { useMutation } from "@tanstack/react-query"

import { Layout } from "./ui/layout"
import { trpc } from "./utils/trpc"

const { "user-id": userId } = getPreferenceValues()

function GenerationResult({ prompt }: { prompt: string }) {
    const generateThought = useMutation(
        trpc.thoughts.generate.mutationOptions({
            onError: error => {
                showToast({
                    style: Toast.Style.Failure,
                    title: "Error Generating Thought",
                    message: error.message
                })

                console.error(error.message)
            }
        })
    )

    const { push } = useNavigation()

    useEffect(() => {
        generateThought.mutate({ userId, query: prompt })
    }, [prompt])

    return (
        <Detail
            markdown={generateThought.data}
            isLoading={generateThought.isPending}
            actions={
                <ActionPanel>
                    <Action
                        title="Close"
                        onAction={async () => {
                            popToRoot({ clearSearchBar: true })
                            closeMainWindow()
                        }}
                    />
                    <Action
                        title="Copy & Close"
                        shortcut={{ modifiers: ["shift"], key: "return" }}
                        onAction={async () => {
                            await Clipboard.copy(generateThought.data ?? "")

                            popToRoot({ clearSearchBar: true })
                            closeMainWindow()

                            showToast({
                                style: Toast.Style.Success,
                                title: "Generation Copied",
                                message: "The generated thought has been copied to your clipboard."
                            })
                        }}
                    />
                    <Action
                        title="New Generation"
                        shortcut={{ modifiers: ["cmd"], key: "n" }}
                        onAction={() => {
                            push(
                                <Layout>
                                    <_Generate initialValues={undefined} />
                                </Layout>
                            )
                        }}
                    />
                </ActionPanel>
            }
        />
    )
}

export default function Generate({ draftValues }: LaunchProps<{ draftValues: FormValues }>) {
    return (
        <Layout>
            <_Generate initialValues={draftValues} />
        </Layout>
    )
}

interface FormValues {
    prompt: string
}

function _Generate({ initialValues }: { initialValues: FormValues | undefined }) {
    const { prompt: initialPrompt } = initialValues ?? { prompt: "" }

    const { push } = useNavigation()

    const { handleSubmit, itemProps } = useForm<FormValues>({
        async onSubmit(values) {
            push(
                <Layout>
                    <GenerationResult prompt={values.prompt} />
                </Layout>
            )
        },

        validation: {
            prompt: value => {
                if (!value) return "Prompt is required."
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
        >
            <Form.TextArea
                title="Question"
                placeholder="Ask your brain..."
                {...itemProps.prompt}
                defaultValue={initialPrompt}
            />
        </Form>
    )
}
