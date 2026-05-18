import { Button } from '@/components/ui/Button'

export function BulkActions({
  selected,
  onDelete,
}: {
  selected: string[]
  onDelete: () => void
}) {
  if (!selected.length) return null

  return (
    <Button variant="secondary" size="sm" onClick={onDelete}>
      Delete ({selected.length})
    </Button>
  )
}
