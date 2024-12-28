import { Inter } from "next/font/google";
import ClientLayout from "@/components/common/ClientLayout";
import "@/styles/globals.css";
// import "@/styles/prosemirror.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Cyth Blog',
  description: 'A personal blog.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'icon',
      url: '/favicon.png',
      type: 'image/png'
    }
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
