/**
 *
 */

export type ObjectKeysToLiteralUnion<
    Object extends Record<string, string> | undefined
> = Object extends undefined ? undefined : keyof Object

export type FlattenObjectPropToArray<
    Key extends string,
    Value extends string | string[]
> = Value extends string
    ? [Key, Value]
    : Value extends string[]
      ? Value[number] extends infer ArrayValue
          ? ArrayValue extends string
              ? [Key, ArrayValue]
              : never
          : never
      : never

export type FlattenObjectToArrayLiteralUnion<
    Object extends Record<string, string | string[]>
> = {
    [Key in keyof Object]: Object[Key] extends string | string[]
        ? FlattenObjectPropToArray<Key & string, Object[Key]>
        : never
}[keyof Object]

export type TupleToObject<
    Tuple extends readonly unknown[],
    Keys extends readonly string[]
> = Tuple extends readonly [infer First, ...infer Rest]
    ? Keys extends readonly [infer FirstKey, ...infer RestKeys]
        ? FirstKey extends string
            ? RestKeys extends readonly string[]
                ? { [_ in FirstKey]: First } & TupleToObject<Rest, RestKeys>
                : never
            : never
        : never
    : unknown
