// /**
//  * Actions list view for a system.
//  */

// import { System } from "@altered/data/shapes"
// import { Action, ActionPanel, List, Icon } from "@raycast/api"
// import { loadSystem, saveSystem } from "../../lib/storage/systems"
// import { CreateAction } from "./create-action"
// import { InterfacesList } from "./interfaces-list"
// import { NavigationHistory } from "../use-navigation-history"

// type ActionsListProps = {
//     systemId: string
//     system: System
//     navigation?: NavigationHistory
// }

// export function ActionsList({ systemId, system, navigation }: ActionsListProps) {
//     const handleDeleteAction = async (actionId: string) => {
//         const updatedSystem = await loadSystem(systemId)
//         if (updatedSystem) {
//             updatedSystem.actions = updatedSystem.actions.filter((a: { id: string }) => a.id !== actionId)
//             await saveSystem(updatedSystem)
//         }
//     }

//     return (
//         <List
//             searchBarPlaceholder="Search actions..."
//             actions={
//                 <ActionPanel>
//                     <Action.Push
//                         title="Create New Action"
//                         icon={Icon.Plus}
//                         shortcut={{ modifiers: ["cmd"], key: "n" }}
//                         target={
//                             <CreateAction
//                                 systemId={systemId}
//                                 onSave={async () => {
//                                     // Refresh will be handled by parent
//                                 }}
//                             />
//                         }
//                     />
//                 </ActionPanel>
//             }
//         >
//             {system.actions.length === 0 ? (
//                 <List.EmptyView icon={Icon.List} title="No Actions" description="Press Cmd+N to create your first action" />
//             ) : (
//                 system.actions.map(action => (
//                     <List.Item
//                         key={action.id}
//                         title={action.name}
//                         subtitle={action.deliverableTitle}
//                         icon={action.icon}
//                         actions={
//                             <ActionPanel>
//                                 <Action.Push title={`Open ${action.name}`} icon={Icon.ArrowRight} target={<InterfacesList systemId={systemId} actionId={action.id} action={action} />} />
//                                 <Action title="Delete Action" icon={Icon.Trash} style={Action.Style.Destructive} onAction={() => handleDeleteAction(action.id)} />
//                             </ActionPanel>
//                         }
//                     />
//                 ))
//             )}
//         </List>
//     )
// }
