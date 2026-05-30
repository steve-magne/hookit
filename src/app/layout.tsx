import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hookit',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </body>
    </html>
  )
}
