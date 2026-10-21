import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zagnu Outreach",
  appleWebApp: { capable: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#08090a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>
          <header className="top">
            <svg className="mark" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M5 6h14l-9 8h13" fill="none" stroke="#10b981" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M27 26H13l9-8H9" fill="none" stroke="#6ee7b7" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="wordmark">Zagnu</span>
            <span className="sub">Outreach</span>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
