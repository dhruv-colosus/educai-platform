import prisma from "@/prisma/db";
import { getEthPrice } from "./serv-utils";
import { Decimal } from "@prisma/client/runtime/library";

export async function getPercentChange(userId: string) {
  const lastDayDate = new Date(Date.now() - 1000 * 60 * 60 * 24);

  const balanceLastDay = await prisma.balanceSnapshot.findFirst({
    where: { userId, createdAt: { gt: lastDayDate } },
    orderBy: { createdAt: "asc" },
  });
  if (!balanceLastDay) return { percent: 0, amount: 0 };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { balance: true },
  });
  if (!user) throw new Error("User not found");

  return {
    percent: new Decimal(user.balance)
      .sub(new Decimal(balanceLastDay.amount))
      .div(user.balance)
      .toNumber(),
    amount: new Decimal(user.balance)
      .sub(balanceLastDay.amount)
      .div(1e18) //@ts-ignore
      .mul(await getEthPrice())
      .toNumber(),
  };
}
