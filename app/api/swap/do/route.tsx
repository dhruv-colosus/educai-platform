import { SwapType } from "@uniswap/smart-order-router"
import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core"
// import { provider } from "@/lib/eth"
import {
  getEstimate,
  getTokenInfoBasic,
  getTokenMetadata,
  hasBalance,
} from "@/lib/api"
import { Protocol } from "@uniswap/router-sdk"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config"
import prisma from "@/prisma/db"
import { Decimal } from "@prisma/client/runtime/library"
import { WETH_ADDR } from "@/types"
import { OrderType } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const body = await req.json()
  const from = body.from?.toLowerCase()
  const to = body.to?.toLowerCase()
  const amount = body.amount
  const session = await getServerSession(authOptions)

  if (!from || !to || !amount || !session) {
    return NextResponse.json({ error: "no param" }, { status: 400 })
  }

  console.log(from, to, amount, session.user.id)

  const canPerform = await hasBalance(session.user.id, from, amount)
  if (!canPerform) {
    return NextResponse.json({ error: "Insufficient Balance" }, { status: 400 })
  }

  const fromInfo = await getTokenInfoBasic(from)
  const toInfo = await getTokenInfoBasic(to)

  if (!fromInfo || !toInfo) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 400 })
  }

  const estimate = await getEstimate(from, to, amount)
  console.log("estimate", estimate)

  let fromToken = null,
    toToken = null
  let fromBalance = null,
    toBalance = null
  if (to === WETH_ADDR) {
    fromToken = await prisma.token.upsert({
      where: { address: from },
      update: {},
      create: {
        address: from,
        name: fromInfo.name,
        symbol: fromInfo.symbol,
        decimals: fromInfo.decimals,
      },
    })
    fromBalance = await prisma.tokenBalance.upsert({
      where: {
        userId_tokenAddress: {
          userId: session.user.id,
          tokenAddress: from,
        },
      },
      update: {},
      create: {
        tokenAddress: from,
        userId: session.user.id,
      },
    })
  } else {
    toToken = await prisma.token.upsert({
      where: { address: to },
      update: {},
      create: {
        address: to,
        name: toInfo.name,
        symbol: toInfo.symbol,
        decimals: toInfo.decimals,
      },
    })
    toBalance = await prisma.tokenBalance.upsert({
      where: {
        userId_tokenAddress: { userId: session.user.id, tokenAddress: to },
      },
      update: {},
      create: {
        tokenAddress: to,
        userId: session.user.id,
      },
    })
  }

  console.log(fromBalance, toBalance)

  const inAmount = new Decimal(amount).mul(
    new Decimal(10).pow(fromToken?.decimals ?? 18)
  )
  const outAmount = new Decimal(estimate).mul(
    new Decimal(10).pow(toToken?.decimals ?? 18)
  )

  if (fromBalance === null) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        balance: {
          decrement: inAmount,
        },
      },
    })
  } else {
    await prisma.tokenBalance.update({
      where: { id: fromBalance.id },
      data: {
        balance: {
          decrement: inAmount,
        },
      },
    })
  }

  if (toBalance === null) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        balance: {
          increment: outAmount,
        },
      },
    })
  } else {
    await prisma.tokenBalance.update({
      where: { id: toBalance.id },
      data: {
        balance: {
          increment: outAmount,
        },
      },
    })
  }

  await prisma.order.create({
    data: {
      userId: session.user.id,
      type: fromBalance === null ? OrderType.BUY : OrderType.SELL,
      tokenAddress: fromToken?.address || toToken!.address,
      in: inAmount,
      out: outAmount,
      tokenValue: 0, // TODO
    },
  })

  // revalidatePath("/user/dashboard")
  return NextResponse.json({ success: true })
}
