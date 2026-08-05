import { useState } from 'react'

// PLANTED ISSUE 5 (consequence of issue 1): real logic, no test file, and
// invisible in the coverage report because src/hooks is excluded from
// vitest.config.ts's coverage `include`.
export function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = useState(initial)
  const toggle = () => setValue((v) => !v)
  return [value, toggle]
}
