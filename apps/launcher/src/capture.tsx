/**
 *
 */

import { Action, ActionPanel, closeMainWindow, Form, getPreferenceValues, popToRoot, Toast } from "@raycast/api"
import { useForm } from "@raycast/utils"
import { useMutation } from "@tanstack/react-query"

import { Layout } from "./ui/layout"
import { trpc } from "./utils/trpc"

const { "user-id": userId } = getPreferenceValues()

export default function CreateThought() {
    return (
        <Layout>
            <_CreateThought />
        </Layout>
    )
}

interface FormValues {
    content: string
}

function _CreateThought() {
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
            actions={
                <ActionPanel>
                    <Action.SubmitForm onSubmit={handleSubmit} />
                </ActionPanel>
            }
            isLoading={createData.isPending}
        >
            <Form.TextArea title="Content" placeholder="Thought content..." {...itemProps.content} />
        </Form>
    )
}
