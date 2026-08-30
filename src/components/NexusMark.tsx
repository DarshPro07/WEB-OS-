interface Props {
  size?: number;
}

// One hexagonal core with a solid centre. Drawn on Lucide's 24px / 1.5-stroke grid
// so it sits correctly beside the app icons, and stays legible down to 15px.
export default function NexusMark({ size = 16 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3.25 19.6 7.6v8.8L12 20.75 4.4 16.4V7.6z" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
