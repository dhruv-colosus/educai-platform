import { getTokenInfoBasic, getTokens } from "@/lib/api"
import { BasicTokenInfo } from "@/types"
import { NextRequest, NextResponse } from "next/server"
import Fuse from "fuse.js"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const name = searchParams.get("name")
  if (!name) {
    return NextResponse.json({ error: "No token specified" }, { status: 400 })
  }

  const tokens: BasicTokenInfo[] = await getTokens({})
  const fuse = new Fuse(tokens, {
    keys: ["name", "address", "symbol"],
  })
  const res = fuse.search(name, { limit: 10 })

  return NextResponse.json(res.map((item) => item.item))
}
