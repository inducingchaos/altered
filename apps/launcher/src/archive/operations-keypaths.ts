/**
 * Keypath resolution utilities for interface data binding.
 *
 * Keypaths use syntax like:
 * - "$title" - references top-level property
 * - "$content[0].title" - references array item property
 * - "$items[1].subtitle" - nested array access
 */

/**
 * Resolves a keypath string to a value from context data.
 *
 * @example
 * resolveKeypath("$title", { title: "Hello" }) // "Hello"
 * resolveKeypath("$content[0].title", { content: [{ title: "Item 1" }] }) // "Item 1"
 */
export function resolveKeypath(
  keypath: string,
  context: Record<string, unknown>,
): unknown {
  if (!keypath.startsWith("$")) {
    // Not a keypath, return as-is (literal value)
    return keypath;
  }

  const path = keypath.slice(1); // Remove "$"
  const parts = path.split(/[.[\]]/).filter(Boolean);

  let value: unknown = context;
  for (const part of parts) {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      value = (value as Record<string, unknown>)[part];
    } else if (Array.isArray(value)) {
      const index = parseInt(part, 10);
      if (!isNaN(index)) {
        value = value[index];
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Sets a value at a keypath in context data.
 *
 * @example
 * setKeypath("$title", "New Title", { title: "Old" }) // { title: "New Title" }
 */
export function setKeypath(
  keypath: string,
  value: unknown,
  context: Record<string, unknown>,
): void {
  if (!keypath.startsWith("$")) {
    return;
  }

  const path = keypath.slice(1);
  const parts = path.split(/[.[\]]/).filter(Boolean);

  let current: Record<string, unknown> = context;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const nextPart = parts[i + 1];
    const isNextArrayIndex = !isNaN(parseInt(nextPart, 10));

    if (!(part in current)) {
      current[part] = isNextArrayIndex ? [] : {};
    }

    const next = current[part];
    if (typeof next === "object" && next !== null) {
      current = next as Record<string, unknown>;
    } else {
      return; // Can't traverse
    }
  }

  const lastPart = parts[parts.length - 1];
  const isArrayIndex = !isNaN(parseInt(lastPart, 10));

  if (isArrayIndex) {
    const index = parseInt(lastPart, 10);
    if (Array.isArray(current)) {
      current[index] = value;
    }
  } else {
    current[lastPart] = value;
  }
}

/**
 * Deletes a value at a keypath in context data.
 *
 * @example
 * deleteKeypath("$items[0]", { items: [{ id: 1 }, { id: 2 }] }) // { items: [{ id: 2 }] }
 */
export function deleteKeypath(
  keypath: string,
  context: Record<string, unknown>,
): void {
  if (!keypath.startsWith("$")) {
    return;
  }

  const path = keypath.slice(1);
  const parts = path.split(/[.[\]]/).filter(Boolean);

  if (parts.length === 0) {
    return;
  }

  // Handle root-level deletion
  if (parts.length === 1) {
    const part = parts[0];
    const isArrayIndex = !isNaN(parseInt(part, 10));

    if (isArrayIndex) {
      const index = parseInt(part, 10);
      if (Array.isArray(context)) {
        context.splice(index, 1);
      }
    } else {
      delete context[part];
    }
    return;
  }

  // Navigate to parent
  let current: Record<string, unknown> = context;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];

    if (!(part in current)) {
      return; // Path doesn't exist
    }

    const next = current[part];
    if (typeof next === "object" && next !== null) {
      if (Array.isArray(next)) {
        const index = parseInt(part, 10);
        if (!isNaN(index) && index < next.length) {
          current = next[index] as Record<string, unknown>;
        } else {
          return;
        }
      } else {
        current = next as Record<string, unknown>;
      }
    } else {
      return; // Can't traverse
    }
  }

  // Delete the final property
  const lastPart = parts[parts.length - 1];
  const isArrayIndex = !isNaN(parseInt(lastPart, 10));

  if (isArrayIndex) {
    const index = parseInt(lastPart, 10);
    if (Array.isArray(current)) {
      current.splice(index, 1);
    }
  } else {
    delete current[lastPart];
  }
}

/**
 * Checks if a value is a keypath reference.
 */
export function isKeypath(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("$");
}
