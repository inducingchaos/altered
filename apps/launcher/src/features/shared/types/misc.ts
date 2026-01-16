/**
 * @todo [P4] Prune, clarify, and refactor to utils package.
 */

export type Expand<Type> = Type extends object
    ? { [Key in keyof Type]: Type[Key] }
    : Type

export type OverrideObjectProps<
    Base extends Record<string, unknown>,
    Override extends Record<string, unknown>
> = {
    [Key in keyof Base]: Key extends keyof Override ? Override[Key] : Base[Key]
}

export type OverrideObjectPropsWithNonNullable<
    Base extends Record<string, unknown>,
    Override extends Record<string, unknown>
> = {
    [Key in keyof Base]: Key extends keyof Override
        ? NonNullable<Override[Key]> extends never
            ? Base[Key]
            : Override[Key]
        : Base[Key]
}
