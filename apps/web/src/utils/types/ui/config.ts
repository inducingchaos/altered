/**
 * @remarks The idea is to eventually have a "testing" window and/or toolbar that allows you to toggle the state, visibility, and other properties to view + UI test the component in every way possible - then verify & save the results in a code-versioning system that integrates with ALTERED. This way, not only will you have character version control - but feature version control for each part of your app.
 */

import { FlattenObjectToArrayLiteralUnion, TupleToObject } from ".."

export type InternalComponentConfig<DataStates extends readonly string[] = [], UIStates extends readonly string[] = []> = {
    State: Record<DataStates[number], UIStates[number][] | UIStates[number]>
}

export type DiscriminateStateConfig<Config extends Record<string, string | string[]>> = TupleToObject<FlattenObjectToArrayLiteralUnion<Config>, ["data", "ui"]>

export type InternalComponentProps<_StateConfig extends InternalComponentConfig["State"]> = { _config?: { state?: DiscriminateStateConfig<_StateConfig> } }
