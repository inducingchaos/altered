/**
 *
 */

import { Action, ActionPanel, Clipboard, closeMainWindow, Detail, Icon, Keyboard, popToRoot, PopToRootType, showToast, Toast } from "@raycast/api"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { api } from "~/api/react"
import { isVersionIncompatibleError as checkIsVersionIncompatibleError, VersionIncompatibleError } from "~/api/utils"
import { useAuthentication } from "~/auth"
import { config } from "~/config"
import { configureLogger } from "~/observability"
import { AuthView, LogOutAction, ReturnToActionPaletteAction, withContext } from "~/shared/components"
import { useActionPalette } from "../action-palette/state"

const logger = configureLogger({ defaults: { scope: "commands:connect-to-ai-provider" } })

type ProviderConfigValue = {
    name: string
    value: string | null
    displayValue?: string | null
    icon: Icon
    shortcutKey: Keyboard.KeyEquivalent
}

const createProviderConfigValues = ({ apiKey, displayApiKey }: { apiKey: string | null; displayApiKey: string | null }) =>
    [
        {
            name: "Base URL",
            value: `${config.baseUrl}/api/ai/chat/completions`,
            icon: Icon.Link,
            shortcutKey: "1"
        },
        {
            name: "API Key",
            value: apiKey,
            displayValue: displayApiKey,
            icon: Icon.Key,
            shortcutKey: "2"
        },
        {
            name: "Provider Name",
            value: "ALTERED",
            icon: Icon.Building,
            shortcutKey: "3"
        },
        {
            name: "Model Name",
            value: "kAI v1",
            icon: Icon.ComputerChip,
            shortcutKey: "4"
        },
        {
            name: "Model ID",
            value: "kai-v1",
            icon: Icon.TextSelection,
            shortcutKey: "5"
        }
    ] satisfies ProviderConfigValue[]

const createMarkdown = ({ configValues }: { configValues: ProviderConfigValue[] }) => {
    const parts: string[] = []

    parts.push("# Connect to the ALTERED AI Provider")

    parts.push("Use the configuration values below to connect to ALTERED's AI provider for use with Raycast AI and other OpenAI-compatible chat applications.")

    parts.push("## Configuration")

    for (const { name, value, displayValue, shortcutKey } of configValues) {
        parts.push(`### ${name}`)

        parts.push(`\`\`\`\n${displayValue ?? value ?? "loading..."}${value ? `  (copy with "cmd + ${shortcutKey}")` : ""}\n\`\`\``)
    }

    parts.push("## Usage")

    parts.push("### Personalized Context")

    parts.push("Once configured, the model will automatically include all of your ALTERED Thoughts as context.")

    parts.push("> *Dataset selection and model switching coming soon*")

    parts.push("---")

    parts.push("**Note:** Your API key is personalized and should be kept secure. It provides access to your ALTERED Brain and your account AI usage.")

    return parts.join("\n\n")
}

const CopyValuesActionMenu = ({ configValues, isFetching }: { configValues: ProviderConfigValue[]; isFetching: boolean }) => {
    return (
        <ActionPanel.Submenu title="Copy Values" isLoading={isFetching} icon={Icon.Clipboard} shortcut={{ modifiers: ["cmd"], key: "c" }}>
            {configValues.map(
                ({ name, value, icon, shortcutKey }) =>
                    !!value && (
                        <Action
                            key={name}
                            title={`Copy ${name}`}
                            icon={icon}
                            onAction={async () => {
                                await Clipboard.copy(value)

                                await closeMainWindow({ popToRootType: PopToRootType.Suspended })
                                await showToast({ title: `${name} Copied to Clipboard` })
                            }}
                            shortcut={{ modifiers: ["cmd"], key: shortcutKey }}
                        />
                    )
            )}
        </ActionPanel.Submenu>
    )
}

const RefreshValuesAction = ({ refresh }: { refresh: () => void }) => <Action title="Refresh Values" icon={Icon.RotateClockwise} onAction={refresh} shortcut={{ modifiers: ["cmd"], key: "r" }} />

const RevealSensitiveValuesAction = ({ isShowing, setIsShowing }: { isShowing: boolean; setIsShowing: (newValue: boolean) => void }) => <Action title={isShowing ? "Hide Sensitive Values" : "Show Sensitive Values"} icon={isShowing ? Icon.EyeDisabled : Icon.Eye} onAction={() => setIsShowing(!isShowing)} shortcut={{ modifiers: ["cmd"], key: "h" }} />

function ConnectToProviderDetail({ authToken }: { authToken: string }) {
    const actionPaletteContext = useActionPalette({ safe: true })

    const [isSensitiveValuesShowing, setIsSensitiveValuesShowing] = useState(false)

    const { isFetching, data, error, refetch: refresh } = useQuery(api.auth.apiKeys.get.queryOptions({ input: { query: { service: "ai-provider" } }, context: { authToken } }))

    if (error) {
        const isVersionIncompatibleError = checkIsVersionIncompatibleError(error)

        if (isVersionIncompatibleError) return <VersionIncompatibleError />

        showToast({
            style: Toast.Style.Failure,
            title: "Error Loading AI Provider Details",
            message: "Please try again later."
        })

        if (actionPaletteContext) actionPaletteContext.resetState()
        else popToRoot({ clearSearchBar: true })

        console.error(error)
    }

    const apiKey = data?.apiKey?.value ?? null

    const apiKeyPrefix = "altered_ai_"
    const apiKeyMaskLength = apiKey ? apiKey.length - apiKeyPrefix.length : null

    const maskedApiKey = apiKey && apiKeyMaskLength ? `${apiKeyPrefix}${"*".repeat(apiKeyMaskLength)}` : null
    const displayApiKey = isSensitiveValuesShowing ? apiKey : maskedApiKey

    const configValues = createProviderConfigValues({ apiKey, displayApiKey })
    const markdown = createMarkdown({ configValues })

    return (
        <Detail
            isLoading={isFetching}
            markdown={markdown}
            actions={
                <ActionPanel>
                    <CopyValuesActionMenu configValues={configValues} isFetching={isFetching} />

                    <ActionPanel.Section title="View">
                        <RevealSensitiveValuesAction isShowing={isSensitiveValuesShowing} setIsShowing={setIsSensitiveValuesShowing} />

                        <RefreshValuesAction refresh={refresh} />
                    </ActionPanel.Section>

                    <ActionPanel.Section title="Navigate">{actionPaletteContext && <ReturnToActionPaletteAction resetNavigationState={actionPaletteContext.resetState} />}</ActionPanel.Section>

                    <ActionPanel.Section title="Configure">{authToken && <LogOutAction />}</ActionPanel.Section>
                </ActionPanel>
            }
        />
    )
}

export function ConnectToAIProvider() {
    logger.log()

    const { isAuthed, token } = useAuthentication()
    if (!isAuthed) return <AuthView title="Authenticate to use the ALTERED AI provider." description="Sign in to access your ALTERED brain." />

    return <ConnectToProviderDetail authToken={token} />
}

export const ConnectToAIProviderCommand = withContext(ConnectToAIProvider)
