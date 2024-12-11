import './globals.css'
import { Providers } from './providers'
import Header from './Header'
import { ReactNode } from 'react'

export const metadata = {
  title: 'etf.fun',
  description: 'Build your multi-token portfolio',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-background text-textPrimary min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
            {children}
          </main>
          <footer className="w-full bg-surface border-t border-gray-200">
            <div className="max-w-6xl mx-auto p-4 text-sm text-textSecondary">
              © {new Date().getFullYear()} etf.fun
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
