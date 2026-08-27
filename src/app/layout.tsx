import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Grant Match | Spatialytics',
    template: '%s | Spatialytics Grant Match',
  },
  description:
    'Map-first grant discovery and proposal writing for Greater Minnesota nonprofits and community organizations.',
  metadataBase: new URL('https://spatialytics-grant-match.vercel.app'),
  openGraph: {
    title: 'Grant Match | Spatialytics',
    description:
      'Map-first grant discovery and guided proposals for Greater Minnesota.',
    siteName: 'Spatialytics Grant Match',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grant Match | Spatialytics',
    description:
      'Map-first grant discovery and guided proposals for Greater Minnesota.',
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="font-bold tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-md bg-cyan-400 text-slate-950 text-xs font-black flex items-center justify-center">
                S
              </span>
              Grant Match
            </a>
            <nav className="flex gap-4 text-sm text-slate-400">
              <a href="/" className="hover:text-cyan-400 transition">
                Discover
              </a>
              <a href="/write" className="hover:text-cyan-400 transition">
                Write
              </a>
              <a href="/pipeline" className="hover:text-cyan-400 transition">
                Pipeline
              </a>
              <a
                href="https://spatialytics-astro.vercel.app"
                className="hover:text-cyan-400 transition"
                target="_blank"
                rel="noreferrer"
              >
                Spatialytics
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
