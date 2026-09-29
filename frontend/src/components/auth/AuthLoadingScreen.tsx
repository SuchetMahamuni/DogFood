export function AuthLoadingScreen() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center text-slate-200"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="flex flex-col items-center gap-6 animate-fade-in text-center px-4 max-w-sm">
        {/* DogFood brand logo */}
        <img
          src="/assets/dogfood-logo.svg"
          alt="DogFood"
          className="logo-img-lg"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement
            el.style.display = 'none'
          }}
        />

        <div className="space-y-1">
          <h2 className="text-base font-bold font-mono tracking-wider text-white uppercase">
            DOGFOOD
          </h2>
          <p className="text-xs text-muted-foreground">Preparing your workspace...</p>
        </div>

        {/* Animated signal */}
        <div className="flex items-center gap-3 pt-1">
          <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
          <div
            className="h-0.5 w-8 rounded-full"
            style={{ background: `linear-gradient(to right, var(--color-primary), var(--color-primary-hover))` }}
          />
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <div
            className="h-0.5 w-8 rounded-full"
            style={{ background: `linear-gradient(to right, var(--color-primary-hover), var(--color-primary-light))` }}
          />
          <div className="h-2 w-2 rounded-full bg-primary-light" />
        </div>
      </div>
    </div>
  )
}
