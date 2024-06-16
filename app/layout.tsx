import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Nav from "@/components/nav"
import NextTopLoader from "nextjs-toploader"
import { AuthSessionProvider } from "@/components/auth-session-provider"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config"
import Splash from "@/components/splash"
import { ReactQueryProvider } from "@/components/query-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EducAi",
  description: "educ-ai",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body
        className={`${inter.className} w-screen h-screen overflow-hidden bg-background text-white dark max-w-[1920px] mx-auto font-gilroy`}
      >
        <Splash />
        <ReactQueryProvider>
          <AuthSessionProvider session={session}>
            <NextTopLoader color="#cb3cff" showSpinner={false} height={1} />
            {children}
          </AuthSessionProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
