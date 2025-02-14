import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord clone",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
            <html lang="en" suppressHydrationWarning>
                <body className={cn( font.className, 
                "bg-white dark:bg-[#313338]" )}>
                <ThemeProvider attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  storageKey="discord-theme">
                  <SocketProvider>
                        <ModalProvider />
                        <QueryProvider>
                          {children}
                        </QueryProvider>
                  </SocketProvider>
                  </ThemeProvider>
                
                </body>
            </html>
      </SessionProvider>
  );
}
