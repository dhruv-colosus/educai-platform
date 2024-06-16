"use client"

import { ArrowDown, ArrowDownUp, LoaderCircle, ScanLine } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { use, useEffect, useState } from "react"
import { getEstimate } from "@/app/actions"
import { useDebounce } from "@uidotdev/usehooks"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BasicTokenInfo } from "@/types"
import Image from "next/image"

enum LoadingState {
  IDLE = "Idle",
  LOADING = "Loading",
  SUCCESS = "Success",
  ERROR = "Error",
}

interface SwapProps {
  tokenAddress: string
}

interface PopupInfo {
  status: string
  description: string
}

export function Swap({ tokenAddress }: SwapProps) {
  const [tokenIn, setTokenIn] = useState(0)
  const [tokenOut, setTokenOut] = useState(0)
  // const [otherAddress, setOtherAddress] = useState(
  //   "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
  // )
  const otherAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
  const [otherWay, setOtherWay] = useState(false)

  const [from, setFrom] = useState<BasicTokenInfo | undefined>(undefined)
  const [to, setTo] = useState<BasicTokenInfo | undefined>(undefined)

  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null)

  const [loadingState, setLoadingState] = useState(LoadingState.IDLE)
  const [error, setError] = useState("")

  const debouncedIn = useDebounce(tokenIn, 500)

  useEffect(() => {
    const abortC = new AbortController()
    const fromAddress = otherWay ? tokenAddress : otherAddress
    const toAddress = otherWay ? otherAddress : tokenAddress

    setFrom(undefined)
    setTo(undefined)
    Promise.all([
      fetch("/api/token?address=" + fromAddress, {
        signal: abortC.signal,
      }).then((res) => res.json()),

      fetch("/api/token?address=" + toAddress, { signal: abortC.signal }).then(
        (res) => res.json()
      ),
    ]).then(([_from, _to]) => {
      setFrom(_from.info)
      setTo(_to.info)
    })

    return () => abortC.abort()
  }, [tokenAddress, otherAddress, otherWay])

  useEffect(() => {
    if (debouncedIn !== 0 && from && to) {
      const abortC = new AbortController()
      setTokenOut(-1)
      setError("")
      fetch(
        "/api/swap/estimate?" +
          new URLSearchParams({
            from: from?.address || "",
            to: to?.address || "",
            amount: debouncedIn.toString(),
          }),
        { signal: abortC.signal }
      )
        .then((res) => res.json())
        .then(({ amount, hasBalance }) => {
          if (!hasBalance) {
            setError("Insufficient Balance")
          }
          setTokenOut(Number(amount))
        })
        .catch((e) => {
          if (e instanceof Error) {
            if (e.name !== "AbortError") {
              console.error(e)
              setTokenOut(-2)
            }
          }
        })

      return () => abortC.abort()
    } else {
      setTokenOut(0)
    }
  }, [debouncedIn, from, to])

  const doSwap = () => {
    setLoadingState(LoadingState.LOADING)
    fetch("/api/swap/do", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        from: from?.address,
        to: to?.address,
        amount: tokenIn.toString(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLoadingState(LoadingState.SUCCESS)
        } else {
          throw new Error("unknown error")
        }
      })
      .catch((e) => {
        console.log(e)
        setLoadingState(LoadingState.ERROR)
      })
      .finally(() => {
        setTokenIn(0)
        setTimeout(() => {
          setLoadingState(LoadingState.IDLE)
        }, 5000)
      })
  }

  return (
    <>
      <Card className="bg-foreground px-0 @md:px-4 md:min-w-[300px]">
        <CardHeader className="p-4 @md:p-6">
          <CardTitle className="text-muted text-base font-medium flex">
            <ArrowDownUp className="me-2" />
            Swap
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 @md:p-6 pt-0">
          <SwapInput
            isIn={true}
            info={from}
            value={tokenIn}
            onChange={setTokenIn}
          />
          <button
            className="my-4 block mx-auto w-fit rounded-full p-4 bg-gray-500 bg-opacity-40 cursor-pointer"
            onClick={() => setOtherWay(!otherWay)}
          >
            <ArrowDown />
          </button>
          <SwapInput isIn={false} info={to} value={tokenOut} />
          <button
            className="bg-accent w-full py-2 mt-8 text-center rounded-full font-bold text-lg disabled:brightness-50 disabled:cursor-not-allowed"
            disabled={tokenOut <= 0 || error !== ""}
            onClick={doSwap}
          >
            Swap
          </button>
          <p className="mx-auto text-red-400 w-fit mt-4">{error}</p>
        </CardContent>
      </Card>

      <Dialog
        open={loadingState !== LoadingState.IDLE}
        onOpenChange={() => setPopupInfo(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {loadingState}
            </DialogTitle>
            <DialogDescription className="flex flex-col items-center text-base">
              {loadingState === LoadingState.LOADING ? (
                <div className="flex flex-col items-center mt-4">
                  <LoaderCircle className="animate-spin" />
                  <p className="mt-4">
                    Please wait for the transaction to process
                  </p>
                </div>
              ) : loadingState === LoadingState.SUCCESS ? (
                <div>The token swap was successful!</div>
              ) : (
                <div>The token swap has failed</div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface SwapInputParams {
  isIn: boolean
  info: BasicTokenInfo | undefined
  value: number
  onChange?: (val: number) => void
}

const SwapInput = ({ isIn, info, value, onChange }: SwapInputParams) => {
  return (
    <div>
      <p className="text-muted mb-2">You {isIn ? "Pay" : "Receive"}</p>
      <div className="flex flex-col gap-2 p-6 bg-gray-500 bg-opacity-40 rounded-lg relative">
        <input
          className={`bg-transparent text-3xl font-bold w-0 min-w-full pe-20 outline-none border-none disabled:cursor-not-allowed ${
            value === -1 ? "text-gray-400" : "text-opacity-100"
          }`}
          type={isIn ? "number" : "text"}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === "e") {
              e.preventDefault()
            }
          }}
          disabled={!isIn}
          onChange={(e) => {
            if (onChange) onChange(Number(e.target.value))
          }}
          value={value >= 0 ? value : value === -1 ? "Loading..." : "Error"}
        />
        {/* <p className="-my-2 text-sm text-muted font-medium">$321.4</p> */}
        <div className="absolute text-lg font-bold right-4 top-[30px] flex gap-2 items-center">
          {info?.symbol || (
            <LoaderCircle className="animate-spin opacity-50" size={16} />
          )}
          {info?.logoURI && (
            <Image
              className="object-cover rounded-full w-6 h-6"
              src={info.logoURI}
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </div>
      </div>
    </div>
  )
}
