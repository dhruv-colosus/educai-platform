import { getTokenInfoBasic, getTokenMetadata, getTopHolders } from "@/lib/api"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const tokenAddress = searchParams.get("address")
  if (!tokenAddress) {
    return NextResponse.json({ error: "No token specified" }, { status: 400 })
  }

  return NextResponse.json({ info: await getTopHolders(tokenAddress) })
}
