// /**
//  * Component adapters - convert component definitions to Raycast UI components.
//  */

// import { Component, ListComponent, ListItemComponent, ListSectionComponent, MarkdownComponent } from "@altered/data/shapes"
// import { Detail, List } from "@raycast/api"
// import React from "react"
// import { InterfaceStateStoreHook } from "~/shared/stores/interface-state"
// import { createOperationAdapter } from "./adapter/operations/operations"
// import { OperationAdapterContext } from "./adapter/operations/context"
// import { ActionPanel } from "@raycast/api"

// /**
//  * Props for component adapters.
//  */
// type ComponentAdapterProps = {
//     component: Component
//     context: OperationAdapterContext
//     stateStore?: InterfaceStateStoreHook
// }

// /**
//  * Renders a markdown component.
//  */
// function renderMarkdownComponent(component: MarkdownComponent, props: ComponentAdapterProps): React.ReactNode {
//     const operations = component.operations ?? []
//     const operationsResult = createOperationAdapter(operations, props.context, undefined, props.stateStore, undefined, undefined, false)
//     const actionPanelElement = operationsResult.actionPanel as React.ReactElement<{ children?: React.ReactNode }>
//     const operationsElements = (actionPanelElement.props?.children || []) as React.ReactNode[]

//     return <Detail markdown={component.content} actions={<ActionPanel>{operationsElements}</ActionPanel>} />
// }

// /**
//  * Renders a list item component.
//  */
// function renderListItemComponent(component: ListItemComponent, props: ComponentAdapterProps): React.ReactNode {
//     const operations = component.operations ?? []
//     const operationsResult = createOperationAdapter(operations, props.context, undefined, props.stateStore, undefined, undefined, false)
//     const actionPanelElement = operationsResult.actionPanel as React.ReactElement<{ children?: React.ReactNode }>
//     const operationsElements = (actionPanelElement.props?.children || []) as React.ReactNode[]

//     return <List.Item key={component.id} title={component.title} subtitle={component.subtitle} icon={component.icon} accessories={component.label ? [{ text: component.label, icon: component.labelIcon }] : undefined} actions={<ActionPanel>{operationsElements}</ActionPanel>} />
// }

// /**
//  * Renders a list section component.
//  */
// function renderListSectionComponent(component: ListSectionComponent, props: ComponentAdapterProps): React.ReactNode {
//     const children = component.components ?? []
//     const childElements = children.map(child => renderComponent(child, props))

//     return (
//         <List.Section key={component.id} title={component.title} subtitle={component.subtitle}>
//             {childElements}
//         </List.Section>
//     )
// }

// /**
//  * Renders a list component.
//  */
// function renderListComponent(component: ListComponent, props: ComponentAdapterProps): React.ReactNode {
//     const children = component.components ?? []
//     const childElements = children.map(child => renderComponent(child, props))

//     return <List>{childElements}</List>
// }

// /**
//  * Renders a component based on its type.
//  */
// export function renderComponent(component: Component, props: ComponentAdapterProps): React.ReactNode {
//     switch (component.id) {
//         case "markdown":
//             return renderMarkdownComponent(component, props)
//         case "list":
//             return renderListComponent(component, props)
//         case "list-section":
//             return renderListSectionComponent(component, props)
//         case "list-item":
//             return renderListItemComponent(component, props)
//         default:
//             console.warn(`Unknown component type: ${(component as Component).id}`)
//             return null
//     }
// }
