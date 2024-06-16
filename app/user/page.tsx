import { Advert } from "@/components/advert"
import { EducationalVideos } from "@/components/educational-videos"
import { LpData } from "@/components/lp-data"
import { RecentlyDeployed } from "@/components/recently-deployed"
import { TrendingTokens } from "@/components/trending-tokens"
import { Welcome } from "@/components/welcome"
import { ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      <Welcome />
      <h2 className="mt-6 text-xl font-medium mb-4 flex gap-1 items-center">
        <p className="me-2">Explore Educational Videos</p>
        <ChevronRight className="" size={16} />
      </h2>
      <EducationalVideos />
      <div className="flex mt-6 gap-4 flex-col lg:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <RecentlyDeployed />
          <LpData />
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <Advert />
          <TrendingTokens />
          <Advert />
        </div>
      </div>
    </div>
  )
}

export const revalidate = 60 * 10
