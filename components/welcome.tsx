import { getSessionUser } from "@/lib/sess"

export async function Welcome() {
  const user = await getSessionUser({ email: true, address: true })

  return (
    <div>
      <h1 className="text-3xl font-medium">
        Welcome back, {user.email ? user.email.split("@")[0] : user.address}
      </h1>
      <p className="text-muted text-sm mt-2">
        Here are the details about your searched pair
      </p>
    </div>
  )
}
