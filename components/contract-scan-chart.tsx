"use client"

import { Pie, ResponsiveContainer, PieChart, Cell } from "recharts"
import noHydrate from "./no-hydrate"

interface ChartProps {
  riskLevel: number
}

function ContractScanChartInner({ riskLevel }: ChartProps) {
  return (
    <div className="flex justify-center relative z-0">
      <PieChart width={300} height={300} className="z-0">
        <Pie
          data={[{ value: riskLevel }, { value: 100 - riskLevel }]}
          dataKey="value"
          startAngle={180}
          endAngle={-180}
          labelLine={false}
          blendStroke
          innerRadius={"75%"}
          //   isAnimationActive={false}
        >
          <Cell fill="#00C2FF" />
          <Cell fill="#00C2FF08" />
        </Pie>
      </PieChart>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-xl font-bold">
        Risk: {riskLevel}%
      </div>
    </div>
  )
}

export const ContractScanChart = noHydrate<ChartProps>(ContractScanChartInner)
