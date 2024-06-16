"use client"

import { LoaderCircle } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Splash() {
  const [loaded, setLoaded] = useState(false)
  const [shouldRemove, setShouldRemove] = useState(false)

  useEffect(() => {
    setLoaded(true)
    const timeout = setTimeout(() => setShouldRemove(true), 500)
    return () => clearTimeout(timeout)
  }, [])

  return shouldRemove ? null : (
    //   return (
    <div
      className={`fixed inset-0 z-[4242] bg-background flex flex-col gap-4 items-center justify-center transition-opacity duration-500 ${
        loaded ? "opacity-0" : "opacity-100"
      }`}
    >
      <Image src="/logo.png" width={100} height={100} alt="EducAI Logo" />
      <LoaderCircle className="animate-spin" />
    </div>
  )
}
