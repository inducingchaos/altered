/**
 *
 */

/**
 * Populates an area for variable text using the width of the widest possible text value.
 *
 * @todo [P4] Needs `className` adjustment.
 */
export function DynamicTextSizer({
    possibleValues,
    currentValue,
    className
}: {
    possibleValues: string[]
    currentValue: string
    className?: string
}) {
    return (
        <span className={`grid place-items-center ${className}`}>
            <span className="col-start-1 row-start-1">{currentValue}</span>
            {possibleValues.map(value => (
                <span
                    aria-hidden="true"
                    className="invisible col-start-1 row-start-1 block whitespace-nowrap"
                    key={value}
                >
                    {value}
                </span>
            ))}
        </span>
    )
}
