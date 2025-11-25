/**
 *
 */

export type TryCatchSuccess<Data> = { data: Data; error?: never }
export type TryCatchFailure<_Error extends Error = Error> = { data?: never; error: _Error }
export type TryCatchResult<Data, _Error extends Error = Error> = TryCatchSuccess<Data> | TryCatchFailure<_Error>
export type Thenable<Type, _Promise extends Promise<Type> = Promise<Type>> = Type | _Promise
export type Callable<Data, Function extends () => Data = () => Data> = Data | Function

export function isThenable<Type, _Promise extends Promise<Type>>(value: Thenable<Type>): value is _Promise {
    if (value instanceof Promise) return true

    //  Fallback for non-native Promises.

    return value !== null && (typeof value === "object" || typeof value === "function") && "then" in value && typeof (value as { then: unknown }).then === "function"
}

export function isCallable<Data, Function extends () => Data>(action: Callable<Data>): action is Function {
    return typeof action === "function" && !isThenable(action)
}

export async function tryCatch<Data, _Error extends Error>(action: Callable<Thenable<Data>>): Promise<TryCatchResult<Data, _Error>> {
    try {
        if (isCallable(action)) {
            const result = action()

            return isThenable(result) ? { data: await result } : { data: result }
        }

        return isThenable(action) ? { data: await action } : { data: action }
    } catch (error) {
        return { error: error as _Error }
    }
}
