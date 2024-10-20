'use client'

import { useEffect, useState } from 'react'
import { WebApp } from '@twa-dev/types'
import HomeUI from './HomeUI'

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [inviterInfo, setInviterInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState('')
  const [buttonStage1, setButtonStage1] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage2, setButtonStage2] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage3, setButtonStage3] = useState<'check' | 'claim' | 'claimed'>('check')
  const [farmingStatus, setFarmingStatus] = useState<'farm' | 'farming' | 'claim'>('farm')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()

      const initDataUnsafe = tg.initDataUnsafe || {}

      if (initDataUnsafe.user) {
        fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...initDataUnsafe.user, start_param: initDataUnsafe.start_param || null })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error)
            } else {
              setUser(data.user)
              setInviterInfo(data.inviterInfo)
              setButtonStage1(data.user.claimedButton1 ? 'claimed' : 'check')
              setButtonStage2(data.user.claimedButton2 ? 'claimed' : 'check')
              setButtonStage3(data.user.claimedButton3 ? 'claimed' : 'check')
              checkFarmingStatus(data.user)
            }
          })
          .catch(() => {
            setError('Failed to fetch user data')
          })
      } else {
        setError('No user data available')
      }
    } else {
      setError('This app should be opened in Telegram')
    }
  }, [])

  useEffect(() => {
    const updateOnlineStatus = () => {
      if (user) {
        fetch('/api/update-online-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ telegramId: user.telegramId, isOnline: true }),
        })
      }
    }

    const interval = setInterval(updateOnlineStatus, 60000) // Update every minute

    return () => {
      clearInterval(interval)
      if (user) {
        fetch('/api/update-online-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ telegramId: user.telegramId, isOnline: false }),
        })
      }
    }
  }, [user])

  const checkFarmingStatus = (userData: any) => {
    if (userData.startFarming) {
      const now = new Date()
      const startTime = new Date(userData.startFarming)
      const timeDiff = now.getTime() - startTime.getTime()
      if (timeDiff < 30000) { // Less than 30 seconds
        setFarmingStatus('farming')
        setTimeout(() => setFarmingStatus('claim'), 30000 - timeDiff)
      } else {
        setFarmingStatus('claim')
      }
    } else {
      setFarmingStatus('farm')
    }
  }

  const handleIncreasePoints = async (pointsToAdd: number, buttonId: string) => {
    if (!user) return

    try {
      const res = await fetch('/api/increase-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramId: user.telegramId, pointsToAdd, buttonId }),
      })
      const data = await res.json()
      if (data.success) {
        setUser({ ...user, points: data.points })
        setNotification(`Points increased successfully! (+${pointsToAdd})`)
        setTimeout(() => setNotification(''), 3000)
      } else {
        setError('Failed to increase points')
      }
    } catch {
      setError('An error occurred while increasing points')
    }
  }

  const handleFarmClick = async () => {
    if (!user) return

    if (farmingStatus === 'farm') {
      try {
        const res = await fetch('/api/start-farming', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ telegramId: user.telegramId }),
        })
        const data = await res.json()
        if (data.success) {
          setFarmingStatus('farming')
          setTimeout(() => setFarmingStatus('claim'), 30000)
        }
      } catch (error) {
        console.error('Error starting farming:', error)
      }
    } else if (farmingStatus === 'claim') {
      handleIncreasePoints(200, 'farmButton')
      setFarmingStatus('farm')
    }
  }

  const handleButtonClick1 = () => {
    if (buttonStage1 === 'check') {
      window.open('https://youtu.be/xvFZjo5PgG0', '_blank')
      setButtonStage1('claim')
    }
  }

  const handleButtonClick2 = () => {
    if (buttonStage2 === 'check') {
      window.open('https://twitter.com', '_blank')
      setButtonStage2('claim')
    }
  }

  const handleButtonClick3 = () => {
    if (buttonStage3 === 'check') {
      window.open('https://telegram.org', '_blank')
      setButtonStage3('claim')
    }
  }

  const handleClaim1 = () => {
    if (buttonStage1 === 'claim') {
      setIsLoading(true)
      handleIncreasePoints(5, 'button1')
      setTimeout(() => {
        setButtonStage1('claimed')
        setIsLoading(false)
      }, 3000)
    }
  }

  const handleClaim2 = () => {
    if (buttonStage2 === 'claim') {
      handleIncreasePoints(3, 'button2')
      setButtonStage2('claimed')
    }
  }

  const handleClaim3 = () => {
    if (buttonStage3 === 'claim') {
      handleIncreasePoints(9, 'button3')
      setButtonStage3('claimed')
    }
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  if (!user) return <div className="container mx-auto p-4">Loading...</div>

  return (
    <HomeUI 
      user={user}
      buttonStage1={buttonStage1}
      buttonStage2={buttonStage2}
      buttonStage3={buttonStage3}
      farmingStatus={farmingStatus}
      isLoading={isLoading}
      notification={notification}
      handleButtonClick1={handleButtonClick1}
      handleButtonClick2={handleButtonClick2}
      handleButtonClick3={handleButtonClick3}
      handleClaim1={handleClaim1}
      handleClaim2={handleClaim2}
      handleClaim3={handleClaim3}
      handleFarmClick={handleFarmClick}
    />
  )
}
