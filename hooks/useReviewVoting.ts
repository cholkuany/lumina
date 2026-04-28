// hooks/useReviewVoting.ts
'use client'

import { useState, useCallback } from 'react'

interface VoteState {
  upvotes: number
  downvotes: number
  userVote: 'up' | 'down' | null
}

interface UseReviewVotingOptions {
  reviewId: string
  initialUpvotes?: number
  initialDownvotes?: number
  userId?: string
}

export function useReviewVoting({
  reviewId,
  initialUpvotes = 0,
  initialDownvotes = 0,
  userId,
}: UseReviewVotingOptions) {
  const [voteState, setVoteState] = useState<VoteState>({
    upvotes: initialUpvotes,
    downvotes: initialDownvotes,
    userVote: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitVote = useCallback(
    async (vote: 'up' | 'down') => {
      if (!userId) {
        setError('Please log in to vote')
        return
      }

      setIsLoading(true)
      setError(null)

      // Optimistic update
      const previousState = { ...voteState }
      setVoteState((prev) => {
        const newState = { ...prev }

        // Remove previous vote effect
        if (prev.userVote === 'up') newState.upvotes--
        if (prev.userVote === 'down') newState.downvotes--

        // Apply new vote or toggle off
        if (prev.userVote === vote) {
          newState.userVote = null
        } else {
          newState.userVote = vote
          if (vote === 'up') newState.upvotes++
          else newState.downvotes++
        }

        return newState
      })

      try {
        const response = await fetch(`/api/reviews/${reviewId}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vote, userId }),
        })

        if (!response.ok) {
          throw new Error('Failed to submit vote')
        }

        const data = await response.json()
        setVoteState({
          upvotes: data.upvotes,
          downvotes: data.downvotes,
          userVote: data.userVote,
        })
      } catch (err) {
        // Revert optimistic update
        setVoteState(previousState)
        setError('Failed to submit vote')
      } finally {
        setIsLoading(false)
      }
    },
    [reviewId, userId, voteState]
  )

  const upvote = useCallback(() => submitVote('up'), [submitVote])
  const downvote = useCallback(() => submitVote('down'), [submitVote])

  return {
    ...voteState,
    isLoading,
    error,
    upvote,
    downvote,
  }
}