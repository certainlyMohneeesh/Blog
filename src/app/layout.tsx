import { Inter } from "next/font/google";
import ClientLayout from "@/components/common/ClientLayout";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Cyth Blog',
  description: 'A personal blog built with Next.js and shadcn components',
  keywords: ['blog', 'nextjs', 'react', 'web development'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' }
    ],
    apple: { url: '/apple-touch-icon.png' }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
