"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits } from "viem"
import { useRouter } from "next/navigation"

// cUSD contract address on Celo Mainnet
const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a" as `0x${string}`

// ERC20 Transfer ABI
const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const

// Treasury contract address - deployed ColorMatchRushTreasury contract on Celo Mainnet
// This contract holds entry fees and distributes prizes automatically
const TREASURY_ADDRESS = (process.env.NEXT_PUBLIC_TREASURY_ADDRESS || "0xc328abADc8e0B205948ECD359F341bd9F3d7ebD2") as `0x${string}`

interface JoinRoundButtonProps {
  roundId: string
  entryFee: number
  pool: number
  hasJoined: boolean
}

export default function JoinRoundButton({ roundId, entryFee, pool, hasJoined }: JoinRoundButtonProps) {
  const router = useRouter()
  const { address, isConnected, chain } = useAccount()
  const [loading, setLoading] = useState(false)

  const {
    writeContract,
    data: hash,
    isPending: isPendingTx,
    error: txError,
    reset: resetWriteContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const handleJoinRound = async (txHash: string) => {
    if (!address) return

    setLoading(true)
    try {
      const response = await fetch("/api/round/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          txHash,
        }),
      })

      if (response.ok) {
        // Refresh the page to update hasJoined status
        window.location.href = "/play"
      } else {
        const error = await response.json()
        alert(error.error || "Failed to join round")
      }
    } catch (error) {
      console.error("Join round error:", error)
      alert("Failed to join round")
    } finally {
      setLoading(false)
    }
  }

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed && hash && address) {
      handleJoinRound(hash)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, hash, address])

  const handleJoin = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first")
      return
    }

    if (hasJoined) {
      router.push("/game")
      return
    }

    // Check if on correct network (Celo Mainnet)
    if (chain && chain.id !== 42220) {
      alert("Please switch to Celo Mainnet to play")
      return
    }

    // Use treasury address - your wallet address where entry fees will be collected
    // IMPORTANT: Treasury address should be a WALLET address, not the cUSD contract address
    let recipient: `0x${string}`
    
    if (TREASURY_ADDRESS.toLowerCase() === CUSD_ADDRESS.toLowerCase()) {
      // Safety check: prevent sending to cUSD contract address
      alert("⚠️ Error: Treasury address cannot be the cUSD contract address!\n\nPlease set NEXT_PUBLIC_TREASURY_ADDRESS to your wallet address.")
      console.error("Treasury address is set to cUSD contract address. Cannot proceed.")
      return
    }
    
    // Use the configured treasury address (your wallet)
    recipient = TREASURY_ADDRESS

    try {
      // Convert entry fee to wei (cUSD has 18 decimals)
      const amount = parseUnits(entryFee.toString(), 18)

      console.log("Initiating payment:", {
        cusdAddress: CUSD_ADDRESS,
        recipient,
        amount: amount.toString(),
        entryFee,
        chainId: chain?.id,
        hasWriteContract: !!writeContract,
      })

      // Reset any previous errors
      if (resetWriteContract) {
        resetWriteContract()
      }

      // Send ERC20 transfer transaction
      const result = writeContract({
        address: CUSD_ADDRESS,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [recipient, amount],
      })

      console.log("writeContract called, result:", result)
    } catch (error: any) {
      console.error("Transaction error:", error)
      alert(error?.message || "Failed to initiate payment. Please check console for details.")
    }
  }

  const isProcessing = isPendingTx || isConfirming || loading

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleJoin}
        disabled={isProcessing || hasJoined}
        className={`w-full py-5 px-6 rounded-2xl text-xl font-black shadow-lg transition-all ${
          hasJoined
            ? "bg-gradient-to-r from-[#35d07f] to-[#fbcc5c] text-[#1a1a1a]"
            : "bg-gradient-to-r from-[#35d07f] to-[#35d07f]/80 text-white"
        } disabled:opacity-50`}
      >
        {isProcessing
          ? isPendingTx
            ? "Confirm in wallet..."
            : isConfirming
            ? "Processing..."
            : "Joining..."
          : hasJoined
          ? "Play Game"
          : `Join Round ($${entryFee.toFixed(2)})`}
      </motion.button>
      {txError && (
        <p className="text-red-500 text-sm mt-2 text-center">
          Transaction failed: {txError.message}
        </p>
      )}
    </>
  )
}
