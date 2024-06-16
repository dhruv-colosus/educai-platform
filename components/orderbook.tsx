"use client"

import truncate from "truncate"
import dayjs from "dayjs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { OrderbookOption } from "@/types"

interface OrderbookProps {
  tokenAddress: string
  page: number
  option: OrderbookOption
}

export function Orderbook({ tokenAddress, page, option }: OrderbookProps) {
  const data = defaultData

  return (
    <Table className="min-w-[600px]">
      <TableHeader>
        <TableRow>
          <TableHead className="text-start">Tx Hash</TableHead>
          <TableHead className="text-center">Date</TableHead>
          <TableHead className="text-center">Type</TableHead>
          <TableHead className="text-center">Price USD</TableHead>
          <TableHead className="text-center">Total</TableHead>
          <TableHead className="text-end">Address</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow
            key={row.txHash}
            className={`${
              row.type === "buy" ? "text-green-400" : "text-red-300"
            } font-medium`}
          >
            <TableCell className="">{truncate(row.txHash, 16)}</TableCell>
            <TableCell className="text-center">
              {dayjs(row.date).format("MMM D HH:mm:ss")}
            </TableCell>
            <TableCell className="text-center">{row.type}</TableCell>
            <TableCell className="text-center">${row.price}</TableCell>
            <TableCell className="text-center">${row.total}</TableCell>
            <TableCell className="text-end">
              {truncate(row.address, 10)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

interface OrderbookData {
  txHash: string
  date: number
  type: "buy" | "sell"
  price: number
  total: number
  address: string
}

const defaultData: OrderbookData[] = [
  {
    txHash: "0x12148747281812fa8b878d7ef",
    date: 1711664281760,
    type: "buy",
    price: 0.182,
    total: 988.75,
    address: "0xf80fe97797b24956d26d09a51f366229022da597",
  },
  {
    txHash: "0x11gar122148747281812fa8b878d7ef",
    date: 1711664281760,
    type: "sell",
    price: 0.172,
    total: 331.53,
    address: "0xd3adbeeffe97797b24956d26d09a51f366229022da597",
  },
  {
    txHash: "0x12148747281812fa8b878d7ef",
    date: 1711664281760,
    type: "buy",
    price: 0.182,
    total: 988.75,
    address: "0xf80fe97797b24956d26d09a51f366229022da597",
  },
  {
    txHash: "0x12148747281812fa8b878d7ef",
    date: 1711664281760,
    type: "buy",
    price: 0.182,
    total: 988.75,
    address: "0xf80fe97797b24956d26d09a51f366229022da597",
  },
  {
    txHash: "0x11gar122148747281812fa8b878d7ef",
    date: 1711664281760,
    type: "sell",
    price: 0.172,
    total: 331.53,
    address: "0xd3adbeeffe97797b24956d26d09a51f366229022da597",
  },
  {
    txHash: "0x12148747281812fa8b878d7ef",
    date: 1711664281760,
    type: "buy",
    price: 0.182,
    total: 988.75,
    address: "0xf80fe97797b24956d26d09a51f366229022da597",
  },
  {
    txHash: "0x12148747281812fa8b878d7ef",
    date: 1711664281760,
    type: "buy",
    price: 0.182,
    total: 988.75,
    address: "0xf80fe97797b24956d26d09a51f366229022da597",
  },
  {
    txHash: "0x11gar122148747281812fa8b878d7ef",
    date: 1711664281760,
    type: "sell",
    price: 0.172,
    total: 331.53,
    address: "0xd3adbeeffe97797b24956d26d09a51f366229022da597",
  },
  {
    txHash: "0x12148747281812fa8b878d7ef",
    date: 1711664281760,
    type: "buy",
    price: 0.182,
    total: 988.75,
    address: "0xf80fe97797b24956d26d09a51f366229022da597",
  },
  {
    txHash: "0x12148747281812fa8b878d7ef",
    date: 1711664281760,
    type: "buy",
    price: 0.182,
    total: 988.75,
    address: "0xf80fe97797b24956d26d09a51f366229022da597",
  },
  {
    txHash: "0x11gar122148747281812fa8b878d7ef",
    date: 1711664281760,
    type: "sell",
    price: 0.172,
    total: 331.53,
    address: "0xd3adbeeffe97797b24956d26d09a51f366229022da597",
  },
  {
    txHash: "0x12148747281812fa8b878d7ef",
    date: 1711664281760,
    type: "buy",
    price: 0.182,
    total: 988.75,
    address: "0xf80fe97797b24956d26d09a51f366229022da597",
  },
]
