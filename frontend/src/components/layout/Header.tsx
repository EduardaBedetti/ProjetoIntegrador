interface HeaderProps {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export function Header({ action }: HeaderProps) {
  return (
    <header className="flex items-center justify-between bg-[#0B3C5D] px-8 py-3" style={{ height: '100px' }}>
      <div />
      <div className="flex items-center gap-4">
        {action}
      </div>
    </header>
  )
}
