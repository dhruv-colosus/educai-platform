import { Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function AiInsight() {
  return (
    <Card className="bg-foreground w-full px-4 h-full">
      <CardHeader>
        <CardTitle className="text-muted text-base font-medium flex">
          <Search className="me-2" />
          AI Insights and Advices
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-6 items-center flex-col">
        {Array(3)
          .fill(null)
          .map((_, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <p className="font-medium text-xl">{idx + 1}. Buy Less ETH</p>
              <p className="text-sm text-muted">
                Since ETH is at its all time high (ATH) it&apos;s very risky to
                buy now, hence hold your investment and wait for it to dip
              </p>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}
