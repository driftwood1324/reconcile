/** Minimal thin-stroke Latin cross. The app's only ornament — no clip art. */
export default function Cross({
  className = "",
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="6.5" y1="9" x2="17.5" y2="9" />
    </svg>
  );
}
