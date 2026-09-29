import { Search, Shuffle, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { DiscoverFilters } from '@/services/userService'

interface DiscoveryFiltersProps {
  filters: DiscoverFilters
  onChange: (filters: DiscoverFilters) => void
  onReset: () => void
}

const ROLES = [
  'All Roles',
  'Full-Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'AI / ML Engineer',
  'Product Designer',
]

const AVAILABILITY = [
  'All Availability',
  'Full-time / 40h',
  'Weekends & Evenings',
  'Flexible / 25h',
]

export function DiscoveryFilters({ filters, onChange, onReset }: DiscoveryFiltersProps) {
  return (
    <div className="bg-card/90 p-4 rounded-2xl border border-white/10 shadow-sm space-y-3">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search by skill/keyword */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search skills (e.g. Python, React, Rust, PyTorch, Docker)..."
            className="pl-9.5 h-10 text-xs bg-surface-elevated/70 border-white/10 text-white placeholder:text-slate-500 rounded-xl"
            value={filters.skills || ''}
            onChange={(e) => onChange({ ...filters, skills: e.target.value })}
          />
        </div>

        {/* Role select */}
        <div className="w-full md:w-52">
          <select
            className="w-full h-10 rounded-xl border border-white/10 bg-surface-elevated px-3 py-1 text-xs text-white shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary font-medium"
            value={filters.preferred_role || 'All Roles'}
            onChange={(e) =>
              onChange({
                ...filters,
                preferred_role: e.target.value === 'All Roles' ? undefined : e.target.value,
              })
            }
          >
            {ROLES.map((r) => (
              <option key={r} value={r} className="bg-card text-white">
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Availability select */}
        <div className="w-full md:w-48">
          <select
            className="w-full h-10 rounded-xl border border-white/10 bg-surface-elevated px-3 py-1 text-xs text-white shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary font-medium"
            value={filters.availability || 'All Availability'}
            onChange={(e) =>
              onChange({
                ...filters,
                availability: e.target.value === 'All Availability' ? undefined : e.target.value,
              })
            }
          >
            {AVAILABILITY.map((a) => (
              <option key={a} value={a} className="bg-card text-white">
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Random Shuffle Toggle */}
        <Button
          variant={filters.mode === 'random' ? 'default' : 'outline'}
          size="sm"
          className="w-full md:w-auto h-10 text-xs font-semibold flex items-center gap-1.5 border-white/10 text-slate-200 hover:text-white"
          onClick={() =>
            onChange({
              ...filters,
              mode: filters.mode === 'random' ? undefined : 'random',
            })
          }
        >
          <Shuffle className="h-3.5 w-3.5" />
          <span>Shuffle</span>
        </Button>

        {/* Reset button */}
        {(filters.skills || filters.preferred_role || filters.availability || filters.mode) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-3 text-xs text-slate-400 hover:text-white"
            onClick={onReset}
            title="Reset filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
