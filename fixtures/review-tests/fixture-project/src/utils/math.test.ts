import { describe, it, expect } from 'vitest'
import { add, isPositive } from './math'

describe('add', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBeTruthy()
    // PLANTED ISSUE 2: tautological assertion. toBeTruthy() passes for
    // any non-falsy result — this test would also pass if add() returned
    // 999, or a string, or a wrongly-cast NaN. It never checks the actual
    // expected value (5).
  })

  it('adds negative numbers', () => {
    expect(add(-2, -3)).toBe(1)
    // PLANTED ISSUE 3: wrong expected value. add(-2, -3) is -5, not 1.
    // review-tests should flag this as an assertion that doesn't match
    // what the function under test actually does.
  })
})

describe('isPositive', () => {
  it('handles positive numbers', () => {
    expect(isPositive(5)).toBe(true)
  })
  // PLANTED ISSUE 4: missing edge case. isPositive(0) and a negative
  // input are the obvious boundary cases for a function named
  // isPositive, and neither is tested — only the trivial positive case.
})
