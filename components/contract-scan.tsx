"use client"

import { ScanLine } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ReactNode } from "react"
import { ContractScanChart } from "./contract-scan-chart"
import { useQuery } from "@tanstack/react-query"
import { HoneypotData } from "@/types"

interface ContractScanProps {
  tokenAddress: string
}

export function ContractScan({ tokenAddress }: ContractScanProps) {
  const { data: honeypotData } = useQuery({
    queryKey: ["honeypot", tokenAddress],
    queryFn: (): Promise<HoneypotData> =>
      fetch("/api/token/honeypot?address=" + tokenAddress)
        .then((res) => res.json())
        .then((data) => data.info),
    initialData: dummyData,
  })

  return (
    <Card className="bg-foreground w-full px-4 md:min-w-[300px]">
      <CardHeader>
        <CardTitle className="text-muted text-base font-medium flex">
          <ScanLine className="me-2" />
          Contract Scan
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="flex flex-col">
          <div>
            <ContractScanChart
              riskLevel={honeypotData?.summary?.riskLevel || 1}
            />
          </div>
          <Row title="Contract Verified">
            {honeypotData?.contractCode?.openSource ? "YES" : "NO"}
          </Row>
          <Row title="Honeypot">
            {honeypotData?.honeypotResult?.isHoneypot ? "YES" : "NO"}
          </Row>
          <Row title="Buy Tax">
            {honeypotData?.simulationResult?.buyTax?.toFixed(0) ?? "-"}%
          </Row>
          <Row title="Sell Tax">
            {honeypotData?.simulationResult?.sellTax?.toFixed(0) ?? "-"}%
          </Row>
          <Row title="Transfer Tax">
            {honeypotData?.simulationResult?.transferTax ?? "-"}%
          </Row>
          <Row title="Renounced">-</Row>
          <Row title="LP Status">-</Row>
          <Row title="Mintable" isLast={true}>
            -
          </Row>
        </div>
      </CardContent>
    </Card>
  )
}

interface RowProps {
  title: string
  children: ReactNode
  isLast?: boolean
}

function Row({ title, children, isLast = false }: RowProps) {
  return (
    <div
      className={`flex justify-between py-3 -mx-2 sm:mx-0 ${
        !isLast ? `border-b-2 border-white border-opacity-10` : ``
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        <p className="text-muted text-sm xs:text-lg">{title}</p>
      </div>
      <p className="font-semibold text-base">{children}</p>
    </div>
  )
}

const dummyData: HoneypotData = {
  summary: {
    riskLevel: 0,
  },
  honeypotResult: {
    isHoneypot: false,
  },
  simulationResult: {
    buyTax: 0,
    sellTax: 0,
    transferTax: 0,
  },
  contractCode: {
    openSource: true,
  },
}
