/**
 *
 */

/**
 * Flattens type intersections and (optionally) removes undefined properties recursively.
 */
export type Distill<Value, StripUndefined = false> = {
    -readonly [Key in keyof Value as undefined extends Value[Key]
        ? StripUndefined extends true
            ? never
            : Key
        : Key]: Value[Key] extends object ? Distill<Value[Key]> : Value[Key]
} & {}
