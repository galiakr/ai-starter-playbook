// PLANTED ISSUE 5 (consequence of issue 1): real logic, no test file, and
// invisible in the coverage report because src/components is excluded
// from vitest.config.ts's coverage `include`.
export function Button({
  label,
  onClick,
  disabled = false,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}
