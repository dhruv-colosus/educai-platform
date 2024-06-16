import { authOptions } from "@/config"
import prisma from "@/prisma/db"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"

export async function getUserId() {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error("No session")
  }
  return session.user.id
}

export async function getSessionUser(select?: Prisma.UserSelect) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error("No session")
  }

  // TODO return value type filtering

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { ...select, id: true },
  })
  if (!user) {
    throw new Error("User not found")
  }

  return user
}
