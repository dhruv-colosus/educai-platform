import { authOptions } from "@/config"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/api/auth/signin")
  } else {
    redirect("/user")
  }

  return <>Landing</>
}
