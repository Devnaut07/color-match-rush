import { connectDB } from "@/lib/db"
import { getCurrentRound } from "@/lib/utils/getCurrentRound"

export const dynamic = 'force-dynamic'

/**
 * End the current round and start a fresh one
 * This sets the current round's endTime to now, which will cause getCurrentRound to create a new round
 * 
 * Usage: GET /api/round/end
 */
export async function GET() {
  try {
    const db = await connectDB()
    const roundsCollection = db.collection("rounds")
    
    const round = await getCurrentRound()

    if (!round) {
      return Response.json({ error: "No active round found" }, { status: 404 })
    }

    // End the current round by setting endTime to now
    const now = new Date()
    await roundsCollection.updateOne(
      { roundId: round.roundId },
      { $set: { endTime: now } }
    )

    // Get the new round (will be created automatically by getCurrentRound)
    const newRound = await getCurrentRound()

    return Response.json({
      success: true,
      message: "Round ended and new round started",
      endedRoundId: round.roundId,
      newRoundId: newRound?.roundId,
      newRoundStartTime: newRound?.startTime,
      newRoundEndTime: newRound?.endTime,
    })
  } catch (error) {
    console.error("End round error:", error)
    return Response.json({ error: "Failed to end round" }, { status: 500 })
  }
}

