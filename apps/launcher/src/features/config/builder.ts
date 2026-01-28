/**
 *
 */

import type { Distill, Overwrite } from "~/shared/utils"

/**
 * Allows for the chaining of transformations on a config type.
 */
export class ConfigBuilder<
    ConfigBase,
    NarrowTypeToLiteral extends boolean,
    ConfigAccumulator = ConfigBase
> {
    private readonly transformers: Array<(config: unknown) => unknown>

    constructor(transformers: Array<(config: unknown) => unknown> = []) {
        this.transformers = transformers
    }

    /**
     * Add a transformation step that mutates or extends the properties of the config.
     */
    transform<
        const ConfigTransform,
        ConfigOutput = Distill<ConfigAccumulator & ConfigTransform>
    >(
        transformer: (
            config: Distill<ConfigAccumulator>
        ) => Distill<ConfigAccumulator> & ConfigTransform
    ): ConfigBuilder<ConfigBase, NarrowTypeToLiteral, ConfigOutput> {
        return new ConfigBuilder([
            ...this.transformers,
            transformer as (config: unknown) => unknown
        ])
    }

    /**
     * Provide default values for the config.
     */
    default<const ConfigDefaults extends Partial<ConfigAccumulator>>(
        defaults: ConfigDefaults
    ): ConfigBuilder<
        ConfigBase,
        NarrowTypeToLiteral,
        Distill<Overwrite<ConfigAccumulator, ConfigDefaults>>
    > {
        return new ConfigBuilder([
            ...this.transformers,
            (config: unknown) => ({ ...(config as object), ...defaults })
        ])
    }

    /**
     * Applies the builder transformations on the provided input.
     */
    create<
        ConfigInput extends ConfigBase,
        ConfigOutput = NarrowTypeToLiteral extends true
            ? Distill<Overwrite<ConfigAccumulator, ConfigInput>>
            : Distill<ConfigAccumulator>
    >(input: ConfigInput): ConfigOutput {
        let result: unknown = input

        for (const transformer of this.transformers)
            result = transformer(result)

        return result as ConfigOutput
    }
}

/**
 * Initializes a `ConfigBuilder` for the provided base type.
 */
export function defineConfig<
    ConfigBase,
    NarrowTypeToLiteral extends boolean = false
>(): ConfigBuilder<ConfigBase, NarrowTypeToLiteral> {
    return new ConfigBuilder()
}
