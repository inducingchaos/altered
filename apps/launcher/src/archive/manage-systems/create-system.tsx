// /**
//  * Create System form.
//  */

// import { System } from "@altered/data/shapes"
// import { Action, ActionPanel, Form, Icon } from "@raycast/api"
// import { nanoid } from "nanoid"
// import { saveSystem } from "../../lib/storage/systems"
// import { NavigationHistory } from "../use-navigation-history"
// import { useEffect, useRef } from "react"

// // TODO: Use logger when available
// const logger = {
//     info: (msg: string, data?: unknown) => console.log(`[create-system] ${msg}`, data),
//     warn: (msg: string, data?: unknown) => console.warn(`[create-system] ${msg}`, data),
//     error: (msg: string, data?: unknown) => console.error(`[create-system] ${msg}`, data)
// }

// type CreateSystemProps = {
//     onSave: () => void | Promise<void>
//     navigation?: NavigationHistory
// }

// export function CreateSystem({ onSave, navigation }: CreateSystemProps) {
//     // Store navigation in a ref to ensure we have the latest value
//     const navigationRef = useRef(navigation)

//     useEffect(() => {
//         logger.info("CreateSystem mounted/updated", { hasNavigation: !!navigation, hasPop: !!navigation?.pop })
//         navigationRef.current = navigation
//     }, [navigation])

//     const handleSubmit = async (values: { name: string; objectiveTitle: string; objectiveDescription: string }) => {
//         logger.info("Creating system", { name: values.name })

//         const system: System = {
//             id: nanoid(),
//             alias: values.name,
//             content: values.objectiveDescription,
//             name: values.name,
//             objectiveTitle: values.objectiveTitle,
//             objectiveDescription: values.objectiveDescription,
//             actions: []
//         }

//         try {
//             await saveSystem(system)
//             logger.info("System saved successfully", { systemId: system.id })

//             // Refresh systems list before popping - make sure it completes
//             await onSave()

//             // Use navigation from ref to ensure we have the latest value
//             const currentNavigation = navigationRef.current
//             if (currentNavigation) {
//                 logger.info("Popping navigation history", {
//                     hasNavigation: !!currentNavigation,
//                     historyLength: currentNavigation.history.length,
//                     canGoBack: currentNavigation.canGoBack,
//                     currentId: currentNavigation.current?.id
//                 })
//                 currentNavigation.pop()
//                 logger.info("After pop", {
//                     historyLength: currentNavigation.history.length,
//                     currentId: currentNavigation.current?.id
//                 })
//             } else {
//                 logger.warn("No navigation available, cannot pop", { navigation: currentNavigation ? "exists" : "undefined" })
//             }
//         } catch (error) {
//             logger.error("Failed to save system", { error, systemId: system.id })
//             throw error
//         }
//     }

//     return (
//         <Form
//             actions={
//                 <ActionPanel>
//                     <Action.SubmitForm title="Create System" icon={Icon.Plus} onSubmit={handleSubmit} />
//                 </ActionPanel>
//             }
//         >
//             <Form.TextField id="name" title="Name" placeholder="My System" defaultValue="" />
//             <Form.TextField id="objectiveTitle" title="Objective Title" placeholder="What this system does" defaultValue="" />
//             <Form.TextArea id="objectiveDescription" title="Objective Description" placeholder="Describe the purpose of this system" defaultValue="" />
//         </Form>
//     )
// }
