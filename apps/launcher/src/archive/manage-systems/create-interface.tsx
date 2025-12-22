// /**
//  * Create Interface form.
//  */

// import { Interface } from "@altered/data/shapes"
// import { Action, ActionPanel, Form, Icon, popToRoot } from "@raycast/api"
// import { loadSystem, saveSystem } from "../../lib/storage/systems"

// type CreateInterfaceProps = {
//     systemId: string
//     actionId: string
//     onSave: () => void
// }

// export function CreateInterface({ systemId, actionId, onSave }: CreateInterfaceProps) {
//     const handleSubmit = async (values: { componentType: "list" | "markdown" }) => {
//         const system = await loadSystem(systemId)
//         if (!system) return

//                 const actionIndex = system.actions.findIndex((a: { id: string }) => a.id === actionId)
//         if (actionIndex < 0) return

//         const newInterface: Interface = {
//             components: values.componentType === "markdown" ? { id: "markdown", content: "" } : { id: "list", components: [] },
//             operations: []
//         }

//         system.actions[actionIndex].interfaces.push(newInterface)
//         await saveSystem(system)
//         onSave()
//         popToRoot()
//     }

//     return (
//         <Form
//             actions={
//                 <ActionPanel>
//                     <Action.SubmitForm title="Create Interface" icon={Icon.Plus} onSubmit={handleSubmit} />
//                 </ActionPanel>
//             }
//         >
//             <Form.Dropdown id="componentType" title="Root Component Type" defaultValue="markdown">
//                 <Form.Dropdown.Item value="markdown" title="Markdown" />
//                 <Form.Dropdown.Item value="list" title="List" />
//             </Form.Dropdown>
//         </Form>
//     )
// }
