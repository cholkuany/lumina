'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { StatusBadge } from './StatusBadge'

import { NestedCategory } from '@/hooks/useCategories'

import { Folder, FolderOpen, Plus, SquarePen, Trash2, ChevronRight } from 'lucide-react'

interface CategoryTreeProps {
  categories: NestedCategory[]
  onEdit: (category: NestedCategory) => void
  onDelete: (category: NestedCategory) => void
  onAddChild: (parentId: string) => void
  selectedId?: string
}

type CategoryNodeProps = Omit<CategoryTreeProps, 'categories'> & {
  category: NestedCategory
  level: number
}

export function CategoryTree({
  categories,
  onEdit,
  onDelete,
  onAddChild,
  selectedId,
}: CategoryTreeProps) {
  return (
    <div className="space-y-1">
      {categories.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-brand">
          <Folder className="w-12 h-12 text-border-dark mx-auto mb-3" />
          <p className="text-text-primary font-medium">No categories yet</p>
          <p className="text-sm text-border-dark mt-1">
            Create your first category to get started
          </p>
        </div>
      ) : (
        categories.map((category) => (
          <CategoryNode
            key={category.id}
            category={category}
            level={0}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddChild={onAddChild}
            selectedId={selectedId}
          />
        ))
      )}
    </div>
  )
}

function CategoryNode({
  category,
  level,
  onEdit,
  onDelete,
  onAddChild,
  selectedId,
}: CategoryNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = category.children && category.children.length > 0
  const isSelected = selectedId === category.id

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-3 rounded-brand transition-colors group',
          isSelected
            ? 'bg-primary/10 border border-primary'
            : 'hover:bg-surface border border-transparent'
        )}
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'w-6 h-6 flex items-center justify-center rounded transition-colors',
            hasChildren
              ? 'hover:bg-border-light text-text-primary'
              : 'text-transparent cursor-default'
          )}
          disabled={!hasChildren}
        >
          {hasChildren && (
            <ChevronRight
              className={cn(
                'w-4 h-4 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          )}
        </button>

        {/* Category Icon */}
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
            hasChildren ? 'bg-primary/20' : 'bg-surface'
          )}
        >
          {hasChildren ? (
            <FolderOpen className="w-4 h-4 text-primary" />
          ) : (
            <Folder className="w-4 h-4 text-border-dark" />
          )}
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-text-primary truncate">
              {category.name}
            </span>
            {!category.isActive && (
              <StatusBadge status="inactive" size="sm" />
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-border-dark">
            <span>{category.slug}</span>
            <span>•</span>
            <span>{category.productCount} products</span>
            {hasChildren && (
              <>
                <span>•</span>
                <span>{category.children.length} subcategories</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onAddChild(category.id)}
            className="p-1.5 text-border-dark hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="Add subcategory"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(category)}
            className="p-1.5 text-border-dark hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="Edit category"
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="p-1.5 text-border-dark hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {category.children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  )
}