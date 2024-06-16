import { useState, useEffect, FunctionComponent, JSX } from "react"

function noHydrate<T>(Component: FunctionComponent<T>) {
  return function Wrapped(props: T) {
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
      setHydrated(true)
    }, [])

    if (!hydrated) return null

    return <Component {...(props as T & JSX.IntrinsicAttributes)} />
  }
}

export default noHydrate
