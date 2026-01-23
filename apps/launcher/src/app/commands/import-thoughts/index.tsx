/**
 *
 */

import {
    Action,
    ActionPanel,
    Alert,
    closeMainWindow,
    confirmAlert,
    Form,
    Icon,
    PopToRootType,
    popToRoot,
    showToast,
    Toast
} from "@raycast/api"
import { FormValidation, useForm } from "@raycast/utils"
import { type ComponentProps, useCallback } from "react"
import { useAuthentication } from "~/auth"
import { configureLogger } from "~/observability"
import {
    AuthView,
    LogOutAction,
    ReturnToActionPaletteAction,
    withContext
} from "~/shared/components"
import { useActionPalette } from "../action-palette/state"

const logger = configureLogger({
    defaults: { scope: "commands:import-thoughts" }
})

type ImportThoughtsFormValues = {
    importSources: string[]

    preserveCreatedDate: boolean
    preserveModifiedDate: boolean
    useFilenameAsAlias: boolean
}

/**
 * @todo [P4] Move to a shared location, such as `~/shared/components` or a "raycast/extended" package.
 *
 * @remarks Used to create artificial spacing between `Form` elements. This produces a significant visual improvement in aesthetics and readability.
 */
export function FormSpacer() {
    return <Form.Description text="" title="" />
}

/**
 * @todo [P4] Move to a shared location, such as `~/shared/components` or a "raycast/extended" package.
 */
export function FormSection({
    title,
    text,
    isLastSection = false,
    isCompact = false,
    children
}: {
    title: string
    text: string

    /**
     * Disables the trailing `Form.Separator`.
     */
    isLastSection?: boolean

    /**
     * Disables all artificial spacing.
     */
    isCompact?: boolean

    children: ComponentProps<typeof Form>["children"]
}) {
    return (
        <>
            <Form.Description text={text} title={title} />
            {!isCompact && <FormSpacer />}

            {children}
            {!isCompact && <FormSpacer />}

            {!isLastSection && <Form.Separator />}
        </>
    )
}

/**
 * @todo [P4] Move somewhere.
 */
export function createFormSection({
    name,
    description
}: {
    name: string
    description: string
}) {
    return (
        props: Omit<ComponentProps<typeof FormSection>, "title" | "text">
    ) => <FormSection text={description} title={name} {...props} />
}

/**
 * Returns a map of Raycast `Form.ItemProps` definitions from a form values object.
 *
 * @todo [P4] Move somewhere.
 */
export type ItemPropsFromFormValues<Values extends Record<string, unknown>> =
    ReturnType<typeof useForm<Values>>["itemProps"]

type ImportThoughtsItemProps = ItemPropsFromFormValues<ImportThoughtsFormValues>

const SourcesSection = createFormSection({
    name: "Sources",
    description: "The files and folders you want to import."
})

const ImportSourcesFilePicker = (
    props: ImportThoughtsItemProps["importSources"]
) => (
    <Form.FilePicker
        allowMultipleSelection
        canChooseDirectories
        canChooseFiles
        info="The files and folders to import."
        showHiddenFiles
        title=""
        {...props}
    />
)

const MetadataSection = createFormSection({
    name: "Metadata",
    description: "How to use the metadata of your files when importing."
})

const PreserveCreatedDateCheckbox = (
    props: ImportThoughtsItemProps["preserveCreatedDate"]
) => (
    <Form.Checkbox
        info="Use the file's creation date as the time the Thought was created."
        label="Preserve Created Date"
        storeValue
        {...props}
    />
)

const PreserveModifiedDateCheckbox = (
    props: ImportThoughtsItemProps["preserveModifiedDate"]
) => (
    <Form.Checkbox
        info="Use the file's modification date as the time the Thought was last updated."
        label="Preserve Modified Date"
        storeValue
        {...props}
    />
)

const OptionsSection = createFormSection({
    name: "Options",
    description: "More options to configure how files are imported."
})

