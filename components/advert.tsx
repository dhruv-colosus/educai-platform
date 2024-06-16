import { ArrowUpFromLine } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function Advert() {
  return (
    <Card className="bg-foreground w-full px-4 h-[200px]">
      <CardContent className="flex items-center justify-center h-full font-bold text-xlte">
        Advert Here
      </CardContent>
    </Card>
  )
}
