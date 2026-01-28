/**
 * @remarks The component IDs and the component types themselves are somewhat expandable - so this could potentially be implemented client-side.
 *
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

import type { StatefulConstruct } from "../altered-constructs"

type BaseComponent = StatefulConstruct & {
    type: "component"

    componentId: string

    children?: Component[]
}

export type MarkdownComponent = BaseComponent & {
    componentId: "markdown"

    componentContent: string

    children?: never
}

/**
 * @remarks Could be renamed to something more brutalist like "dataset", but "collection" is semantically accurate.
 */
export type CollectionComponent = BaseComponent & {
    componentId: "collection"

    /**
     * @remarks This property introduces one-click dynamism between different layout styles - alternatively, this can be achieved by swapping components for their drop-in replacements. I like this approach because it upholds the principle of "less configuration, same result" that comes with an opinionated, customizable UI.
     */
    layout: "grid" | "list"

    /**
     * @remarks Collections can only contain "collection-group" or "collection-item" children.
     */
    children: (CollectionGroupComponent | CollectionItemComponent)[]
}

export type CollectionGroupComponent = BaseComponent & {
    componentId: "collection-group"

    title: string
    subtitle?: string

    /**
     * @remarks Collection groups can only contain "collection-item" children.
     */
    children: CollectionItemComponent[]
}

export type CollectionItemComponent = BaseComponent & {
    componentId: "collection-item"

    icon?: string
    title: string
    subtitle?: string

    /**
     * @remarks Collection items can only contain "collection-item-metadata" children.
     */
    children?: CollectionItemMetadataComponent[]
}

export type CollectionItemMetadataComponent = BaseComponent & {
    componentId: "collection-item-metadata"

    tooltip?: string

    children?: never
} & (
        | {
              text: string
              icon?: string
          }
        | {
              text?: string
              icon: string
          }
    )

type Component =
    | MarkdownComponent
    | CollectionComponent
    | CollectionGroupComponent
    | CollectionItemComponent
    | CollectionItemMetadataComponent

export type ALTEREDComponent = Component
