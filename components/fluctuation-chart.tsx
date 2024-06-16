"use client"

import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export const FluctuationChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400} className="-mx-6">
      <LineChart data={data}>
        <Line name="Balance" type="monotone" dataKey="amt" stroke="#cb3cff" />
        <Legend verticalAlign="top" height={36} />
        <XAxis
          dataKey="time"
          stroke="#aeb9e1"
          minTickGap={5}
          tickLine={false}
          fontSize={10}
          height={10}
        />
        <YAxis stroke="#aeb9e1" tickLine={false} width={40} fontSize={10} />
        {/* <Tooltip /> */}
      </LineChart>
    </ResponsiveContainer>
  )
}

const data = [
  {
    time: "Mon",
    amt: 4000,
  },
  {
    time: "Tue",
    amt: 5000,
  },
  {
    time: "Wed",
    amt: 2290,
  },
  {
    time: "Thu",
    amt: 3127,
  },
  {
    time: "Fri",
    amt: 4200,
  },
  {
    time: "Sat",
    amt: 9342,
  },
  {
    time: "Sun",
    amt: 8000,
  },
]
