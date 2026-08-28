export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#3696FC" />
        <path
          d="M7 17V7h4.7a3 3 0 0 1 1.6 5.5A3.2 3.2 0 0 1 12 17H7Zm2.6-6h2a1.3 1.3 0 1 0 0-2.6h-2V11Zm0 3.6h2.3a1.5 1.5 0 1 0 0-3H9.6v3Z"
          fill="#161B2F"
        />
      </svg>
      <span className="text-xl font-bold tracking-tight text-current">BARCLAYS</span>
    </div>
  )
}
