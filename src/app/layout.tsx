import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tom Geo | Software Developer',
  description: 'Portfolio of Tom Geo — Software Developer specializing in AI, Computer Vision, and Cybersecurity.',
  keywords: ['Tom Geo', 'Software Developer', 'AI', 'Cybersecurity', 'Portfolio', 'MCA'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
