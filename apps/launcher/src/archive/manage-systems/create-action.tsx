// /**
//  * Create Action form.
//  */

// import { Action as ALTEREDAction } from "@altered/data/shapes"
// import { Action, ActionPanel, Form, Icon, popToRoot } from "@raycast/api"
// import { nanoid } from "nanoid"
// import { loadSystem, saveSystem } from "../../lib/storage/systems"

// type CreateActionProps = {
//     systemId: string
//     onSave: () => void
// }

// export function CreateAction({ systemId, onSave }: CreateActionProps) {
//     const handleSubmit = async (values: { name: string; deliverableTitle: string; deliverableDescription: string; icon: string; launcherAlias?: string }) => {
//         const system = await loadSystem(systemId)
//         if (!system) return

//         const action: ALTEREDAction = {
//             id: nanoid(),
//             alias: values.name,
//             content: values.deliverableDescription,
//             name: values.name,
//             deliverableTitle: values.deliverableTitle,
//             deliverableDescription: values.deliverableDescription,
//             icon: values.icon,
//             launcherAlias: values.launcherAlias,
//             interfaces: []
//         }

//         system.actions.push(action)
//         await saveSystem(system)
//         onSave()
//         popToRoot()
//     }

//     return (
//         <Form
//             actions={
//                 <ActionPanel>
//                     <Action.SubmitForm title="Create Action" icon={Icon.Plus} onSubmit={handleSubmit} />
//                 </ActionPanel>
//             }
//         >
//             <Form.TextField id="name" title="Name" placeholder="My Action" defaultValue="" />
//             <Form.TextField id="deliverableTitle" title="Deliverable Title" placeholder="What this action delivers" defaultValue="" />
//             <Form.TextArea id="deliverableDescription" title="Deliverable Description" placeholder="Describe what this action does" defaultValue="" />
//             <Form.TextField id="icon" title="Icon" placeholder="Icon identifier" defaultValue="Icon.Document" />
//             <Form.TextField id="launcherAlias" title="Launcher Alias" placeholder="Optional shortcut alias" defaultValue="" />
//         </Form>
//     )
// }
