import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JobBoost AI — Land your next job 10x faster',
  description: 'AI-powered job application tool. Paste a job offer, get a tailored CV + cover letter in seconds.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  )
}
