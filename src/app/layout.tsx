import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '~/providers/theme-provider'
import ConvexClientProvider from '~/providers/convex-client-provider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'WhatsApp',
    description:
        'WhatsApp can be used on any device, including Android, iOS, and desktop devices. Send messages, photos, videos, and files to your friends and family.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <link
                rel="icon"
                href="https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJmR21ndUJRVnM5RWJzUDNvNHBuSURaNTNaUCJ9?width=80"
            />
            <body className={inter.className}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <ConvexClientProvider>
                        {children}
                        <Toaster />
                    </ConvexClientProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
