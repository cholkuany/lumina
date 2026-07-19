import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Plus, Upload } from 'lucide-react'

export const ResourceHeader = ({ title, description, addResourceText, addResourceUrl, exportText }: { title: string, description: string, addResourceText?: string, addResourceUrl?: string, exportText?: string }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
        <p className="text-border-dark mt-1">
          {description}
        </p>
      </div>
      {addResourceText && addResourceUrl &&
        <Link href={`${addResourceUrl}`}>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            {addResourceText}
          </Button>
        </Link>
      }
      {exportText && <Button variant="secondary">
        <Upload className="w-4 h-4 mr-2" />
        {exportText}
      </Button>}
    </div>
  )
}
