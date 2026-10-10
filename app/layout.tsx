import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Glynac VDR - Enterprise Virtual Data Room',
  description: 'High-fidelity visual design concept and workspace reference for Glynac VDR, an enterprise virtual data room.',
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000'%3E%3Crect width='1000' height='1000' rx='200' fill='%23011238'/%3E%3Cpath d='M 571 314 A 214 214 0 1 0 449 659 L 437 599 A 152 152 0 1 1 523 354 Z' fill='white'/%3E%3Cpath d='M 388 440 L 602 440 L 565 500 L 492 500 L 582 656 L 708 440 L 792 440 L 582 772 Z' fill='white'/%3E%3C/svg%3E",
  },
  openGraph: {
    title: 'Glynac VDR - Enterprise Virtual Data Room',
    description: 'High-fidelity visual design concept and workspace reference for Glynac VDR, an enterprise virtual data room.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F8F9FA] text-[#1E293B] antialiased selection:bg-indigo-100 selection:text-indigo-900">
        {children}
      </body>
    </html>
  );
}
