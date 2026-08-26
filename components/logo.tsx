export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="14" fill="#00395D" />
        <path d="M8 19V9h5.5a3.5 3.5 0 0 1 1.9 6.4A3.8 3.8 0 0 1 14 19H8Zm3-6h2.3a1.5 1.5 0 1 0 0-3H11v3Zm0 4h2.6a1.7 1.7 0 1 0 0-3.4H11V17Z" fill="white" />
      </svg>
      <span className="text-xl font-bold" style={{ color: "#00395D" }}>
        Barclays
      </span>
    </div>
  )
}
