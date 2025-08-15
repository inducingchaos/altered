/**
 *
 */

import { useState } from "react"
import { Action, ActionPanel, Form, LaunchProps, useNavigation } from "@raycast/api"
import { useForm } from "@raycast/utils"

import { withContext } from "../../ui/headless/context-providers"
import { KAIResult } from "./result"

interface KAIFormSchema {
    prompt: string
}

type KAIProps = LaunchProps<{ draftValues: KAIFormSchema }>

export default function KAI(props: KAIProps) {
    return withContext(<_KAI {...props} />)
}

function _KAI({ draftValues }: KAIProps) {
    const { push } = useNavigation()
    const [prompt, setPrompt] = useState<string | undefined>(draftValues?.prompt)

    const { handleSubmit, itemProps } = useForm<KAIFormSchema>({
        onSubmit: async values => push(withContext(<KAIResult prompt={values.prompt} setPrompt={setPrompt} />)),

        validation: {
            prompt: value => (!value ? "Prompt is required." : undefined)
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
            <Form.TextArea {...itemProps.prompt} title="Prompt" placeholder="Ask KAI..." value={prompt} onChange={setPrompt} />
        </Form>
    )
}
