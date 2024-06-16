import Link from "next/link"

export default function NotFound() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="text-3xl text-center px-4 font-bold">Page not found</p>
      <Link href="/" className="py-2 px-4 bg-accent rounded-lg font-medium mt-4">
        Go to home
      </Link>
    </div>
  )
}