const UseFilenameAsAliasCheckbox = (
    props: ImportThoughtsItemProps["useFilenameAsAlias"]
) => (
    <Form.Checkbox
        info="Use the filename (without the extension) as the Thought's alias."
        label="Use Filename as Alias"
        storeValue
        {...props}
    />
)

type FileSourceBase = {
    path: string
    name: string
    extension: string
}

type UnsupportedFileSource = FileSourceBase & {
    isSupported: false
}

type SupportedFileSource = FileSourceBase & {
    isSupported: true

    content: string

    metadata: {
        createdAt?: Date
        modifiedAt?: Date
    }
}

type FileSource = UnsupportedFileSource | SupportedFileSource

type IngestImportSourcesResult =
    | {
          supported: "all"
          sources: SupportedFileSource[]
      }
    | {
          supported: "some"
          sources: FileSource[]
      }
    | {
          supported: "none"
          sources: UnsupportedFileSource[]
      }

/**
 * @todo
 * - [P3] Consider expanding support for unrecognized filetypes using an intermediary UI.
 * - [P3] Add content-based validation (check by decoding as UTF-8) in addition to extension whitelist.
 */
// biome-ignore lint/suspicious/useAwait: Not implemented.
async function ingestImportSources(
    _sourcePaths: string[]
): Promise<IngestImportSourcesResult> {
    //  File validation and consumption logic will go here. The following code temporarily exists for UI testing.

    const mockSupportedSource: SupportedFileSource = {
        isSupported: true,
        path: "path/to/supported.txt",
        name: "supported.txt",
        extension: "txt",
        content: "Supported content",
        metadata: {
            createdAt: new Date(),
            modifiedAt: new Date()
        }
    }

    const mockUnsupportedSource: UnsupportedFileSource = {
        isSupported: false,
        path: "path/to/unsupported.txt",
        name: "unsupported.txt",
        extension: "txt"
    }

    const selector = Math.random()

    if (selector < 1 / 4) {
        return {
            supported: "all",
            sources: [mockSupportedSource]
        }
    }

    if (selector < 2 / 4) {
        return {
            supported: "some",
            sources: [mockSupportedSource, mockUnsupportedSource]
        }
    }

    if (selector < 3 / 4)
        return {
            supported: "none",
            sources: [mockUnsupportedSource]
        }

    return {
        supported: "all",
        sources: []
    }
}

