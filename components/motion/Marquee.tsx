function MarqueeRow({ items, hidden }: { items: readonly string[]; hidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-10 pr-10"
      aria-hidden={hidden ? 'true' : undefined}
    >
      {items.map((item, i) => (
        <li key={i} className="flex shrink-0 items-center gap-10">
          <span className="display-md whitespace-nowrap text-paper-dim">{item}</span>
          <span aria-hidden="true" className="text-accent">
            &#9679;
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Infinite horizontal ticker. Pure CSS animation (see --animate-marquee in
 * globals.css), so no JS and no hydration cost. The item list is rendered
 * twice and translated by exactly -50%, which makes the loop seamless.
 *
 * The duplicate copy is aria-hidden so screen readers announce the list
 * once. The global reduced-motion rule in globals.css freezes it.
 */
export default function Marquee({ items }: { items: readonly string[] }) {
  return (
    <div className="relative flex overflow-hidden border-y border-line py-8">
      <div className="flex animate-(--animate-marquee) motion-reduce:animate-none">
        <MarqueeRow items={items} />
        <MarqueeRow items={items} hidden />
      </div>
    </div>
  )
}
