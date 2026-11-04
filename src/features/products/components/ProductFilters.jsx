import { SearchField } from '@/components/ui'
import { cn } from '@/utils'

export function ProductFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  searchPlaceholder,
  allLabel,
}) {
  return (
    <div className="product-filters">
      <SearchField
        className="product-filters__search"
        value={search}
        onValueChange={onSearchChange}
        placeholder={searchPlaceholder}
        label="Buscar productos"
      />

      <div className="product-filters__chips" role="group" aria-label="Filtrar por categoría">
        {[{ id: '', name: allLabel }, ...categories].map((c) => (
          <button
            key={c.id || 'all'}
            type="button"
            className={cn('chip', category === c.id && 'is-active')}
            aria-pressed={category === c.id}
            onClick={() => onCategoryChange(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}
