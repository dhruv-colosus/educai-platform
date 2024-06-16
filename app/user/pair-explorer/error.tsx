"use client" // Error components must be Client Components

import { useEffect } from "react"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <p className="text-2xl">Something went wrong!</p>
      <button
        className="bg-accent py-1 px-4 rounded-xl font-medium text-base"
        onClick={() => reset()}
      >
        Reload
      </button>
    </div>
  )
}
