interface TechStackProps {
  technologies?: string
  className?: string
}

export function TechStack({ technologies, className }: TechStackProps) {
  if (!technologies || !technologies.trim()) {
    return <span className="text-xs text-slate-400 italic font-mono">No stack specified</span>
  }

  const items = technologies
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  return (
    <div className={`flex flex-wrap gap-1.5 ${className || ''}`}>
      {items.map((tech, idx) => (
        <span
          key={idx}
          className="px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-surface-elevated text-slate-200 border border-white/10"
        >
          {tech}
        </span>
      ))}
    </div>
  )
}
