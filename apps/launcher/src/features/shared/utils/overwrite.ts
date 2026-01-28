/**
 *
 */

/**
 * Like an intersection, but omits the type of the first property entirely.
 */
export type Overwrite<First, Second> = Second & Omit<First, keyof Second>
