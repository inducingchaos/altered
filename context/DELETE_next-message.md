Can you:

- Make the select trigger a bit wider because it's currently cutting off the contained text, and make it some smaller numbers for testing like 1, 2, 3, 5, 10, 15, 25, 50
- Make the search row detachable (and detach it above), expand the input area to fill the row because it's currently 180x32 with a bg of 151515 (maybe refactor into a shadcn input group: https://ui.shadcn.com/docs/components/input-group )
- Also remove the columns visibility toggle button. Instead, when we click on any column header (not right click) it should open a shadcn dialog with some info about the schema, and the ability to toggle each row's visibility via a checkbox
- Convert the tailwind gradient fade out to a gradient mask
- Make the footer row detachable too and detach it (gap between table and footer row
- You manually put tracking-tighter on all components, I don't want that I want a tailwind css selector for the specific font in the root layout
- Our checkboxes aren't perfectly centered. The header row checkbox has whitespace of 44-36-50 top-left-bottom unchecked, and 41-36-53 checked (shifting on check). Let's resolve this one first, and then we will focus on the table row checkboxes.
- Everywhere we have a border, it should be border-foreground/12.5
- No value should wrap by default - they should all have the gradient mash proportionate to the size of the cell. We should have an option to allow wrapping that's controlled by the schema, just like the column visibility

And I think we can use one of these tailwind helpers to make it simpler:

```
mask-[<value>]
mask-image: <value>;
mask-(<custom-property>)
mask-image: var(<custom-property>);
mask-none
mask-image: none;
mask-linear-<number>
mask-image: linear-gradient(<number>deg, black var(--tw-mask-linear-from)), transparent var(--tw-mask-linear-to));
-mask-linear-<number>
mask-image: linear-gradient(calc(<number>deg * -1), black var(--tw-mask-linear-from)), transparent var(--tw-mask-linear-to));
mask-linear-from-<number>
mask-image: linear-gradient(var(--tw-mask-linear-position), black calc(var(--spacing) * <number>), transparent var(--tw-mask-linear-to));
mask-linear-from-<percentage>
mask-image: linear-gradient(var(--tw-mask-linear-position), black <percentage>, transparent var(--tw-mask-linear-to));
mask-linear-from-<color>
mask-image: linear-gradient(var(--tw-mask-linear-position), <color> var(--tw-mask-linear-from), transparent var(--tw-mask-linear-to));
mask-linear-from-(<custom-property>)
mask-image: linear-gradient(var(--tw-mask-linear-position), black <custom-property>, transparent var(--tw-mask-linear-to));
mask-linear-from-[<value>]
mask-image: linear-gradient(var(--tw-mask-linear-position), black <value>, transparent var(--tw-mask-linear-to));
mask-linear-to-<number>
mask-image: linear-gradient(var(--tw-mask-linear-position), black var(--tw-mask-linear-from), transparent calc(var(--spacing) * <number>));
mask-linear-to-<percentage>
mask-image: linear-gradient(var(--tw-mask-linear-position), black var(--tw-mask-linear-from), transparent <percentage>);
mask-linear-to-<color>
mask-image: linear-gradient(var(--tw-mask-linear-position), black var(--tw-mask-linear-from), <color> var(--tw-mask-linear-to));
mask-linear-to-(<custom-property>)
mask-image: linear-gradient(var(--tw-mask-linear-position), black var(--tw-mask-linear-from), transparent var(<custom-property>));
mask-linear-to-[<value>]
mask-image: linear-gradient(var(--tw-mask-linear-position), black var(--tw-mask-linear-from), transparent <value>);
mask-t-from-<number>
mask-image: linear-gradient(to top, black calc(var(--spacing) * <number>), transparent var(--tw-mask-top-to));
mask-t-from-<percentage>
mask-image: linear-gradient(to top, black <percentage>, transparent var(--tw-mask-top-to));
mask-t-from-<color>
mask-image: linear-gradient(to top, <color> var(--tw-mask-top-from), transparent var(--tw-mask-top-to));
mask-t-from-(<custom-property>)
mask-image: linear-gradient(to top, black var(<custom-property>), transparent var(--tw-mask-top-to));
mask-t-from-[<value>]
mask-image: linear-gradient(to top, black <value>, transparent var(--tw-mask-top-to));
mask-t-to-<number>
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), transparent calc(var(--spacing) * <number>));
mask-t-to-<percentage>
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), transparent <percentage>);
mask-t-to-<color>
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), <color> var(--tw-mask-top-to));
mask-t-to-(<custom-property>)
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), transparent var(<custom-property>));
mask-t-to-[<value>]
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), transparent <value>);
mask-r-from-<number>
mask-image: linear-gradient(to right, black calc(var(--spacing) * <number>), transparent var(--tw-mask-right-to));
mask-r-from-<percentage>
mask-image: linear-gradient(to right, black <percentage>, transparent var(--tw-mask-right-to));
mask-r-from-<color>
mask-image: linear-gradient(to right, <color> var(--tw-mask-right-from), transparent var(--tw-mask-right-to));
mask-r-from-(<custom-property>)
mask-image: linear-gradient(to right, black var(<custom-property>), transparent var(--tw-mask-right-to));
mask-r-from-[<value>]
mask-image: linear-gradient(to right, black <value>, transparent var(--tw-mask-right-to));
mask-r-to-<number>
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), transparent calc(var(--spacing) * <number>));
mask-r-to-<percentage>
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), transparent <percentage>);
mask-r-to-<color>
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), <color> var(--tw-mask-right-to));
mask-r-to-(<custom-property>)
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), transparent var(<custom-property>));
mask-r-to-[<value>]
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), transparent <value>);
mask-b-from-<number>
mask-image: linear-gradient(to bottom, black calc(var(--spacing) * <number>), transparent var(--tw-mask-bottom-to));
mask-b-from-<percentage>
mask-image: linear-gradient(to bottom, black <percentage>, transparent var(--tw-mask-bottom-to));
mask-b-from-<color>
mask-image: linear-gradient(to bottom, <color> var(--tw-mask-bottom-from), transparent var(--tw-mask-bottom-to));
mask-b-from-(<custom-property>)
mask-image: linear-gradient(to bottom, black var(<custom-property>), transparent var(--tw-mask-bottom-to));
mask-b-from-[<value>]
mask-image: linear-gradient(to bottom, black <value>, transparent var(--tw-mask-bottom-to));
mask-b-to-<number>
mask-image: linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent calc(var(--spacing) * <number>));
mask-b-to-<percentage>
mask-image: linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent <percentage>);
mask-b-to-<color>
mask-image: linear-gradient(to bottom, black var(--tw-mask-bottom-from), <color> var(--tw-mask-bottom-to));
mask-b-to-(<custom-property>)
mask-image: linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent var(<custom-property>));
mask-b-to-[<value>]
mask-image: linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent <value>);
mask-l-from-<number>
mask-image: linear-gradient(to left, black calc(var(--spacing) * <number>), transparent var(--tw-mask-left-to));
mask-l-from-<percentage>
mask-image: linear-gradient(to left, black <percentage>, transparent var(--tw-mask-left-to));
mask-l-from-<color>
mask-image: linear-gradient(to left, <color> var(--tw-mask-left-from), transparent var(--tw-mask-left-to));
mask-l-from-(<custom-property>)
mask-image: linear-gradient(to left, black var(<custom-property>), transparent var(--tw-mask-left-to));
mask-l-from-[<value>]
mask-image: linear-gradient(to left, black <value>, transparent var(--tw-mask-left-to));
mask-l-to-<number>
mask-image: linear-gradient(to left, black var(--tw-mask-left-from), transparent calc(var(--spacing) * <number>));
mask-l-to-<percentage>
mask-image: linear-gradient(to bottom, black var(--tw-mask-left-from), transparent <percentage>);
mask-l-to-<color>
mask-image: linear-gradient(to bottom, black var(--tw-mask-left-from), <color> var(--tw-mask-left-to));
mask-l-to-(<custom-property>)
mask-image: linear-gradient(to left, black var(--tw-mask-left-from), transparent var(<custom-property>));
mask-l-to-[<value>]
mask-image: linear-gradient(to left, black var(--tw-mask-left-from), transparent <value>);
mask-y-from-<number>
mask-image: linear-gradient(to top, black calc(var(--spacing) * <number>), transparent var(--tw-mask-top-to)), linear-gradient(to bottom, black calc(var(--spacing) * <number>), transparent var(--tw-mask-bottom-to));
mask-composite: intersect;
mask-y-from-<percentage>
mask-image: linear-gradient(to top, black <percentage>, transparent var(--tw-mask-top-to)), linear-gradient(to bottom, black <percentage>, transparent var(--tw-mask-bottom-to));
mask-composite: intersect;
mask-y-from-<color>
mask-image: linear-gradient(to top, <color> var(--tw-mask-top-from), transparent var(--tw-mask-top-to)), linear-gradient(to bottom, <color> var(--tw-mask-bottom-from), transparent var(--tw-mask-bottom-to));
mask-composite: intersect;
mask-y-from-(<custom-property>)
mask-image: linear-gradient(to top, black var(<custom-property>), transparent var(--tw-mask-top-to)), linear-gradient(to bottom, black var(<custom-property>), transparent var(--tw-mask-bottom-to));
mask-composite: intersect;
mask-y-from-[<value>]
mask-image: linear-gradient(to top, black <value>, transparent var(--tw-mask-top-to)), linear-gradient(to bottom, black <value>, transparent var(--tw-mask-bottom-to));
mask-composite: intersect;
mask-y-to-<number>
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), transparent calc(var(--spacing) * <number>)), linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent calc(var(--spacing) * <number>));
mask-composite: intersect;
mask-y-to-<percentage>
mask-image: linear-gradient(to bottom, black var(--tw-mask-top-from), transparent <percentage>), linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent <percentage>);
mask-composite: intersect;
mask-y-to-<color>
mask-image: linear-gradient(to bottom, black var(--tw-mask-top-from), <color> var(--tw-mask-top-to)), linear-gradient(to bottom, black var(--tw-mask-bottom-from), <color> var(--tw-mask-bottom-to));
mask-composite: intersect;
mask-y-to-(<custom-property>)
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), transparent var(<custom-property>)),linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent var(<custom-property>));
mask-composite: intersect;
mask-y-to-[<value>]
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), transparent <value>),linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent <value>);
mask-composite: intersect;
mask-x-from-<number>
mask-image: linear-gradient(to right, black calc(var(--spacing) * <number>), transparent var(--tw-mask-right-to)), linear-gradient(to left, black calc(var(--spacing) * <number>), transparent var(--tw-mask-left-to));
mask-composite: intersect;
mask-x-from-<percentage>
mask-image: linear-gradient(to right, black <percentage>, transparent var(--tw-mask-right-to)), linear-gradient(to left, black <percentage>, transparent var(--tw-mask-left-to));
mask-composite: intersect;
mask-x-from-<color>
mask-image: linear-gradient(to right, <color> var(--tw-mask-right-from), transparent var(--tw-mask-right-to)), linear-gradient(to left, <color>  var(--tw-mask-left-from), transparent var(--tw-mask-left-to));
mask-composite: intersect;
mask-x-from-(<custom-property>)
mask-image: linear-gradient(to right, black var(<custom-property>), transparent var(--tw-mask-right-to)), linear-gradient(to left, black var(<custom-property>), transparent var(--tw-mask-left-to));
mask-composite: intersect;
mask-x-from-[<value>]
mask-image: linear-gradient(to right, black <value>, transparent var(--tw-mask-right-to)), linear-gradient(to left, black <value>, transparent var(--tw-mask-left-to));
mask-composite: intersect;
mask-x-to-<number>
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), transparent calc(var(--spacing) * <number>)), linear-gradient(to left, black var(--tw-mask-left-from), transparent calc(var(--spacing) * <number>));
mask-composite: intersect;
mask-x-to-<percentage>
mask-image: linear-gradient(to left, black var(--tw-mask-right-from), transparent <percentage>), linear-gradient(to left, black var(--tw-mask-left-from), transparent <percentage>);
mask-composite: intersect;
mask-x-to-<color>
mask-image: linear-gradient(to left, black var(--tw-mask-right-from), <color> var(--tw-mask-right-to)), linear-gradient(to left, black var(--tw-mask-left-from), <color> var(--tw-mask-left-to));
mask-composite: intersect;
mask-x-to-(<custom-property>)
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), transparent var(<custom-property>)),linear-gradient(to left, black var(--tw-mask-left-from), transparent var(<custom-property>));
mask-composite: intersect;
mask-x-to-[<value>]
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), transparent <value>),linear-gradient(to left, black var(--tw-mask-left-from), transparent <value>);
mask-composite: intersect;
mask-radial-[<value>]
mask-image: radial-gradient(<value>);
mask-radial-[<size>]
--tw-mask-radial-size: <size>;
mask-radial-[<size>_<size>]
--tw-mask-radial-size: <size> <size>;
mask-radial-from-<number>
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black calc(var(--spacing) * <number>), transparent var(--tw-mask-radial-to));
mask-radial-from-<percentage>
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black <percentage>, transparent var(--tw-mask-radial-to));
mask-radial-from-<color>
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), <color> var(--tw-mask-radial-from), transparent var(--tw-mask-radial-to));
mask-radial-from-(<custom-property>)
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black var(<custom-property>), transparent var(--tw-mask-radial-to));
mask-radial-from-[<value>]
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black <value>, transparent var(--tw-mask-radial-to));
mask-radial-to-<number>
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black var(--tw-mask-radial-from), transparent calc(var(--spacing) * <number>));
mask-radial-to-<percentage>
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black var(--tw-mask-radial-from), transparent <percentage>);
mask-radial-to-<color>
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black var(--tw-mask-radial-from), <color> var(--tw-mask-radial-to));
mask-radial-to-(<custom-property>)
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black var(--tw-mask-radial-from), transparent var(<custom-property>));
mask-radial-to-[<value>]
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black var(--tw-mask-radial-from), transparent <value>);
mask-circle
--tw-mask-radial-shape: circle;
mask-ellipse
--tw-mask-radial-shape: ellipse;
mask-radial-closest-corner
--tw-mask-radial-size: closest-corner;
mask-radial-closest-side
--tw-mask-radial-size: closest-side;
mask-radial-farthest-corner
--tw-mask-radial-size: farthest-corner;
mask-radial-farthest-side
--tw-mask-radial-size: farthest-side;
mask-radial-at-top-left
--tw-mask-radial-position: top left;
mask-radial-at-top
--tw-mask-radial-position: top;
mask-radial-at-top-right
--tw-mask-radial-position: top right;
mask-radial-at-left
--tw-mask-radial-position: left;
mask-radial-at-center
--tw-mask-radial-position: center;
mask-radial-at-right
--tw-mask-radial-position: right;
mask-radial-at-bottom-left
--tw-mask-radial-position: bottom left;
mask-radial-at-bottom
--tw-mask-radial-position: bottom;
mask-radial-at-bottom-right
--tw-mask-radial-position: bottom right;
mask-conic-<number>
mask-image: conic-gradient(from <number>deg, black var(--tw-mask-conic-from), transparent var(--tw-mask-conic-to));
-mask-conic-<number>
mask-image: conic-gradient(from calc(<number>deg * -1), black var(--tw-mask-conic-from), transparent var(--tw-mask-conic-to));
mask-conic-from-<number>
mask-image: conic-gradient(from var(--tw-mask-conic-position), black calc(var(--spacing) * <number>), transparent var(--tw-mask-conic-to));
mask-conic-from-<percentage>
mask-image: conic-gradient(from var(--tw-mask-conic-position), black <percentage>, transparent var(--tw-mask-conic-to));
mask-conic-from-<color>
mask-image: conic-gradient(from var(--tw-mask-conic-position), <color> var(--tw-mask-conic-from), transparent var(--tw-mask-conic-to));
mask-conic-from-(<custom-property>)
mask-image: conic-gradient(from var(--tw-mask-conic-position), black var(<custom-property>), transparent var(--tw-mask-conic-to));
mask-conic-from-[<value>]
mask-image: conic-gradient(from var(--tw-mask-conic-position), black <value>, transparent var(--tw-mask-conic-to));
mask-conic-to-<number>
mask-image: conic-gradient(from var(--tw-mask-conic-position), black var(--tw-mask-conic-from), transparent calc(var(--spacing) * <number>));
mask-conic-to-<percentage>
mask-image: conic-gradient(from var(--tw-mask-conic-position), black var(--tw-mask-conic-from), transparent <percentage>);
mask-conic-to-<color>
mask-image: conic-gradient(from var(--tw-mask-conic-position), black var(--tw-mask-conic-from), <color> var(--tw-mask-conic-to);
mask-conic-to-(<custom-property>)
mask-image: conic-gradient(from var(--tw-mask-conic-position), black var(--tw-mask-conic-from), transparent var(<custom-property>);
mask-conic-to-[<value>]
mask-image: conic-gradient(from var(--tw-mask-conic-
```

Also I made some styling changes, keep those
