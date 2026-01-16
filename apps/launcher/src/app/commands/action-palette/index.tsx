/**
 *
 */

import type { ALTEREDAction } from "@altered/data/shapes"
import { Action, ActionPanel, Color, Grid, Icon, List } from "@raycast/api"
import { useState } from "react"
import { createInterfaceAdapter } from "~/adapters"
import { config } from "~/config"
import { ContextProvider } from "~/shared/components"
import { ActionPaletteProvider, useActionPalette } from "./state"

function ActionPalette() {
    const [collectionLayout, setCollectionLayout] = useState<"grid" | "list">(
        "list"
    )

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

    if (renderedAction)
        return createInterfaceAdapter(renderedAction.interfaces, {
            platform: "raycast"
        })

    const isGrid = collectionLayout === "grid"
    const Collection = isGrid ? Grid : List

    const createActionImageProp = (action: ALTEREDAction) => ({
        value: {
            source: action.icon ?? Icon.Box,
            tintColor: Color.SecondaryText
        },
        tooltip: action.name
    })

    const ToggleLayoutAction = () => (
        <Action
            icon={
                collectionLayout === "grid" ? Icon.List : Icon.AppWindowGrid2x2
            }
            onAction={() =>
                setCollectionLayout(
                    collectionLayout === "grid" ? "list" : "grid"
                )
            }
            shortcut={{ modifiers: ["opt", "shift"], key: "l" }}
            title={`Change to ${collectionLayout === "grid" ? "List" : "Grid"} Layout`}
        />
    )

    return (
        <Collection
            actions={
                <ActionPanel>
                    <ToggleLayoutAction />
                </ActionPanel>
            }
            columns={7}
            filtering={false}
            inset={Grid.Inset.Large}
            isLoading={isLoading}
            navigationTitle={navigationTitle}
            onSearchTextChange={onSearchTextChange}
            onSelectionChange={setSelectedItemId}
            searchBarAccessory={undefined}
            searchBarPlaceholder="Search your ALTERED Systems..."
            searchText={searchText}
            selectedItemId={selectedActionId ?? selectedItemId ?? undefined}
        >
            {filteredSystems.length ? (
                filteredSystems.map(system => (
                    <Collection.Section
                        key={system.id}
                        subtitle={system.name}
                        title={system.title}
                    >
                        {system.actions.map(action => (
                            <Collection.Item
                                accessories={
                                    action.trigger
                                        ? [
                                              {
                                                  tooltip:
                                                      "The trigger for this action.",
                                                  tag: {
                                                      value: action.trigger,
                                                      color:
                                                          selectedActionId ===
                                                          action.id
                                                              ? Color.PrimaryText
                                                              : Color.SecondaryText
                                                  }
                                              }
                                          ]
                                        : undefined
                                }
                                actions={
                                    <ActionPanel>
                                        <Action
                                            icon={Icon.ArrowRightCircle}
                                            onAction={() =>
                                                renderAction(action.id)
                                            }
                                            title={`Open ${action.name}`}
                                        />

                                        <ActionPanel.Section title="Configure">
                                            <ToggleLayoutAction />
                                        </ActionPanel.Section>
                                    </ActionPanel>
                                }
                                content={createActionImageProp(action)}
                                icon={
                                    config.themeIcons
                                        ? createActionImageProp(action)
                                        : undefined
                                }
                                id={action.id}
                                key={action.id}
                                subtitle={
                                    isGrid ? action.trigger : action.description
                                }
                                title={action.name}
                            />
                        ))}
                    </Collection.Section>
                ))
            ) : (
                <Collection.EmptyView
                    description="Try a different search query."
                    icon={Icon.Box}
                    title="No Systems Found"
                />
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
