// /**
//  * Action Palette command - displays all available actions from systems.
//  */

// import { filterSystems } from "@altered/utils"
// import { Action, ActionPanel, Color, Grid, Icon } from "@raycast/api"
// import { createInterfaceAdapter } from "~/adapter"
// import { ActionPaletteProvider, useActionPalette } from "./provider"

// function ActionPaletteContent() {
//     const { state, actions, computed } = useActionPalette()

//     const filteredSystems = filterSystems(computed.systems, {
//         searchText: state.searchText,
//         searchableKeyPaths: ["name", "objectiveTitle", "objectiveDescription", "actions.name", "actions.deliverableTitle", "actions.deliverableDescription"]
//     })

//     // Conditionally render interface - but always call hooks in same order
//     if (computed.selectedAction && state.renderSelectedAction) {
//         const currentInterface = computed.selectedAction.interfaces[state.interfaceIndex]
//         if (currentInterface) {
//             return createInterfaceAdapter(currentInterface, computed.adapterContext)
//         }
//     }

//     return (
//         <Grid columns={8} inset={Grid.Inset.Large} isLoading={state.isLoading} searchBarAccessory={undefined} actions={undefined} filtering={false} searchBarPlaceholder="Search your ALTERED Systems..." searchText={state.searchText} onSearchTextChange={actions.onSearchTextChange} navigationTitle={computed.navigationTitle}>
//             {!state.isLoading &&
//                 filteredSystems.length > 0 &&
//                 filteredSystems.map(system => (
//                     <Grid.Section key={system.id} title={system.objectiveTitle} subtitle={system.name}>
//                         {system.actions.map(action => (
//                             <Grid.Item
//                                 key={action.id}
//                                 content={{ value: { source: action.icon, tintColor: Color.SecondaryText }, tooltip: action.name }}
//                                 title={action.name}
//                                 subtitle={action.launcherAlias}
//                                 actions={
//                                     <ActionPanel>
//                                         <Action
//                                             title={`Open ${action.name}`}
//                                             onAction={() => {
//                                                 actions.setSelectedActionId(action.id)
//                                                 actions.setRenderSelectedAction(true)
//                                             }}
//                                         />
//                                     </ActionPanel>
//                                 }
//                             />
//                         ))}
//                     </Grid.Section>
//                 ))}
//             {filteredSystems.length === 0 && <Grid.EmptyView icon={Icon.List} title="No results" description="Try a different search term." />}
//         </Grid>
//     )
// }

// export function ActionPalette() {
//     return (
//         <ActionPaletteProvider>
//             <ActionPaletteContent />
//         </ActionPaletteProvider>
//     )
// }