function ImportThoughtsForm({ authToken: _authToken }: { authToken: string }) {
    const actionPaletteContext = useActionPalette({ safe: true })

    const { handleSubmit, itemProps } = useForm<ImportThoughtsFormValues>({
        initialValues: {
            importSources: [],

            preserveCreatedDate: true,
            preserveModifiedDate: true,
            useFilenameAsAlias: false
        },

        validation: {
            importSources: FormValidation.Required
        },

        onSubmit: async formValues => {
            logger.log({
                title: "Form Submitted",

                data: {
                    formValues: `${JSON.stringify(formValues).slice(0, 256)}...`
                }
            })

            const sourcesResult = await ingestImportSources(
                formValues.importSources
            )

            if (sourcesResult.supported === "none") {
                await showToast({
                    style: Toast.Style.Failure,
                    title: "Unsupported Selection",
                    message:
                        "The selection does not contain any supported files."
                })

                return
            }

            if (sourcesResult.supported === "some") {
                const unsupportedFilesCount = sourcesResult.sources.filter(
                    source => !source.isSupported
                ).length

                const skippedFilesPart = `${unsupportedFilesCount} file${unsupportedFilesCount > 1 ? "s" : ""} will be skipped.`

                const supportedFilesCount =
                    sourcesResult.sources.length - unsupportedFilesCount

                const supportedFilesPart = `Continue with ${supportedFilesCount} supported file${supportedFilesCount > 1 ? "s" : ""}?`

                const confirmationMessage = `${skippedFilesPart} ${supportedFilesPart}`

                const shouldContinue = await confirmAlert({
                    title: "Unsupported Files Found",
                    message: confirmationMessage,

                    primaryAction: {
                        title: "Continue",
                        style: Alert.ActionStyle.Default
                    },

                    dismissAction: {
                        title: "Cancel",
                        style: Alert.ActionStyle.Cancel
                    }
                })

                if (!shouldContinue) return
            }

            if (!sourcesResult.sources.length) {
                //  This edge case should only ever be hit if a selected folder (or multiple folders) do not contain any detectable files.

                await showToast({
                    style: Toast.Style.Failure,
                    title: "No Files to Import",
                    message: "No files were found in the selected folders."
                })

                return
            }

            await closeMainWindow({
                clearRootSearch: false,
                popToRootType: PopToRootType.Suspended
            })

            await showToast({
                style: Toast.Style.Animated,
                title: "Importing Thoughts..."
            })

            //  An API call should be made here.

            await new Promise(resolve => setTimeout(resolve, 3000))

            const mockImportSuccess: boolean = true

            //  Client-side character/file count logic should go somewhere here.

            const mockImportCount: number = 17
            const mockImportTotalChars: number = 1705

            if (actionPaletteContext) actionPaletteContext.resetState()
            else popToRoot({ clearSearchBar: true })

            if (!mockImportSuccess) {
                await showToast({
                    style: Toast.Style.Failure,
                    title: "Failed to Import Thoughts",
                    message:
                        "An unknown error occurred. Please try again later."
                })

                return
            }

            const thoughtsCountPart = `Imported ${mockImportCount} thought${mockImportCount > 1 ? "s" : ""}`
            const thoughtsCharsPart = `(${mockImportTotalChars.toLocaleString()} characters).`

            const message = `${thoughtsCountPart} ${thoughtsCharsPart}`

            await showToast({
                style: Toast.Style.Success,
                title: "Thoughts Imported",
                message
            })

            logger.log({
                title: "Import Complete",
                description: message
            })
        }
    })

    const createActions = useCallback(
        () => (
            <ActionPanel>
                <Action.SubmitForm
                    icon={Icon.Upload}
                    onSubmit={handleSubmit}
                    title="Import Thoughts"
                />

                <ActionPanel.Section title="Navigate">
                    {actionPaletteContext && (
                        <ReturnToActionPaletteAction
                            resetNavigationState={
                                actionPaletteContext.resetState
                            }
                        />
                    )}
                </ActionPanel.Section>

                <ActionPanel.Section title="Configure">
                    <LogOutAction />
                </ActionPanel.Section>
            </ActionPanel>
        ),
        [actionPaletteContext, handleSubmit]
    )

    return (
        <Form
            actions={createActions()}
            navigationTitle="Import Thoughts"
            searchBarAccessory={
                <Form.LinkAccessory
                    target="https://docs.altered.app/io/import-thoughts#overview"
                    text="Import Guide"
                />
            }
        >
            <SourcesSection>
                <ImportSourcesFilePicker {...itemProps.importSources} />
            </SourcesSection>

            <MetadataSection>
                <PreserveCreatedDateCheckbox
                    {...itemProps.preserveCreatedDate}
                />
                <PreserveModifiedDateCheckbox
                    {...itemProps.preserveModifiedDate}
                />
            </MetadataSection>

            <OptionsSection isLastSection>
                <UseFilenameAsAliasCheckbox {...itemProps.useFilenameAsAlias} />
            </OptionsSection>
        </Form>
    )
}

export function ImportThoughts() {
    logger.log()

    const { isAuthed, token } = useAuthentication()
    if (!isAuthed)
        return (
            <AuthView
                description="Sign in to import your Thoughts."
                title="Authenticate to access your ALTERED Brain."
            />
        )

    return <ImportThoughtsForm authToken={token} />
}

export const ImportThoughtsCommand = withContext(ImportThoughts)
