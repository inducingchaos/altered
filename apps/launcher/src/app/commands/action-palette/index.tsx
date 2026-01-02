/**
 *
 */

import { ALTEREDAction } from "@altered/data/shapes"
import { Action, ActionPanel, Color, Grid, Icon, List } from "@raycast/api"
import { useState } from "react"
import { createInterfaceAdapter } from "~/adapters"
import { config } from "~/config"
import { ContextProvider } from "~/shared/components"
import { ActionPaletteProvider, useActionPalette } from "./state"

function ActionPalette() {
    const [collectionLayout, setCollectionLayout] = useState<"grid" | "list">("list")

    const {
        isLoading,
        searchText,
        onSearchTextChange,
        selectedItemId,
        setSelectedItemId,

        selectedActionId,

        filteredSystems,
        renderedAction,
        navigationTitle,

        renderAction
    } = useActionPalette()

    if (renderedAction) return createInterfaceAdapter(renderedAction.interfaces, { platform: "raycast" })

    const isGrid = collectionLayout === "grid"
    const Collection = isGrid ? Grid : List

    const createActionImageProp = (action: ALTEREDAction) => ({ value: { source: action.icon ?? Icon.Box, tintColor: Color.SecondaryText }, tooltip: action.name })

    const ToggleLayoutAction = () => <Action title={`Change to ${collectionLayout === "grid" ? "List" : "Grid"} Layout`} onAction={() => setCollectionLayout(collectionLayout === "grid" ? "list" : "grid")} icon={collectionLayout === "grid" ? Icon.List : Icon.AppWindowGrid2x2} shortcut={{ modifiers: ["opt", "shift"], key: "l" }} />

    return (
        <Collection
            columns={7}
            inset={Grid.Inset.Large}
            isLoading={isLoading}
            searchBarAccessory={undefined}
            actions={
                <ActionPanel>
                    <ToggleLayoutAction />
                </ActionPanel>
            }
            filtering={false}
            searchBarPlaceholder="Search your ALTERED Systems..."
            searchText={searchText}
            selectedItemId={selectedActionId ?? selectedItemId ?? undefined}
            onSelectionChange={setSelectedItemId}
            onSearchTextChange={onSearchTextChange}
            navigationTitle={navigationTitle}
        >
            {filteredSystems.length ? (
                filteredSystems.map(system => (
                    <Collection.Section key={system.id} title={system.title} subtitle={system.name}>
                        {system.actions.map(action => (
                            <Collection.Item
                                id={action.id}
                                key={action.id}
                                title={action.name}
                                subtitle={isGrid ? action.trigger : action.description}
                                icon={config.themeIcons ? createActionImageProp(action) : undefined}
                                content={createActionImageProp(action)}
                                actions={
                                    <ActionPanel>
                                        <Action title={`Open ${action.name}`} onAction={() => renderAction(action.id)} icon={Icon.ArrowRightCircle} />

                                        <ActionPanel.Section title="Configure">
                                            <ToggleLayoutAction />
                                        </ActionPanel.Section>
                                    </ActionPanel>
                                }
                                accessories={action.trigger ? [{ tooltip: "The trigger for this action.", tag: { value: action.trigger, color: selectedActionId === action.id ? Color.PrimaryText : Color.SecondaryText } }] : undefined}
                            />
                        ))}
                    </Collection.Section>
                ))
            ) : (
                <Collection.EmptyView icon={Icon.Box} title="No Systems Found" description="Try a different search query." />
            )}
        </Collection>
    )
}

export function ActionPaletteCommand() {
    return (
        <ContextProvider>
            <ActionPaletteProvider>
                <ActionPalette />
            </ActionPaletteProvider>
        </ContextProvider>
    )
}
