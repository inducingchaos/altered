/**
 *
 */

import type { ALTEREDAction, ALTEREDSystem } from "@altered/data/shapes"

type SearchableSystemKey = NonNullable<
    {
        [Key in keyof ALTEREDSystem]: ALTEREDSystem[Key] extends string
            ? Key
            : never
    }[keyof ALTEREDSystem]
>

type SearchableActionKey = NonNullable<
    {
        [Key in keyof ALTEREDAction]: ALTEREDAction[Key] extends
            | string
            | undefined
            ? Key
            : never
    }[keyof ALTEREDAction]
>

const actionKeyPathPrefix = "actions."

type SearchableKeyPath =
    | SearchableSystemKey
    | `${typeof actionKeyPathPrefix}${SearchableActionKey}`

type FilterSystemsOptions = {
    searchText: string
    searchableKeyPaths: SearchableKeyPath[]
}

const getSearchableValues = (
    system: ALTEREDSystem,
    action: ALTEREDAction,
    searchableKeyPaths: SearchableKeyPath[]
) => {
    return searchableKeyPaths.map(keyPath => {
        const isActionKey = keyPath.startsWith(actionKeyPathPrefix)

        const resolvedKey = isActionKey
            ? keyPath.slice(actionKeyPathPrefix.length)
            : keyPath

        if (isActionKey) return action[resolvedKey as SearchableActionKey]
        return system[resolvedKey as SearchableSystemKey]
    })
}

/**
 * Searches and filters a collection of ALTERED Systems and their Actions. Search is case-insensitive.
 */
export function filterSystems(
    systems: ALTEREDSystem[],
    { searchText, searchableKeyPaths }: FilterSystemsOptions
) {
    const results: ALTEREDSystem[] = []

    for (const system of systems) {
        for (const action of system.actions) {
            const searchableValues = getSearchableValues(
                system,
                action,
                searchableKeyPaths
            )

            const matchesSearchText = searchableValues
                .map(value => value?.toLowerCase())
                .some(value => value?.includes(searchText.toLowerCase()))

            if (matchesSearchText) {
                const existingSystem = results.find(
                    result => result.id === system.id
                )

                if (existingSystem) existingSystem.actions.push(action)
                else results.push({ ...system, actions: [action] })
            }
        }
    }

    return results
}
