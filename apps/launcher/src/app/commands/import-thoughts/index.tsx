/**
 *
 */

import type { CreatableThought } from "@altered/core"
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
import { useForm } from "@raycast/utils"
import { nanoid } from "nanoid"
import { type ComponentProps, useCallback } from "react"
import { api } from "~/api"
import { useAuthentication } from "~/auth"
import { configureLogger } from "~/observability"
import {
    AuthView,
    LogOutAction,
    ReturnToActionPaletteAction,
    withContext
} from "~/shared/components"
import { useActionPalette } from "../action-palette/state"
import {
    expandFilesystemPaths,
    getFileExtension,
    getFileMetadata,
    getFilenameWithoutExtension,
    isSupportedFileExtension,
    readTextFile
} from "./file-utils"

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

    /**
     * The name of the file (without the extension).
     */
    name: string

    /**
     * The file extension (with the dot).
     */
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
async function ingestImportSources(
    sourcePaths: string[]
): Promise<IngestImportSourcesResult> {
    const allFilePaths = await expandFilesystemPaths(sourcePaths)

    const sources = await Promise.all(
        allFilePaths.map(async (filePath): Promise<FileSource> => {
            const name = getFilenameWithoutExtension(filePath)
            const extension = getFileExtension(filePath)

            if (!isSupportedFileExtension(extension))
                return {
                    isSupported: false,

                    path: filePath,
                    name,
                    extension
                }

            try {
                const [content, metadata] = await Promise.all([
                    readTextFile(filePath),
                    getFileMetadata(filePath)
                ])

                return {
                    isSupported: true,

                    path: filePath,
                    name,
                    extension,

                    content,
                    metadata
                }
            } catch (error) {
                logger.error({
                    title: "Failed to Read File",
                    description: `Could not read file "${filePath}".`,
                    data: { error }
                })

                return {
                    isSupported: false,

                    path: filePath,
                    name,
                    extension
                }
            }
        })
    )

    const supportedSources = sources.filter(
        (source): source is SupportedFileSource => source.isSupported
    )

    const unsupportedSources = sources.filter(
        (source): source is UnsupportedFileSource => !source.isSupported
    )

    if (supportedSources.length === sources.length)
        return {
            supported: "all",
            sources: supportedSources
        }

    if (supportedSources.length === 0)
        return {
            supported: "none",
            sources: unsupportedSources
        }

    return {
        supported: "some",
        sources
    }
}

async function showUnsupportedFilesAlert(
    ingestedSources: IngestImportSourcesResult
): Promise<boolean> {
    const unsupportedFilesCount = ingestedSources.sources.filter(
        source => !source.isSupported
    ).length

    const skippedFilesPart = `${unsupportedFilesCount} file${unsupportedFilesCount > 1 ? "s" : ""} will be skipped.`

    const supportedFilesCount =
        ingestedSources.sources.length - unsupportedFilesCount

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

    return shouldContinue
}

function ImportThoughtsForm({ authToken }: { authToken: string }) {
    const actionPaletteContext = useActionPalette({ safe: true })

    const { handleSubmit, itemProps } = useForm<ImportThoughtsFormValues>({
        initialValues: {
            importSources: [],

            preserveCreatedDate: true,
            preserveModifiedDate: true,
            useFilenameAsAlias: false
        },

        validation: {
            importSources: value =>
                value?.length
                    ? undefined
                    : "At least one import source is required."
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
                const shouldContinue =
                    await showUnsupportedFilesAlert(sourcesResult)

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

            const supportedSources =
                sourcesResult.supported === "all"
                    ? sourcesResult.sources
                    : sourcesResult.sources.filter(
                          (source): source is SupportedFileSource =>
                              source.isSupported
                      )

            const thoughtsToCreate: CreatableThought[] = supportedSources.map(
                ({ name, content, metadata }) => ({
                    id: nanoid(),

                    alias: formValues.useFilenameAsAlias ? name : null,
                    content,

                    ...(formValues.preserveCreatedDate &&
                        metadata.createdAt && {
                            createdAt: metadata.createdAt
                        }),

                    ...(formValues.preserveModifiedDate &&
                        metadata.modifiedAt && {
                            updatedAt: metadata.modifiedAt
                        })
                })
            )

            const totalContentLength = thoughtsToCreate.reduce(
                (sum, thought) => sum + (thought.content?.length ?? 0),
                0
            )

            const { error } = await api.thoughts.createMany(
                { thoughts: thoughtsToCreate },
                { context: { authToken } }
            )

            if (error) {
                logger.error({
                    title: "Failed to Import Thoughts",
                    description: error.message,
                    data: { cause: error.cause }
                })

                await showToast({
                    style: Toast.Style.Failure,
                    title: "Failed to Import Thoughts",
                    message: "Please try again later."
                })

                return
            }

            if (actionPaletteContext) actionPaletteContext.resetState()
            else popToRoot({ clearSearchBar: true })

            const thoughtsCountPart = `Imported ${thoughtsToCreate.length} thought${thoughtsToCreate.length > 1 ? "s" : ""}`
            const thoughtsCharsPart = `(${totalContentLength.toLocaleString()} characters).`

            const message = `${thoughtsCountPart} ${thoughtsCharsPart}`

            await showToast({
                style: Toast.Style.Success,
                title: "Thoughts Imported",
                message
            })

            logger.log({
                title: "Import Complete",
                description: message,
                data: {
                    count: thoughtsToCreate.length,
                    totalContentLength
                }
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
