// /**
//  * Interfaces list view for an action.
//  */

// import { Action as ALTEREDAction } from "@altered/data/shapes"
// import { Action, ActionPanel, List, Icon } from "@raycast/api"
// import { loadSystem, saveSystem } from "../../lib/storage/systems"
// import { CreateInterface } from "./create-interface"
// import { InterfaceEditor } from "./interface-editor"

// type InterfacesListProps = {
//     systemId: string
//     actionId: string
//     action: ALTEREDAction
// }

// export function InterfacesList({ systemId, actionId, action }: InterfacesListProps) {
//     const handleDeleteInterface = async (interfaceIndex: number) => {
//         const system = await loadSystem(systemId)
//         if (!system) return

//                 const actionIndex = system.actions.findIndex((a: { id: string }) => a.id === actionId)
//         if (actionIndex >= 0) {
//             system.actions[actionIndex].interfaces.splice(interfaceIndex, 1)
//             await saveSystem(system)
//         }
//     }

//     return (
//         <List
//             searchBarPlaceholder="Search interfaces..."
//             actions={
//                 <ActionPanel>
//                     <Action.Push
//                         title="Create New Interface"
//                         icon={Icon.Plus}
//                         shortcut={{ modifiers: ["cmd"], key: "n" }}
//                         target={
//                             <CreateInterface
//                                 systemId={systemId}
//                                 actionId={actionId}
//                                 onSave={async () => {
//                                     // Refresh handled by parent
//                                 }}
//                             />
//                         }
//                     />
//                 </ActionPanel>
//             }
//         >
//             {action.interfaces.length === 0 ? (
//                 <List.EmptyView icon={Icon.Document} title="No Interfaces" description="Press Cmd+N to create your first interface" />
//             ) : (
//                 action.interfaces.map((interface_, index) => {
//                     const rootComponentId = interface_.components?.id ?? "unknown"
//                     return (
//                         <List.Item
//                             key={index}
//                             title={`Interface ${index + 1}`}
//                             subtitle={`Type: ${rootComponentId}`}
//                             icon={Icon.Document}
//                             actions={
//                                 <ActionPanel>
//                                     <Action.Push title="Edit Interface" icon={Icon.Pencil} target={<InterfaceEditor systemId={systemId} actionId={actionId} interfaceIndex={index} interface_={interface_} />} />
//                                     <Action title="Delete Interface" icon={Icon.Trash} style={Action.Style.Destructive} onAction={() => handleDeleteInterface(index)} />
//                                 </ActionPanel>
//                             }
//                         />
//                     )
//                 })
//             )}
//         </List>
//     )
// }
