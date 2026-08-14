type ArrowIconProps = {
  direction?: "right" | "left";
  className?: string;
};

export function ArrowIcon({ direction = "right", className = "" }: ArrowIconProps) {
  return (
    <svg
      viewBox="0 0 8 13"
      fill="none"
      aria-hidden="true"
      className={`${direction === "left" ? "rotate-180" : ""} ${className}`.trim()}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.071 7.071L1.414 12.728L0 11.314L4.95 6.364L0 1.414L1.414 0L7.071 5.657C7.25847 5.84453 7.36379 6.09884 7.36379 6.364C7.36379 6.62916 7.25847 6.88347 7.071 7.071Z"
        fill="currentColor"
      />
    </svg>
  );
}
