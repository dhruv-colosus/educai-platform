import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const tok = await getToken({ req })
  if (tok === null) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/user/:path*",
}
