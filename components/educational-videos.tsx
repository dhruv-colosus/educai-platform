"use client"

import { useWindowSize } from "@uidotdev/usehooks"
import Image from "next/image"
import Slider, { Settings } from "react-slick"

export function EducationalVideos() {
  let { width } = useWindowSize()
  width = width ?? 640

  const slidesToShow = width > 1200 ? 3 : width > 700 ? 2 : 1

  return (
    <div className="@container">
      <div className="slider-container">
        <Slider infinite={true} speed={500} slidesToShow={slidesToShow} className="mx-6">
          <VideoCard />
          <VideoCard />
          <VideoCard />
          <VideoCard />
        </Slider>
        {/* <Slider {...sliderSettings} className="mx-6 w-full">
          <VideoCard />
          <VideoCard />
          <VideoCard />
          <VideoCard />
          <VideoCard />
          <VideoCard />
          <VideoCard />
        </Slider> */}
      </div>
    </div>
  )
}

const VideoCard = () => {
  return (
    <div className="flex flex-col items-center gap-2 max-w-[80%] w-[300px] @md:w-[420px] text-center justify-center mx-auto">
      <Image
        src="/dummy-img.png"
        alt="dummy"
        height={300}
        width={400}
        className="rounded-xl object-cover"
      />
      <span className="mt-4 max-w-[300px]">Learn Crypto Analysis : A 2 way window theorem</span>
    </div>
  )
}
