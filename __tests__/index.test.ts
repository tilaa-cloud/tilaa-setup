/**
 * Unit tests for the action's entrypoint, src/index.ts
 */
import { jest, describe, expect, it } from '@jest/globals'
import * as main from '../src/main'

// Mock the action's entrypoint
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const runMock = jest.spyOn(main, 'run').mockImplementation()

describe('index', () => {
  it('calls run when imported', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../src/index')

    expect(runMock).toHaveBeenCalled()
  })
})
