'use client'

import { useEffect, useState } from 'react'
import { WebApp } from '@twa-dev/types'
import TaskUI from './TaskUI'

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState('')
  const [buttonStages, setButtonStages] = useState<{ [key: string]: 'check' | 'claim' | 'claimed' }>({})
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({})

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
              setButtonStage1(data.user.claimedButton4 ? 'claimed' : 'check')
              setButtonStage2(data.user.claimedButton5 ? 'claimed' : 'check')
              setButtonStage3(data.user.claimedButton6 ? 'claimed' : 'check')
              setButtonStage7(data.user.claimedButton7 ? 'claimed' : 'check')
              setButtonStage8(data.user.claimedButton8 ? 'claimed' : 'check')
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

  const handleButtonClick = (buttonId: string) => {
    const links: { [key: string]: string } = {
      button4: 'https://youtu.be/xvFZjo5PgG0',
      button5: 'https://twitter.com',
      button6: 'https://telegram.org',
      button7: 'https://discord.com',
      button8: 'https://tiktok.com',
    }
    
    if (buttonStages[buttonId] === 'check') {
      window.open(links[buttonId], '_blank')
      setButtonStages(prev => ({ ...prev, [buttonId]: 'claim' }))
    }
  }

  const handleClaim = (buttonId: string) => {
    if (buttonStages[buttonId] === 'claim') {
      setIsLoading(prev => ({ ...prev, [buttonId]: true }))
      handleIncreasePoints(200, buttonId)
      setTimeout(() => {
        setButtonStages(prev => ({ ...prev, [buttonId]: 'claimed' }))
        setIsLoading(prev => ({ ...prev, [buttonId]: false }))
      }, 3000)
    }
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  if (!user) return <div className="loader"></div>

  return (
    <TaskUI 
      user={user}
      buttonStages={buttonStages}
      isLoading={isLoading}
      notification={notification}
      handleButtonClick={handleButtonClick}
      handleClaim={handleClaim}
    />
  )
}
