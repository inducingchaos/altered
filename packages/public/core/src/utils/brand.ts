/**
 * @todo [P4] Relocate to a lightweight utility package.
 */

declare const brand: unique symbol

export type Brand<Type, Name> = Type & { [brand]: Name }
