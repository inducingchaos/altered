// /**
//  * Interface editor - edit components and operations.
//  */

// import { Interface } from "@altered/data/shapes"
// import { Action, ActionPanel, List, Icon } from "@raycast/api"
// import { useState } from "react"

// type InterfaceEditorProps = {
//     systemId: string
//     actionId: string
//     interfaceIndex: number
//     interface_: Interface
// }

// type ViewMode = "components" | "operations"

// export function InterfaceEditor({ systemId, actionId, interfaceIndex, interface_ }: InterfaceEditorProps) {
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const _ = { systemId, actionId, interfaceIndex } // Reserved for future use
//     const [viewMode, setViewMode] = useState<ViewMode>("components")

//     return (
//         <List
//             searchBarAccessory={
//                 <List.Dropdown tooltip="View Mode" value={viewMode} onChange={value => setViewMode(value as ViewMode)}>
//                     <List.Dropdown.Item value="components" title="Components" />
//                     <List.Dropdown.Item value="operations" title="Operations" />
//                 </List.Dropdown>
//             }
//         >
//             {viewMode === "components" ? (
//                 <List.Section title="Components">
//                     <List.Item
//                         title="Root Component"
//                         subtitle={interface_.components?.id ?? "None"}
//                         icon={Icon.Document}
//                         actions={
//                             <ActionPanel>
//                                 <Action
//                                     title="Edit Component"
//                                     icon={Icon.Pencil}
//                                     onAction={() => {
//                                         // TODO: Open component editor
//                                     }}
//                                 />
//                             </ActionPanel>
//                         }
//                     />
//                 </List.Section>
//             ) : (
//                 <List.Section title="Operations">{interface_.operations && interface_.operations.length > 0 ? interface_.operations.map((operation, index) => <List.Item key={index} title={operation.type === "operation" ? (operation.name ?? operation.id) : operation.name} subtitle={operation.type === "group" ? "Group" : "Operation"} icon={Icon.Gear} />) : <List.Item title="No Operations" subtitle="Add operations to this interface" icon={Icon.Plus} />}</List.Section>
//             )}
//         </List>
//     )
// }
