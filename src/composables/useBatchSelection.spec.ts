import { describe, expect, it } from 'vitest'

import { useBatchSelection } from './useBatchSelection'

interface Row {
  id: number
}

describe('useBatchSelection', () => {
  it('tracks selected rows and ids', () => {
    const selection = useBatchSelection<Row>('id')
    const rows = [{ id: 1 }, { id: 3 }]

    selection.setSelection(rows)

    expect(selection.selectedRows.value).toEqual(rows)
    expect(selection.selectedIds.value).toEqual([1, 3])
    expect(selection.hasSelection.value).toBe(true)
  })

  it('clears selection state', () => {
    const selection = useBatchSelection<Row>('id')

    selection.setSelection([{ id: 8 }])
    selection.clearSelection()

    expect(selection.selectedRows.value).toEqual([])
    expect(selection.selectedIds.value).toEqual([])
    expect(selection.hasSelection.value).toBe(false)
  })
})
