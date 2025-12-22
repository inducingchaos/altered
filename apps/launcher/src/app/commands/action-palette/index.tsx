/**
 *
 */

import { Action, ActionPanel, Color, Grid, Icon } from "@raycast/api"
import { createInterfaceAdapter } from "~/adapters"
import { ActionPaletteProvider, useActionPalette } from "./state"

function ActionPalette() {
    const {
        isLoading,
        searchText,
        onSearchTextChange,
        selectedItemId,
        setSelectedItemId,

        selectedActionId,
        setSelectedActionId,
        renderSelectedAction,
        setRenderSelectedAction,

        filteredSystems,
        selectedAction,
        navigationTitle
    } = useActionPalette()

    if (selectedAction && renderSelectedAction) return createInterfaceAdapter(selectedAction.interfaces, { platform: "raycast" })

    return (
        <Grid columns={8} inset={Grid.Inset.Large} isLoading={isLoading} searchBarAccessory={undefined} actions={undefined} filtering={false} searchBarPlaceholder="Search your ALTERED Systems..." searchText={searchText} selectedItemId={selectedActionId ?? selectedItemId ?? undefined} onSelectionChange={setSelectedItemId} onSearchTextChange={onSearchTextChange} navigationTitle={navigationTitle}>
            {filteredSystems.length ? (
                filteredSystems.map(system => (
                    <Grid.Section key={system.id} title={system.title} subtitle={system.name}>
                        {system.actions.map(action => (
                            <Grid.Item
                                id={action.id}
                                key={action.id}
                                content={{ value: { source: action.icon ?? Icon.Box, tintColor: Color.SecondaryText }, tooltip: action.name }}
                                title={action.name}
                                subtitle={action.trigger}
                                actions={
                                    <ActionPanel>
                                        <Action
                                            title={`Open ${action.name}`}
                                            onAction={() => {
                                                setSelectedActionId(action.id)

                                                setRenderSelectedAction(true)
                                            }}
                                        />
                                    </ActionPanel>
                                }
                            />
                        ))}
                    </Grid.Section>
                ))
            ) : (
                <Grid.EmptyView icon={Icon.Box} title="No systems found" description="Try a different search query." />
            )}
        </Grid>
    )
}

export function ActionPaletteCommand() {
    return (
        <ActionPaletteProvider>
            <ActionPalette />
        </ActionPaletteProvider>
    )
}
